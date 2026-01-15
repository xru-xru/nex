import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { classes } from '../../../components/Table/ExtendedTable';
import SvgFire from '../../../components/icons/Fire';
import Flex from 'components/Flex';
import FormattedCurrency from 'components/FormattedCurrency';
import GridHeader from 'components/GridHeader';
import GridRow from 'components/GridRow';
import SidePanel, { SidePanelActions, SidePanelContent } from 'components/SidePanel';
import Text from 'components/Text';
import Typography from 'components/Typography';

import { colorByKey } from 'theme/utils';

import { nexyColors } from '../../../theme';

type TableCellVersions = 'primary' | 'secondary' | 'tertiary';

function getVariantColor(variant: TableCellVersions) {
  const variantColors = {
    primary: '#0EC76A',
    secondary: '#744CED',
    tertiary: '#F6820D',
  };
  return variantColors[variant];
}

export const DetailedReportWrapper = styled.div`
  margin-left: 8px;

  .NEXYButtonAsync {
    padding: 10px 24px;
  }
`;
export const SubtitleStyled = styled(Text)`
  font-size: 16px;
  flex: 1;
`;
export const SidePanelPredictionScoreContentStyled = styled(SidePanelContent)`
  margin-top: 90px;
  padding-bottom: 60px;
  display: block;
  background: #fafafa;
`;

export const PerformanceChartWrapper = styled.div`
  margin-top: 30px;
  overflow-x: scroll;
`;
styled(Text)<{
  readonly color: string;
}>`
  padding: 0 32px 0 24px;
  position: relative;
  min-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 100%;
  border-bottom: 1px solid #f0f2fa;

  .NEXYFormattedCurrency,
  .NEXYText {
    border-bottom: none;
  }

  &::before {
    content: '';
    position: absolute;
    width: 3px;
    height: 100%;
    bottom: 0;
    left: 0;
    background-color: ${({ color }) => `${color}`};
  }

  &::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    bottom: 0;
    right: 0;
    background-color: #f0f2fa;
  }

  .NEXYFormattedCurrency {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;
export const GridCell = styled(Flex)<{
  readonly active?: boolean;
  readonly isTitle?: boolean;
}>`
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid #f0f2fa;
  padding: 0 16px;
  background-color: ${({ active }) => (active ? 'rgba(220, 213, 251, 0.2)' : 'white')};
  transition: all 200ms ease-in;
  color: ${({ active, isTitle }) => (active && isTitle ? colorByKey('purpleishBlue') : 'inherit')};
  font-size: ${({ isTitle }) => (isTitle ? '11px' : '12px')};

  .NEXYFormattedCurrency,
  .NEXYText {
    border-bottom: none;
  }
`;
export const ValueGridCell = styled(Flex)`
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #f0f2fa;

  .NEXYFormattedCurrency,
  .NEXYText {
    border-bottom: none;
    padding-left: 32px;
  }
`;
styled(Flex)`
  position: relative;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 24px;
`;

export const PerformanceWrapper = styled.div`
  margin-top: 40px;
`;
styled(Text)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  height: 40px;
  padding-right: 32px;
  border-bottom: 1px solid #f0f2fa;

  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    bottom: 0;
    right: 0;
    background-color: #f0f2fa;
  }
`;
export const FormattedCurrencyStyled = styled(FormattedCurrency)`
  font-weight: 400;
`;
export const CostGridHeaderStyled = styled(GridHeader)<{
  readonly count: number;
}>`
  padding-right: 32px;
  border-bottom: none;
  grid-template-columns: 200px repeat(${({ count }) => count}, minmax(150px, 300px));
  .NEXYText {
    text-align: right;
    padding-left: 12px;
  }
`;
export const CostGridRow = styled(GridRow)<{
  readonly count: number;
}>`
  min-height: 48px;
  border-bottom: none;
  padding-right: 32px;
  grid-template-columns: 200px repeat(${({ count }) => count}, minmax(150px, 300px));
  .NEXYFormattedCurrency,
  .NEXYText {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;
export const ValueOptionStyled = styled.div<{
  readonly variant: TableCellVersions;
}>`
  border-left: 3px solid ${({ variant }) => getVariantColor(variant)};

  .NEXYText {
    min-height: 47px;
    display: flex;
    align-items: center;
  }
`;
export const TotalsGridRow = styled(GridRow)<{
  readonly count: number;
}>`
  border-bottom: none;
  padding-right: 32px;
  grid-template-columns: 200px repeat(${({ count }) => count}, minmax(150px, 300px));

  .NEXYText {
    color: #8a8c9e;
    font-weight: 400;
    display: flex;
    align-items: center;
    background-color: rgba(227, 228, 232, 0.25);
    height: 100%;
  }

  .NEXYFormattedCurrency,
  .NEXYTypography {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }
`;
export const TypographyPercentageStyled = styled(Typography)<{
  readonly value: number;
  readonly invertedColoring?: boolean;
  readonly active: boolean;
}>`
  font-weight: 600;
  background-color: ${({ active }) => (active ? 'rgba(220, 213, 251, 0.2)' : 'rgba(227, 228, 232, 0.25)')};
  padding-right: 16px;
  color: ${({ value, invertedColoring }) =>
    value === 0
      ? 'default'
      : invertedColoring
        ? value > 0
          ? '#E22252'
          : '#0EC76A'
        : value < 0
          ? '#E22252'
          : '#0EC76A'};
`;
export const LoadingWrapStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .NEXYLogo {
    width: 100px;
  }
`;
export const FunnelStepsDropdown = styled.div`
  display: flex;
  padding: 2px;
  align-items: center;
`;
export const LoadingContent = styled.div`
  width: 400px;
  text-align: center;
  margin-top: 24px;

  .NEXYTypography {
    white-space: pre-wrap;
  }
`;
export const TableStyled = styled.div<{ maxHeight?: string }>`
  max-height: 100%;
  height: 100%;
  background: ${colorByKey('white')};

  .totalRow {
    font-weight: 600;
  }

  .cellContainer {
    height: 100%;
  }

  .${classes.container} {
    overflow: scroll;
    max-height: ${(props) => props.maxHeight || '70vh'};
    border: 1px solid rgb(234, 234, 234);
    border-radius: 5px;
  }

  .${classes.header} {
    position: sticky !important;
    top: -1px;
    z-index: 33;
    background: ${colorByKey('white')};
    box-shadow: 0 0.744px 0 0 rgba(223, 225, 237, 0.5);
  }

  .NEXYTableHeader {
    tr {
      border-width: 0;
    }
  }

  .border-left {
    border-left: 1px solid #e5e5e6 !important;
  }

  .border-right {
    border-right: 1px solid #e5e5e6 !important;
  }
`;

export const SvgFireStyled = styled(SvgFire)`
  width: 24px;
  height: 24px;
  margin-left: 16px;
`;
export const WrapperStyled = styled.div`
  display: flex;
  justify-content: center;
`;
export const LabelStyled = styled(Typography)`
  color: #a6a7b5 !important;
  font-size: 12px;
  max-width: 77px;
`;
export const NumberWrapperStyled = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
`;
export const GridRowTotalStyled = styled(GridRow)`
  background: ${colorByKey('paleGrey50')};
  font-weight: 600;
  border-bottom: none;
  padding: 0 24px;
  text-align: right;
`;
export const LinkStyled = styled(Link)`
  max-width: 100%;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const TagStyled = styled.span<{
  bgColor: string;
  color?: string;
}>`
  padding: 2px 8px;
  background-color: ${({ bgColor }) => bgColor};
  color: ${({ color }) => color};
  border-radius: 25px;
  font-size: 12px;
  min-width: 72px;
  display: flex;
  justify-content: center;
  line-height: 145%;
  letter-spacing: 0.44px;
`;
export const StyledTooltipRow = styled.p`
  display: flex;
  align-content: center;
  align-items: center;
  text-align: start;
`;
export const TooltipTitle = styled.p`
  font-size: 14px;
  padding-bottom: 8px;
  text-align: start;
`;
export const TooltipLimitedTitle = styled(TooltipTitle)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  align-content: center;
  gap: 8px;
`;
export const TooltipLimitedContainer = styled.div`
  display: flex;
`;
export const TooltipLimitedTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const AvatarWrapper = styled.div`
  display: flex;
  min-width: 0;
  justify-content: center;
  align-items: center;
`;

export const FormulaTooltipContent = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: space-between;
  gap: 12px;
  width: 100%;
`;
export const FormulaTooltipHeader = styled.div`
  color: rgba(183, 186, 199, 0.8);
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.48px;
  text-transform: uppercase;
`;
export const FormulaTooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
`;
export const FormulaTooltipTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`;
export const StyledSpan = styled.span`
  color: ${colorByKey('frenchGray')};
  font-style: normal;
  font-weight: 400;
`;
export const FormulaTooltipContainer = styled.div`
  padding: 8px;
  border-radius: 5px;
  background: #38393d;

  font-family: monospace;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.05px;
`;
export const BlueFormula = styled.span`
  color: ${colorByKey('azure')};
`;
export const GreenFormula = styled.span`
  color: ${colorByKey('greenTeal')};
`;
export const PurpleFormula = styled.span`
  color: ${colorByKey('brightLilac')};
`;
export const TotalHeaderCell = styled.div`
  color: ${colorByKey('raisinBlack')};
  padding: 22px 12px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.4px;

  display: flex;
  align-items: center;
  gap: 12px;
`;
export const BigHeaderCell = styled.div`
  color: ${nexyColors.neutral500};
  text-align: right;

  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 15.4px */
  letter-spacing: 0.44px;
  text-transform: uppercase;
`;
export const TotalTooltipContentContainer = styled.div`
  font-weight: 400;
  font-size: 13px;
`;
export const StyledSidePanelActions = styled(SidePanelActions)<{
  readonly isNotInProgressView: boolean;
}>`
  background-color: ${nexyColors.seasalt};
  position: unset;
  padding: 16px 0 1px 0;
`;

export const OptimizationDetailsTableContainer = styled.div``;
export const SidePanelContainerStyled = styled(SidePanel)`
  ${OptimizationDetailsTableContainer} {
    padding: 56px 24px 24px;
  }
  ${StyledSidePanelActions} {
    display: none;
  }
`;
