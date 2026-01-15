import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

import { NexoyaPortfolioLabel, NexoyaPortfolioV2 } from '../types';
import { useTeam } from '../context/TeamProvider';
import { useDeleteLabel } from '../graphql/labels/mutationDeleteLabel';
import { useCreateOrUpdateLabel } from '../graphql/labels/mutationCreateLabel';
import { ExtendedLabel } from '../routes/portfolio/components/Labels/LabelsEditTable';
import { useLabelsQuery } from '../graphql/labels/queryLabels';
import { validate } from 'uuid';

const CONSTRAINT_ERROR_MESSAGE_INCLUDES = 'constraint fails';

interface Props {
  portfolioMeta: NexoyaPortfolioV2;
  initialLabels?: NexoyaPortfolioLabel[];
}

// we give the labelId a type of string | number because it can be a string (UUID) or a number (positive ID)
const isUUID = (id: string | number): id is string => {
  return typeof id === 'string' && validate(id);
};

export const useLocalLabels = ({ portfolioMeta, initialLabels = [] }: Props) => {
  const { teamId } = useTeam();
  const portfolioId = portfolioMeta?.portfolioId;
  const { data: labelsData } = useLabelsQuery({ portfolioId });

  const [labels, setLabels] = useState<Partial<ExtendedLabel>[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    toCreate: Partial<ExtendedLabel>[];
    toUpdate: Partial<ExtendedLabel>[];
    toDelete: number[];
  }>({
    toCreate: [],
    toUpdate: [],
    toDelete: [],
  });

  useEffect(() => {
    // Define a function to update labels to avoid inline function creation
    const updateLabels = () => {
      const newLabels = [...(labelsData?.portfolioV2?.labels || initialLabels)];
      // sort labels by name
      newLabels.sort((a, b) => a.name.localeCompare(b.name));
      setLabels(newLabels);
    };

    updateLabels();
  }, [labelsData]);

  const [deleteLabel] = useDeleteLabel({
    portfolioId,
    labelId: null,
  });

  const [createOrUpdateLabel] = useCreateOrUpdateLabel({
    portfolioId,
    name: null,
    labelId: null,
  });

  const handleEdit = (label: ExtendedLabel) => {
    const isNewLabel = isUUID(label.labelId);

    setPendingChanges((prev) => {
      if (isNewLabel) {
        // Check if a label with this temporary ID already exists in toCreate
        const existingIndex = prev.toCreate.findIndex((item) => item.labelId === label.labelId);

        if (existingIndex > -1) {
          // If it exists, update the existing entry
          const updatedToCreate = [...prev.toCreate];
          updatedToCreate[existingIndex] = label;
          return {
            ...prev,
            toCreate: updatedToCreate,
          };
        } else {
          // If it doesn't exist, add it as a new label to be created
          return {
            ...prev,
            toCreate: [...prev.toCreate, label],
          };
        }
      } else {
        // For existing labels (positive labelId), add to toUpdate or update if already there
        const existingUpdateIndex = prev.toUpdate.findIndex((item) => item.labelId === label.labelId);

        if (existingUpdateIndex > -1) {
          // If it exists, update the existing entry in toUpdate
          const updatedToUpdate = [...prev.toUpdate];
          updatedToUpdate[existingUpdateIndex] = label;
          return {
            ...prev,
            toUpdate: updatedToUpdate,
          };
        } else {
          // If it doesn't exist, add it to toUpdate
          return {
            ...prev,
            toUpdate: [...prev.toUpdate, label],
          };
        }
      }
    });

    setLabels((prevState) => {
      // Find the index of the label being edited (either new with temp ID or existing with real ID)
      const existingLabelIndex = prevState.findIndex((prevLabel) => prevLabel.labelId === label.labelId);

      if (existingLabelIndex > -1) {
        // If the label is found, update it in the local state
        const updatedLabels = [...prevState];
        // Merge the changes from the edited label, ensuring isEditing state is toggled correctly
        updatedLabels[existingLabelIndex] = {
          ...updatedLabels[existingLabelIndex],
          ...label,
          isEditing: !updatedLabels[existingLabelIndex].isEditing, // Toggle isEditing state
        };
        return updatedLabels;
      } else if (isNewLabel) {
        // If it's a new label and not found (should ideally not happen with correct logic above, but as a fallback), add it
        return [...prevState, label];
      }
      // If it's an existing label and not found (indicates a potential issue elsewhere), return previous state
      return prevState;
    });
  };

  const handleDelete = (labelId: number) => {
    if (isUUID(labelId)) {
      setPendingChanges((prev) => ({
        ...prev,
        toCreate: prev.toCreate.filter((label) => label.labelId !== labelId),
      }));
      setLabels((prevState) => prevState.filter((label) => label.labelId !== labelId));
      return;
    }

    setPendingChanges((prev) => ({
      ...prev,
      toDelete: [...prev.toDelete, labelId],
    }));
    setLabels((prevState) => prevState.filter((label) => label.labelId !== labelId));
  };

  const resetLabels = () => {
    setLabels(labelsData?.portfolioV2?.labels || []);
    setPendingChanges({
      toCreate: [],
      toUpdate: [],
      toDelete: [],
    });
  };

  const commitChanges = async () => {
    try {
      const createdLabelsMap: { [tempId: number]: NexoyaPortfolioLabel } = {};

      // Handle creations
      for (const label of pendingChanges.toCreate) {
        await createOrUpdateLabel({
          variables: {
            name: DOMPurify.sanitize(label.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
            portfolioId,
            teamId,
            labelId: null, // Ensure labelId is null for creation
          },
        });
      }

      // Update local state with real IDs for created labels
      setLabels((prevState) =>
        prevState
          .filter((label) => !pendingChanges.toDelete.includes(label.labelId!)) // Filter out deleted labels
          .map((label) => {
            if (label.labelId! < 0 && createdLabelsMap[label.labelId!]) {
              // Replace the temporary label with the created one from the backend
              return createdLabelsMap[label.labelId!];
            }
            // Apply updates for labels that were in toUpdate (using their original IDs)
            const updatedLabel = pendingChanges.toUpdate.find((update) => update.labelId === label.labelId);
            if (updatedLabel) {
              // Ensure we don't lose the editing state if it was being edited
              return { ...label, ...updatedLabel, isEditing: updatedLabel.isEditing };
            }
            return label;
          }),
      );

      // Handle updates (now operating on labels potentially updated with real IDs)
      // We need to find the updated versions of labels, considering those that were just created
      const labelsToUpdate = pendingChanges.toUpdate
        .map((updatedLabel) => {
          // Find the corresponding label in the current state, which might have a new ID
          const currentStateLabel = labels.find(
            (l) =>
              l.labelId === updatedLabel.labelId ||
              (l.labelId! < 0 && createdLabelsMap[l.labelId!]?.labelId === updatedLabel.labelId),
          );

          if (currentStateLabel) {
            return {
              ...updatedLabel,
              labelId: currentStateLabel.labelId, // Use the potentially new real ID
            };
          }
          return null; // Should not happen if logic is correct, but good for safety
        })
        .filter(Boolean) as Partial<ExtendedLabel>[]; // Filter out any nulls and cast

      for (const label of labelsToUpdate) {
        await createOrUpdateLabel({
          variables: {
            name: DOMPurify.sanitize(label.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
            portfolioId,
            teamId,
            labelId: label.labelId, // Use the real ID
          },
        });
      }

      // Handle deletions
      for (const labelId of pendingChanges.toDelete) {
        try {
          await deleteLabel({
            variables: {
              labelId,
              portfolioId,
              teamId,
            },
          });
        } catch (error) {
          if (error.message.includes(CONSTRAINT_ERROR_MESSAGE_INCLUDES)) {
            toast.error('The label is currently linked to content and cannot be removed');
          } else {
            toast.error(error.message);
          }
          // Restore the label in the UI if deletion fails
          // Find the label from the original labelsData before changes were applied
          const labelToRestore = labelsData?.portfolioV2?.labels.find((l) => l.labelId === labelId);
          if (labelToRestore) {
            setLabels((prev) => {
              // Prevent adding duplicates if the label was already restored by a prior error
              if (!prev.some((l) => l.labelId === labelToRestore.labelId)) {
                return [...prev, labelToRestore];
              }
              return prev;
            });
          }
        }
      }

      // Reset pending changes after successful commit
      setPendingChanges({
        toCreate: [],
        toUpdate: [],
        toDelete: [],
      });

      toast.success('Label changes saved successfully.');
    } catch (error) {
      toast.error('Failed to save label changes');
      // Depending on desired behavior, you might want to revert local state or show a specific error for failed creations/updates
      console.error('Commit failed:', error);
      throw error; // Re-throw to allow calling component to handle
    }
  };

  return {
    labels,
    setLabels,
    handleEdit,
    handleDelete,
    resetLabels,
    commitChanges,
    hasPendingChanges:
      pendingChanges.toCreate.length > 0 || pendingChanges.toUpdate.length > 0 || pendingChanges.toDelete.length > 0,
  };
};
