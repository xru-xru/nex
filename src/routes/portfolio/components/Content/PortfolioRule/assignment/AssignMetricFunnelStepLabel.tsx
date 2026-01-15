import React, { FC } from 'react';
import { NexoyaFunnelStepV2, NexoyaMeasurement, NexoyaTranslation } from '../../../../../../types';
import { usePortfolio } from '../../../../../../context/PortfolioProvider';
import {
  FunnelStepLabelButtonStyled,
  FunnelStepTitleContainerStyled,
  LabelsStyled,
  LabelTitleStyled,
} from '../../../Funnel/styles';
import SvgCheckCircle from '../../../../../../components/icons/CheckCircle';
import { nexyColors } from '../../../../../../theme';
import { cn } from '../../../../../../lib/utils';
import { AssignedMetric } from '../ContentMetricAssignment';
import { getAssignedMetricBasedOnMappingType } from '../utils';
import { CircleAlert } from 'lucide-react';
import Tooltip from '../../../../../../components/Tooltip';

interface Props {
  funnelSteps: (NexoyaFunnelStepV2 & { disabled?: boolean })[];
  assignedMetrics: AssignedMetric[];
  translations: NexoyaTranslation[];
  mergedMeasurements: NexoyaMeasurement[];
}

export const AssignMetricFunnelStepLabel: FC<Props> = ({
  translations,
  funnelSteps,
  assignedMetrics,
  mergedMeasurements,
}) => {
  const {
    selectedFunnelStep: { selectedFunnelStep, setSelectedFunnelStep },
  } = usePortfolio();

  return (
    <LabelsStyled>
      {funnelSteps?.map((funnelStep) => {
        const funnelStepId = funnelStep?.funnelStepId;
        const funnelStepSelected = selectedFunnelStep?.funnel_step_id === funnelStepId;

        const { assignedMetricName, mappingTypeLabel, hasAssigned } = getAssignedMetricBasedOnMappingType({
          funnelStepId: funnelStep.funnelStepId,
          assignedMetrics,
          mergedMeasurements,
          translations,
        });

        const labelTitleStyled = (
          <>
            {funnelStep.title}{' '}
            {hasAssigned ? (
              <SvgCheckCircle style={{ color: nexyColors.greenTeal, width: 14, height: 14 }} />
            ) : (
              <CircleAlert className="size-4 fill-neutral-100 text-neutral-300" />
            )}
          </>
        );
        return (
          <FunnelStepLabelButtonStyled
            key={funnelStepId}
            active={funnelStepSelected || hasAssigned}
            className={cn(
              'max-w-[500px]',
              funnelStepSelected ? 'bg-inherit' : hasAssigned ? 'border-l border-primary !bg-white' : '',
            )}
            labelClassName={cn('h-full flex flex-col justify-between', hasAssigned && '!opacity-100')}
            disabled={funnelStep?.disabled}
            onClick={() => {
              if (funnelStep.disabled) {
                return;
              }

              setSelectedFunnelStep({
                title: funnelStep?.title,
                funnel_step_id: funnelStep.funnelStepId,
                type: funnelStep.type,
              });
            }}
          >
            <div
              className={cn(
                'absolute left-0 top-0 h-[98px] w-1 rounded-md',
                hasAssigned ? 'bg-green-400' : 'bg-neutral-100',
              )}
            />
            <FunnelStepTitleContainerStyled style={{ marginBottom: 0 }}>
              <Tooltip
                content={funnelStep?.title.length > 30 ? labelTitleStyled : ''}
                variant="dark"
                size="small"
                style={{ wordBreak: 'break-word' }}
                popperProps={{
                  style: { zIndex: 3100 },
                }}
              >
                <LabelTitleStyled className="flex !max-w-[100%] items-center gap-2 whitespace-pre-wrap">
                  {labelTitleStyled}
                </LabelTitleStyled>
              </Tooltip>
            </FunnelStepTitleContainerStyled>
            <div className="text-sm font-light">
              {hasAssigned ? (
                <div className="text-neutral-800">
                  {assignedMetricName === 'No data' ? 'Multiple custom conversions' : assignedMetricName} <br />
                  <span className="text-xs text-neutral-400">Type: {mappingTypeLabel}</span>
                </div>
              ) : (
                <div className="text-neutral-300">
                  No assignment yet <br />
                </div>
              )}
            </div>
          </FunnelStepLabelButtonStyled>
        );
      })}
    </LabelsStyled>
  );
};
