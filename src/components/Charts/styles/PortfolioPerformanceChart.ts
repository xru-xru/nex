import styled from 'styled-components';

import Flex from 'components/Flex';

import { colorByKey } from '../../../theme/utils';

import { nexyColors } from '../../../theme';

export const NexyChartClasses = {
  tooltip: 'NEXYPerformanceTooltip',
  legendAchieved: 'NEXYPerformanceLegendAchieved',
  legendPredicted: 'NEXYPerformanceLegendPredicted',
  legendPotential: 'NEXYPerformanceLegendPotential',
};

export const LegendWrapper = styled.div`
  display: flex;
  div {
    margin-right: 24px;
    span {
      display: inline-block;
      width: 12px;
      height: 2px;
      margin: 0 6px 3px 0;
    }
  }
`;
export const LegendAchieved = styled.span<{
  backgroundColor?: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
`;
export const LegendPredicted = styled.span<{
  backgroundColor?: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
`;
export const LegendPotential = styled.span<{
  backgroundColor?: string;
}>`
  border-top: 2px solid ${({ backgroundColor }) => backgroundColor};
  background-color: #7edcb1;
  height: 12px !important;
  margin: 0 6px -1px 0 !important;
`;
export const ChartHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

export const ChartContainerStyled = styled.div<{
  readonly id: string;
  readonly 'data-cy': string;
  readonly hasEvents?: boolean;
  readonly eventsExtended?: boolean;
  readonly maxOverlappingEvents?: number;
}>`
  width: 100%;
  height: ${({ hasEvents, eventsExtended, maxOverlappingEvents }) => {
    if (!hasEvents || !maxOverlappingEvents) return '550px';

    const BAR_HEIGHT = eventsExtended ? 24 : 8;
    const BAR_SPACING = 6;
    const MARGIN_TOP = 12;

    const eventsHeight = (BAR_HEIGHT + BAR_SPACING + MARGIN_TOP) * maxOverlappingEvents;
    return `${550 + eventsHeight}px`;
  }};
  margin-bottom: 21px;

  .NEXYPerformanceTooltip {
    border-bottom: 1px solid ${nexyColors.charcoalGrey};
    color: ${nexyColors.cloudyBlue80};
    text-transform: uppercase;
    padding: 4px 12px 8px 12px;
  }
  image {
    cursor: pointer;
  }

  .tooltip {
    text-align: center;
    font-weight: 400;
    font-size: 12px;
    opacity: 0.88;
  }
  .flex-container {
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 12px;
  }
  .item-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    min-width: 125px;
    font-weight: 400;
  }
  .column-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;
export const ChartHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
`;
export const TooltipLoading = styled.div`
  background-color: #2a2b2e;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #a0a2ad;
  text-align: center;
  border-radius: 5px;
`;
export const TooltipWrapper = styled(Flex)`
  background-color: #2a2b2e;
  color: white;
  border-radius: 5px;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
export const ValidationTooltip = styled.div<{
  readonly offset: number;
}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: 0;
  left: ${({ offset }) => `calc(${offset}px - 135px)`};
  width: 270px;
  height: 125px;
  z-index: 1;
  border-radius: 5px;
`;

export const TooltipHeader = styled.div`
  border-bottom: 1px solid ${colorByKey('charcoalGrey')};
  padding: 8px 0;
  text-align: center;
  font-size: 11px;
  text-transform: uppercase;
`;

export const TooltipContent = styled.div`
  padding: 8px 16px;
  div {
    padding: 8px 0;
    display: flex;
    justify-content: space-between;
  }
`;
export const TooltipButton = styled.div`
  background-color: #0ec76a;
  padding: 12px 0;
  text-align: center;
  cursor: pointer;
  color: ${nexyColors.neutral900};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;
export const TooltipValue = styled.span<{
  readonly color: string;
}>`
  color: ${({ color }) => color};
`;
