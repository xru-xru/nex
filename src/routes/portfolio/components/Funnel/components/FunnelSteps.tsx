import React, { FC } from 'react';

import { NexoyaFunnelStepV2 } from 'types';

import { usePortfolio } from '../../../../../context/PortfolioProvider';

import {
  FUNNEL_CONFIG,
  FUNNEL_STEP_WIDTHS_PERCENTAGES,
  getFunnelFlexPercentages,
  renderTooltipContent,
} from '../utils/funnel';

import LoadingPlaceholder from '../../../../../components/LoadingPlaceholder/LoadingPlaceholder';
import Tooltip from '../../../../../components/Tooltip';

import { LoadingWrapStyled } from '../../../Content/Content';
import { FunnelData } from '../MultiSeriesFunnel';
import { FunnelChannelStyled, FunnelStepStyled } from '../styles';
import { nexyColors } from '../../../../../theme';

interface Props {
  funnelData: FunnelData;
  funnelSteps: NexoyaFunnelStepV2[];
  withTooltip?: boolean;
}
export const FunnelSteps: FC<Props> = ({ funnelData, funnelSteps, withTooltip = true }) => {
  const funnelPercentages = getFunnelFlexPercentages(funnelData?.values);
  const {
    selectedFunnelStep: { selectedFunnelStep, setSelectedFunnelStep },
  } = usePortfolio();

  if (!funnelData?.values?.length) {
    return (
      <LoadingWrapStyled>
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </LoadingWrapStyled>
    );
  }

  return (
    <>
      {funnelSteps?.map((funnelStep, funnelStepIdx) => {
        // @ts-ignore
        const disabled = funnelStep?.disabled;

        return (
          <Tooltip
            key={`tooltip-${funnelStepIdx}`}
            style={{ pointerEvents: 'none' }}
            placement="right"
            variant="dark"
            content={withTooltip ? renderTooltipContent(funnelData, funnelStepIdx) : ''}
          >
            <FunnelStepStyled
              onClick={() => {
                if (!disabled && funnelStep.funnelStepId !== selectedFunnelStep?.funnel_step_id) {
                  setSelectedFunnelStep({
                    title: funnelStep.title,
                    funnel_step_id: funnelStep.funnelStepId,
                    type: funnelStep.type,
                  });
                }
              }}
              disabled={disabled}
              width={FUNNEL_CONFIG?.width}
              key={`funnelstep-${funnelStepIdx}`}
              style={{
                width: FUNNEL_CONFIG?.width * FUNNEL_STEP_WIDTHS_PERCENTAGES[funnelStepIdx],
                marginTop: funnelStepIdx !== 0 ? '-8px' : '6px',
              }}
            >
              {funnelData?.subLabels?.map((_, seriesIndex) => (
                <FunnelChannelStyled
                  key={`sublabel-${funnelStepIdx}-${seriesIndex}`}
                  style={{
                    flex: `${funnelPercentages?.[funnelStepIdx]?.[seriesIndex] || 1}`,
                    backgroundColor: disabled
                      ? nexyColors.neutral200
                      : seriesIndex
                        ? funnelData.colors[seriesIndex]
                        : funnelData.colors[0],
                    opacity: selectedFunnelStep?.funnel_step_id === funnelStep.funnelStepId ? 1 : 0.5,
                  }}
                />
              ))}
            </FunnelStepStyled>
          </Tooltip>
        );
      })}
    </>
  );
};
