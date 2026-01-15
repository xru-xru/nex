import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../../../components-ui/AlertDialog';
import { LabelLight } from '../../../../../../components/InputLabel/styles';
import { getAssignedMetricBasedOnMappingType } from '../utils';
import { cn } from '../../../../../../lib/utils';
import { NexoyaFunnelStepMappingType, NexoyaFunnelStepV2, NexoyaMeasurement } from '../../../../../../types';
import ButtonAsync from '../../../../../../components/ButtonAsync';
import React from 'react';
import useTranslationStore from '../../../../../../store/translations';
import { AssignedMetric } from '../ContentMetricAssignment';

export const ReviewAndApplyDialog = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  disabled,
  funnelSteps,
  assignedMetrics,
  measurements,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  disabled: boolean;
  funnelSteps: NexoyaFunnelStepV2[];
  assignedMetrics: AssignedMetric[];
  measurements: NexoyaMeasurement[];
}) => {
  const { translations } = useTranslationStore();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Review and apply metrics</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
              Here’s a summary of your assigned metrics per funnel step.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-lg border border-neutral-100 bg-seasalt">
          <div className="grid grid-cols-2 p-6 py-2">
            <LabelLight className="!mb-0">Funnel step</LabelLight>
            <LabelLight className="!mb-0">Assigned metric</LabelLight>
          </div>
          <div className="h-[1px] w-full bg-neutral-100" />
          <div className="max-h-[700px] overflow-y-auto">
            {funnelSteps.map((funnelStep) => {
              const { assignedMetricName, type, mappingTypeLabel } = getAssignedMetricBasedOnMappingType({
                funnelStepId: funnelStep.funnelStepId,
                assignedMetrics,
                mergedMeasurements: measurements,
                translations,
              });
              return (
                <div key={funnelStep.funnelStepId} className="grid grid-cols-2">
                  <div className="p-6 py-2">
                    <div className="text-md py-3 pr-8 font-normal text-neutral-900">{funnelStep.title}</div>
                  </div>
                  <div className="p-7 py-2">
                    <div className="flex flex-col">
                      <div
                        className={cn(
                          'text-md py-3 pr-8 font-normal',
                          type === NexoyaFunnelStepMappingType.Ignore ? 'text-neutral-400' : 'text-neutral-900',
                        )}
                      >
                        {assignedMetricName === 'No data' ? 'Multiple custom conversions' : assignedMetricName} <br />
                      </div>
                      <LabelLight className="!text-[11px] !text-neutral-300">
                        Mapping type: {mappingTypeLabel}
                      </LabelLight>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction>
            <ButtonAsync
              onClick={onClose}
              loading={loading}
              disabled={loading}
              variant="contained"
              color="secondary"
              size="small"
            >
              Go back
            </ButtonAsync>
          </AlertDialogAction>
          <AlertDialogAction>
            <ButtonAsync
              onClick={onConfirm}
              loading={loading}
              disabled={disabled}
              variant="contained"
              color="primary"
              size="small"
            >
              Apply metrics
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
