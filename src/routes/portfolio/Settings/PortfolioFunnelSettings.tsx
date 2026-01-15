import React, { useCallback, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import Button from '../../../components/Button';
import IndividualFunnelEdit from '../components/PortfolioEditFunnel/IndividualFunnelEdit';
import { useFunnelStepsV2Query } from '../../../graphql/funnelSteps/queryFunnelSteps';
import { useRouteMatch } from 'react-router';
import dayjs from 'dayjs';
import {
  NexoyaFunnelStepType,
  NexoyaFunnelStepV2,
  NexoyaUpsertPortfolioFunnelStepsMutationFunnelStepInput,
} from '../../../types';
import { useUpsertPortfolioFunnelSteps } from '../../../graphql/funnelSteps/mutationUpsertPortfolioFunnelSteps';
import { toast } from 'sonner';
import { track } from '../../../constants/datadog';
import { EVENT } from '../../../constants/events';
import { useTeam } from '../../../context/TeamProvider';
import { ConfirmationDialog } from '../components/PortfolioEditFunnel/ConfirmationDialog';
import { useDialogState } from '../../../components/Dialog';
import { isEqual } from 'lodash';
import { useUpdateFunnelStepTarget } from '../../../graphql/funnelSteps/mutationUpdateFunnelStepTarget';

import { useUnsavedChanges } from '../../../context/UnsavedChangesProvider';
import { areFunnelStepsEqual, extractFunnelSteps } from '../../../utils/funnelSteps';
import { usePortfolioV2MetaQuery } from '../../../graphql/portfolio/queryPortfolioMeta';
import { GLOBAL_DATE_FORMAT } from '../../../utils/dates';
import { useDeleteFunnelStep } from '../../../graphql/funnelSteps/mutationDeleteFunnelStep';

const DRAG_TYPE = 'FUNNEL_STEP';

export function PortfolioFunnelSettings() {
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { teamId } = useTeam();

  const { data: funnelStepsData, loading } = useFunnelStepsV2Query({
    portfolioId,
  });

  const { otherFunnelSteps: initialFunnelSteps } = extractFunnelSteps(funnelStepsData?.portfolioV2?.funnelSteps);

  usePortfolioV2MetaQuery({
    start: dayjs().utc().format(GLOBAL_DATE_FORMAT),
    end: dayjs().utc().format(GLOBAL_DATE_FORMAT),
    portfolioId,
    onCompleted: (data) => {
      const defaultTargetFunnelStepId = data?.portfolioV2?.defaultOptimizationTarget?.funnelStepId;
      setSelectedFunnelStepTargetId(defaultTargetFunnelStepId);
      setDefaultTargetFunnelStepId(defaultTargetFunnelStepId);
    },
  });

  const { setHasUnsavedChanges } = useUnsavedChanges();

  const [upsertPortfolioFunnelSteps, { loading: upsertLoading }] = useUpsertPortfolioFunnelSteps({ portfolioId });
  const [updateFunnelStepTarget, { loading: updateFunnelTargetLoading }] = useUpdateFunnelStepTarget({ portfolioId });
  const [deleteFunnelStepMutation, { loading: deleteFunnelStepLoading }] = useDeleteFunnelStep({ portfolioId });

  const [funnelSteps, setFunnelSteps] = useState<NexoyaFunnelStepV2[]>([]);
  const [defaultTargetFunnelStepId, setDefaultTargetFunnelStepId] = useState<number>();
  const [selectedFunnelStepTargetId, setSelectedFunnelStepTargetId] = useState<number>();

  const hasNoChanges =
    isEqual(defaultTargetFunnelStepId, selectedFunnelStepTargetId) &&
    areFunnelStepsEqual(initialFunnelSteps, funnelSteps);

  const { isOpen: isApplyOpen, openDialog: openApplyDialog, closeDialog: closeApplyDialog } = useDialogState();
  const { isOpen: isDiscardOpen, openDialog: openDiscardDialog, closeDialog: closeDiscardDialog } = useDialogState();

  useEffect(() => {
    if (funnelStepsData?.portfolioV2?.funnelSteps) {
      const { otherFunnelSteps } = extractFunnelSteps(funnelStepsData.portfolioV2.funnelSteps);
      setFunnelSteps(otherFunnelSteps);
    }
  }, [funnelStepsData, loading]);

  const moveFunnelStep = useCallback((dragIndex, hoverIndex) => {
    setFunnelSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      const [movedStep] = updatedSteps.splice(dragIndex, 1);
      updatedSteps.splice(hoverIndex, 0, movedStep);
      return updatedSteps;
    });
  }, []);

  const addFunnelStep = (newFunnelStep: { title: string; type: NexoyaFunnelStepType; position: number }) => {
    setFunnelSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      // Insert the new funnel step at the specified position
      updatedSteps.splice(newFunnelStep.position, 0, {
        ...newFunnelStep,
        isMeasured: false,
        isAttributed: false,
        funnelStepId: -dayjs().unix(), // Temporary negative ID until backend sync
      });
      return updatedSteps.map((step, index) => ({
        ...step,
        position: index + 1, // Recalculate positions to ensure consistency
      }));
    });
  };

  const deleteFunnelStep = (index: number) => {
    setFunnelSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps.splice(index, 1); // Remove the step at the specified index
      return updatedSteps.map((step, newIndex) => ({
        ...step,
        position: newIndex + 1, // Recalculate positions
      }));
    });
  };

  const [, dropRef] = useDrop({
    accept: DRAG_TYPE,
    hover(item: any, monitor) {
      if (!monitor.isOver()) return;

      const dragIndex = item.index;
      const hoverIndex = funnelSteps.findIndex((_step, i) => i === item.index);

      if (dragIndex !== hoverIndex && hoverIndex >= 0) {
        moveFunnelStep(dragIndex, hoverIndex);
        item.index = hoverIndex; // Update the dragged item's index
      }
    },
  });

  const handleSubmit = async () => {
    // @ts-ignore
    const funnelStepsToUpsert: NexoyaUpsertPortfolioFunnelStepsMutationFunnelStepInput[] = funnelSteps.map((step) => ({
      funnelStepId: step.funnelStepId >= 0 ? step.funnelStepId : null,
      title: step.title,
      type: step.type,
    }));

    const attributedFunnelSteps = funnelSteps.filter(
      (step) =>
        step.isAttributed &&
        !initialFunnelSteps.some((initial) => initial.funnelStepId === step.funnelStepId && initial.isAttributed),
    );

    try {
      // 1. Update target funnel step if changed
      if (selectedFunnelStepTargetId !== defaultTargetFunnelStepId) {
        await updateFunnelStepTarget({
          variables: {
            teamId,
            portfolioId,
            funnelStepId: selectedFunnelStepTargetId,
          },
        });
        setDefaultTargetFunnelStepId(selectedFunnelStepTargetId);
      }

      // 2. Delete operations for removed steps
      const initialFunnelStepIds = initialFunnelSteps.filter((s) => s.funnelStepId > 0).map((s) => s.funnelStepId);
      const currentFunnelStepIds = funnelSteps.filter((s) => s.funnelStepId > 0).map((s) => s.funnelStepId);
      const deletedFunnelStepIds = initialFunnelStepIds.filter((id) => !currentFunnelStepIds.includes(id));

      for (const funnelStepId of deletedFunnelStepIds) {
        await deleteFunnelStepMutation({
          variables: {
            teamId,
            portfolioId,
            funnelStepId,
          },
        });
      }

      // 3. Upsert funnel steps
      await upsertPortfolioFunnelSteps({
        variables: {
          teamId,
          portfolioId,
          funnelSteps: funnelStepsToUpsert,
        },
      });

      toast.success('Funnel steps updated successfully');
      closeApplyDialog();
      track(EVENT.FUNNEL_STEP_EDIT);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const hasUnsavedChanges =
      !isEqual(defaultTargetFunnelStepId, selectedFunnelStepTargetId) ||
      !areFunnelStepsEqual(initialFunnelSteps, funnelSteps);

    setHasUnsavedChanges(hasUnsavedChanges);
  }, [funnelSteps, defaultTargetFunnelStepId, selectedFunnelStepTargetId, initialFunnelSteps, loading]);

  return (
    <div ref={dropRef}>
      <div className="mb-8 flex w-full flex-row items-end justify-between">
        <div>
          <div className="text-[20px] font-medium tracking-normal">Funnel</div>
          <div className="text-md font-normal text-neutral-500">
            Manage and modify the funnel setup in your portfolio.
          </div>
        </div>
        <div className="flex h-fit gap-4">
          <Button
            variant="contained"
            onClick={openDiscardDialog}
            disabled={deleteFunnelStepLoading || upsertLoading || loading || hasNoChanges}
          >
            Discard changes
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={deleteFunnelStepLoading || upsertLoading || loading || hasNoChanges}
            onClick={openApplyDialog}
          >
            Apply changes
          </Button>
        </div>
      </div>
      {funnelSteps.map((funnelStep, index) => (
        <IndividualFunnelEdit
          index={index}
          funnelStep={funnelStep}
          key={funnelStep.funnelStepId}
          lastIndex={index === funnelSteps.length - 1}
          addFunnelStep={addFunnelStep}
          deleteFunnelStep={deleteFunnelStep}
          moveFunnelStep={moveFunnelStep}
          setTargetFunnelStep={() => setSelectedFunnelStepTargetId(funnelStep.funnelStepId)}
          isTarget={selectedFunnelStepTargetId === funnelStep.funnelStepId}
          setFunnelStepMeta={({ type, title, isAttributed }) =>
            setFunnelSteps((prevSteps) => {
              const updatedSteps = [...prevSteps];
              updatedSteps[index] = {
                ...updatedSteps[index],
                type,
                title,
                isAttributed,
              };
              return updatedSteps;
            })
          }
        />
      ))}
      <ConfirmationDialog
        description="Your changes will apply to the active funnel setup in your portfolio."
        onConfirm={handleSubmit}
        type="apply"
        isOpen={isApplyOpen}
        onCancel={closeApplyDialog}
        loading={loading || upsertLoading}
        disabled={upsertLoading || updateFunnelTargetLoading || deleteFunnelStepLoading}
      />
      <ConfirmationDialog
        description="Your changes will be discarded. The funnel view will revert to the current active funnel setup in your portfolio."
        onConfirm={() => {
          setFunnelSteps(initialFunnelSteps);
          setSelectedFunnelStepTargetId(defaultTargetFunnelStepId);
          closeDiscardDialog();
        }}
        type="discard"
        isOpen={isDiscardOpen}
        onCancel={closeDiscardDialog}
      />
    </div>
  );
}
