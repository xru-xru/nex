import React, { FC, useEffect, useRef } from 'react';
import { SidePanelActions } from '../../../../../components/SidePanel';
import Button from '../../../../../components/Button';
import ButtonAsync from '../../../../../components/ButtonAsync';
import { toast } from 'sonner';
import { NexoyaFunnelStepMappingType, NexoyaManualContentFunnelStepMappingInput } from '../../../../../types';
import MetricAssignmentStep from './MetricAssignmentStep';
import { ScrollArea } from '../../../../../components-ui/ScrollArea';

interface StepAssignMetricsProps {
  providerIds: number[];
  funnelStepMappings: Array<NexoyaManualContentFunnelStepMappingInput & { type: NexoyaFunnelStepMappingType }>;
  setFunnelStepMappings: (
    mappings: Array<NexoyaManualContentFunnelStepMappingInput & { type: NexoyaFunnelStepMappingType }>,
  ) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  showSkipButton?: boolean;
}

const StepAssignMetrics: FC<StepAssignMetricsProps> = ({
  providerIds,
  funnelStepMappings,
  setFunnelStepMappings,
  onNextStep,
  onPreviousStep,
  showSkipButton = true,
}) => {
  const toastShownRef = useRef(false);

  const handleSubmit = () => {
    if (!funnelStepMappings.length) {
      toast.warning('Please assign at least one metric to a funnel step');
      return;
    }
    onNextStep();
  };

  const handleSkipMetricAssignment = () => {
    setFunnelStepMappings([]);
    onNextStep();
  };

  useEffect(() => {
    if (providerIds.length > 1 && !toastShownRef.current) {
      toast.warning(
        'You have selected contents from multiple providers which will likely cause issues with metric assignment.',
        {
          duration: 10000,
        },
      );
      toastShownRef.current = true;
    }
  }, [providerIds]);

  return (
    <>
      <ScrollArea>
        <MetricAssignmentStep
          providerIds={providerIds}
          funnelStepMappings={funnelStepMappings}
          setFunnelStepMappings={setFunnelStepMappings}
        />
      </ScrollArea>

      <SidePanelActions>
        <Button
          variant="contained"
          color="tertiary"
          onClick={onPreviousStep}
          disabled={funnelStepMappings.length === 0}
        >
          Go back
        </Button>
        <div className="flex items-center gap-2">
          {showSkipButton ? (
            <ButtonAsync variant="contained" color="secondary" onClick={handleSkipMetricAssignment}>
              Skip metric assignment
            </ButtonAsync>
          ) : null}
          <ButtonAsync variant="contained" color="primary" onClick={handleSubmit} disabled={!funnelStepMappings.length}>
            Assign metrics and continue
          </ButtonAsync>
        </div>
      </SidePanelActions>
    </>
  );
};

export default StepAssignMetrics;
