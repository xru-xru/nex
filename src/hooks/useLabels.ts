import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import DOMPurify from 'dompurify';

import { NexoyaPortfolioLabel, NexoyaPortfolioV2 } from '../types';

import { useTeam } from '../context/TeamProvider';

import { useDeleteLabel } from '../graphql/labels/mutationDeleteLabel';
import { useCreateOrUpdateLabel } from '../graphql/labels/mutationCreateLabel';
import { ExtendedLabel } from '../routes/portfolio/components/Labels/LabelsEditTable';
import { useLabelsQuery } from '../graphql/labels/queryLabels';

const CONSTRAINT_ERROR_MESSAGE_INCLUDES = 'constraint fails';

interface Props {
  portfolioMeta: NexoyaPortfolioV2;
  initialLabels?: NexoyaPortfolioLabel[];
}

export const useLabels = ({ portfolioMeta, initialLabels = [] }: Props) => {
  const { teamId } = useTeam();
  const portfolioId = portfolioMeta?.portfolioId;
  const { data: labelsData } = useLabelsQuery({ portfolioId });

  const [labels, setLabels] = useState<Partial<ExtendedLabel>[]>([]);

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

  const [deleteLabel, { loading: loadingDelete }] = useDeleteLabel({
    portfolioId,
    labelId: null,
  });

  const [createOrUpdateLabel, { loading: loadingCreateOrUpdate }] = useCreateOrUpdateLabel({
    portfolioId,
    name: null,
    labelId: null,
  });

  const handleEdit = (label: ExtendedLabel) => {
    const isNewLabel = label.labelId < 0;
    createOrUpdateLabel({
      variables: {
        name: DOMPurify.sanitize(label.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
        portfolioId,
        teamId,
        labelId: isNewLabel ? null : label.labelId,
      },
    }).then((resp) => {
      isNewLabel
        ? setLabels((prevState) => [...prevState, resp.data.createOrUpdateLabel])
        : setLabels((prevState) => {
            return prevState.map((prevLabelState) => {
              if (prevLabelState.labelId === label.labelId) {
                return { ...prevLabelState, isEditing: !prevLabelState.isEditing };
              }
              return prevLabelState;
            });
          });
    });
  };

  const handleDelete = (labelId: number) => {
    if (labelId < 0) {
      setLabels((prevState) => {
        return prevState.filter((igState) => igState.labelId !== labelId);
      });
      return;
    }

    deleteLabel({
      variables: {
        labelId,
        portfolioId,
        teamId,
      },
    })
      .then(() => {
        setLabels((prevState) => {
          return prevState.filter((igState) => igState.labelId !== labelId);
        });
      })
      .catch((error) => {
        if (error.message.includes(CONSTRAINT_ERROR_MESSAGE_INCLUDES)) {
          toast.error('The label is currently linked to content and cannot be removed');
        } else {
          toast.error(error.message);
        }
      });
  };

  return {
    labels,
    setLabels,
    handleEdit,
    handleDelete,
    loadingDelete,
    loadingUpdate: loadingCreateOrUpdate,
  };
};
