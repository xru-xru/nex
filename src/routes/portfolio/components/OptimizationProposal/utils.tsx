import {
  NexoyaBiddingStrategyType,
  NexoyaOptimizationPerformance,
  NexoyaOptimizedContentStatusReason,
  NexoyaOptimizedContentStatusType,
  NexoyaOptimizedTotal,
  NexoyaPortfolioType,
} from '../../../../types';

import FormattedCurrency from '../../../../components/FormattedCurrency';
import NumberValue from '../../../../components/NumberValue';

import { buildContentPath } from '../../../paths';
import { ExcludedContent } from './OptimizationProposalTable';
import { getAllContentsColumns, getChannelColumns, getImpactGroupColumns, getLabelColumns } from './columns';
import { IRowBiddingStrategy, RowRaw } from './optimizationDetailsTableTypes';
import { Row } from 'react-table';
import { shortenNumber } from '../../../../utils/number';
import React from 'react';
import dayjs from 'dayjs';

const BUDGET_BACKGROUND = 'rgb(244, 253, 248)';
const FUNNEL_STEP_BACKGROUND = 'rgba(5, 168, 250, 0.10)';
const INACTIVE_FUNNEL_STYLE = {
  opacity: '0.6',
  fontSize: '12px',
};
const DEFAULT_STYLE = {
  justifyContent: 'center',
};

export const renderBiddingStrategyValueCell = (biddingStrategyRow: IRowBiddingStrategy) => {
  const biddingStrategyTypeCurrency = [
    NexoyaBiddingStrategyType.MaximizeConversions,
    NexoyaBiddingStrategyType.TargetCpa,
    NexoyaBiddingStrategyType.BidCap,
    NexoyaBiddingStrategyType.CostCap,
  ].includes(biddingStrategyRow?.type);

  if (biddingStrategyTypeCurrency) {
    return <FormattedCurrency amount={biddingStrategyRow?.value} />;
  } else {
    return (
      <NumberValue
        style={{ justifyContent: 'flex-end' }}
        value={biddingStrategyRow?.value}
        showChangePrefix
        textWithColor
        variant="default"
        datatype={{
          suffix: true,
          symbol: '%',
        }}
      />
    );
  }
};

export const isNullOrUndefined = (value: any) => value === null || value === undefined;

export const translateBiddingStrategyType = (biddingStrategyType: NexoyaBiddingStrategyType) => {
  switch (biddingStrategyType) {
    case NexoyaBiddingStrategyType.MaximizeConversions:
      return 'Target CPA';
    case NexoyaBiddingStrategyType.MaximizeConversionValue:
      return 'Target ROAS';
    case NexoyaBiddingStrategyType.TargetCpa:
      return 'Target CPA';
    case NexoyaBiddingStrategyType.TargetRoas:
      return 'Target ROAS';
    case NexoyaBiddingStrategyType.BidCap:
      return 'Bid Cap';
    case NexoyaBiddingStrategyType.CostCap:
      return 'Cost per result goal';
    case NexoyaBiddingStrategyType.Other:
      return 'Other';
    default:
      return '';
  }
};

export const getColumnsBasedOnTableViewSwitch = ({
  optimizedTotal,
  tableViewSwitch,
  tableMetricsSwitch,
  hasTargets,
  hasLifetimeBudget,
  hasLabels,
  portfolioType,
  isBaselinePredictionRescaled,
  isPortfolioAttributed,
  ignoreWeekdays,
  optimizationStartDate,
}: {
  optimizedTotal: NexoyaOptimizedTotal;
  tableViewSwitch: string;
  tableMetricsSwitch: string;
  hasTargets: boolean;
  hasLifetimeBudget: boolean;
  hasLabels: boolean;
  portfolioType: NexoyaPortfolioType;
  isBaselinePredictionRescaled: boolean;
  isPortfolioAttributed: boolean;
  ignoreWeekdays?: string[];
  optimizationStartDate?: string;
}) => {
  switch (tableViewSwitch) {
    case 'impact-groups':
      return getImpactGroupColumns(
        optimizedTotal,
        tableMetricsSwitch,
        tableViewSwitch,
        portfolioType,
        isBaselinePredictionRescaled,
        ignoreWeekdays,
        optimizationStartDate,
      );
    case 'channels':
      return getChannelColumns(
        optimizedTotal,
        tableMetricsSwitch,
        tableViewSwitch,
        portfolioType,
        isBaselinePredictionRescaled,
        ignoreWeekdays,
        optimizationStartDate,
      );
    case 'labels':
      return getLabelColumns(
        optimizedTotal,
        tableMetricsSwitch,
        tableViewSwitch,
        portfolioType,
        isBaselinePredictionRescaled,
        ignoreWeekdays,
        optimizationStartDate,
      );
    case 'focus':
      return getAllContentsColumns(
        optimizedTotal,
        tableMetricsSwitch,
        tableViewSwitch,
        hasTargets,
        hasLifetimeBudget,
        hasLabels,
        isBaselinePredictionRescaled,
        isPortfolioAttributed,
        ignoreWeekdays,
        optimizationStartDate,
      );
    case 'all-content':
      return getAllContentsColumns(
        optimizedTotal,
        tableMetricsSwitch,
        tableViewSwitch,
        hasTargets,
        hasLifetimeBudget,
        hasLabels,
        isBaselinePredictionRescaled,
        isPortfolioAttributed,
        ignoreWeekdays,
        optimizationStartDate,
      );
    default:
      return getAllContentsColumns(
        optimizedTotal,
        tableMetricsSwitch,
        tableViewSwitch,
        hasTargets,
        hasLifetimeBudget,
        hasLabels,
        isBaselinePredictionRescaled,
        isPortfolioAttributed,
        ignoreWeekdays,
        optimizationStartDate,
      );
  }
};

export const getRowDataBasedOnTableViewSwitch = ({
  optimizationPerformance,
  tableView,
  skippedRows,
  rows,
}: {
  optimizationPerformance: NexoyaOptimizationPerformance;
  tableView: string;
  skippedRows: RowRaw[];
  rows: RowRaw[];
}): { groupedRowsRaw: any; groupedSkippedContentRowsRaw: any } => {
  switch (tableView) {
    case 'impact-groups':
      return {
        groupedRowsRaw: mergeRowsAndPerformanceData({ optimizationPerformance, rows, groupBy: 'impactGroups' }),
        groupedSkippedContentRowsRaw: [],
      };
    case 'channels':
      return {
        groupedRowsRaw: mergeRowsAndPerformanceData({ optimizationPerformance, rows, groupBy: 'channels' }),
        groupedSkippedContentRowsRaw: [],
      };
    case 'labels':
      return {
        groupedRowsRaw: mergeRowsAndPerformanceData({ optimizationPerformance, rows, groupBy: 'labels' }),
        groupedSkippedContentRowsRaw: [],
      };
    case 'focus':
      return {
        groupedRowsRaw: rows.filter(filterRowsByStatus),
        groupedSkippedContentRowsRaw: skippedRows.filter(filterRowsByStatus),
      };
    case 'all-content':
      return {
        groupedRowsRaw: rows,
        groupedSkippedContentRowsRaw: skippedRows,
      };
    default:
      return {
        groupedRowsRaw: rows,
        groupedSkippedContentRowsRaw: skippedRows,
      };
  }
};

function filterRowsByStatus(row: RowRaw) {
  if (!row.status) {
    return false; // Exclude rows without a status
  }

  if (row.status.type === NexoyaOptimizedContentStatusType.Skipped) {
    // For 'Skipped' status types, check if the reason is one of the specified reasons
    const validReasons = [
      NexoyaOptimizedContentStatusReason.SpendBelowThreshold,
      NexoyaOptimizedContentStatusReason.IsEnding,
    ];

    return validReasons.includes(row.status.reason);
  }
  return true;
}

export const getCustomCellStyles = (column, row, isPortfolioAttributed: boolean, attributedFunnelStepTitle: string) => {
  const columnId = column.id?.toLowerCase();
  const impactGroupFunnelSteps = getImpactGroupFunnelSteps(row);

  // Only highlight data cells (when row is provided), not header cells (when row is undefined)
  const isDataCell = row !== undefined && row !== null;

  const isFunnelStepColumn =
    isDataCell && isPortfolioAttributed
      ? isFunnelStepColumnAttributed(column, attributedFunnelStepTitle)
      : isPortfolioAttributed
        ? false // Don't highlight header cells for attributed portfolios
        : isFunnelStepInColumnImpactGroupsColumn(columnId, impactGroupFunnelSteps);

  const budgetWillBeApplied = row?.original?.budgetWillBeApplied;
  const biddingStrategyWillBeApplied = row?.original?.biddingStrategyWillBeApplied;

  const isBudgetColumn = getIsBudgetColumn(columnId);
  const isBiddingStrategyColumn = getIsBiddingStrategyColumn(columnId, row);

  if (budgetWillBeApplied && isBudgetColumn) {
    return { background: BUDGET_BACKGROUND };
  }

  if (biddingStrategyWillBeApplied && isBiddingStrategyColumn) {
    return { background: BUDGET_BACKGROUND };
  }

  if (isFunnelStepColumn) {
    return { background: FUNNEL_STEP_BACKGROUND };
  }

  if (isInactiveFunnelColumn(columnId, impactGroupFunnelSteps)) {
    if (!row) {
      return { ...INACTIVE_FUNNEL_STYLE, fontSize: 11 };
    }
    return INACTIVE_FUNNEL_STYLE;
  }

  return DEFAULT_STYLE;
};

const getImpactGroupFunnelSteps = (row: Row) => {
  const impactGroupsTableMetricViewSwitch = 'impact-groups';
  const funnelSteps =
    row?.values?.impactGroup?.props['funnelSteps'] ||
    row?.values?.['impactGroup' + impactGroupsTableMetricViewSwitch]?.props['funnelSteps'];
  return funnelSteps ? funnelSteps.split(',') : [];
};

const isFunnelStepInColumnImpactGroupsColumn = (columnId: string, impactGroupFunnelSteps: string[]) =>
  impactGroupFunnelSteps.some((value) => columnId.includes(value));

const findTopLevelFunnelStepHeader = (column: any): any => {
  // Check if current column is a funnel step header
  if (column?.id?.startsWith('funnel-step-header-')) {
    return column;
  }
  // Traverse up the parent chain
  if (column?.parent) {
    return findTopLevelFunnelStepHeader(column.parent);
  }
  return null;
};

const isFunnelStepColumnAttributed = (column: any, attributedFunnelStepTitle: string) => {
  // First, check if this column itself is a funnel step column (by ID pattern)
  const columnId = column?.id?.toLowerCase() || '';
  const isFunnelStepColumnById =
    (columnId.includes('funnelstep') ||
      columnId.includes('funnelsteproas') ||
      columnId.includes('funnelstepcostper') ||
      columnId.includes('funnelstepvalue')) &&
    !columnId.includes('header') &&
    !columnId.includes('total');

  if (!isFunnelStepColumnById) {
    return false;
  }

  // Traverse up the parent chain to find the top-level funnel step header
  const topLevelHeader = findTopLevelFunnelStepHeader(column);

  // Check if the top-level header's title matches the attributed funnel step title
  return topLevelHeader?.title === attributedFunnelStepTitle;
};

// By checking if the row exists, we ensure that we are not checking for the header (previous, suggested) column (row exists only for data rows)
const getIsBudgetColumn = (columnId: string) =>
  columnId?.includes('budget') && !columnId.includes('header') && !columnId.includes('platform');

const getIsBiddingStrategyColumn = (columnId: string, row) =>
  row && columnId?.includes('bidding') && !columnId.includes('header') && !columnId.includes('total');

const isInactiveFunnelColumn = (columnId: string, impactGroupFunnelSteps: string[]) =>
  columnId.includes('funnel') && !impactGroupFunnelSteps.some((step) => columnId.includes(step));

const mergeRowsAndPerformanceData = ({
  optimizationPerformance,
  rows,
  groupBy,
}: {
  optimizationPerformance: NexoyaOptimizationPerformance;
  rows: RowRaw[];
  groupBy: keyof NexoyaOptimizationPerformance;
}): RowRaw[] => {
  // @ts-ignore -> map is not available on the budget type since the types don't overlap
  return optimizationPerformance?.[groupBy]?.map(
    // optimizedPerformance: NexoyaOptimizedLabel | NexoyaOptimizedChannel | NexoyaOptimizedImpactGroup
    (optimizedPerformance: any) => ({
      isExcluded: false,
      providerId: optimizedPerformance?.channelId ?? rows[0]?.providerId,
      // Default values needed for the return type & not to render anything redundant
      contentId: rows[0]?.contentId,
      title: rows[0]?.title,
      titleLink: rows[0]?.titleLink,
      isPerforming: rows[0]?.isPerforming,
      status: rows[0]?.status,
      lifetimeBudgetSegments: null,
      initialBiddingStrategy: null,
      proposedBiddingStrategy: null,
      biddingStrategyChangePercent: null,
      label: optimizedPerformance?.label,
      // Spent means previous daily budget
      previousDailyBudget: optimizedPerformance?.budget.spent,
      proposedDailyBudget: optimizedPerformance?.budget.proposed,
      proposedDailyBudgetChange: optimizedPerformance?.budget.changePercent,
      impactGroup: optimizedPerformance?.impactGroup,
      target: optimizedPerformance?.target,
      funnelSteps: rows[0]?.funnelSteps?.map((optimizedFunnelStep, idx) => {
        return {
          funnelStepId: optimizedFunnelStep?.funnelStep?.funnelStepId,
          title: optimizedFunnelStep?.funnelStep?.title,
          type: optimizedFunnelStep?.funnelStep?.type,
          ...optimizedPerformance?.funnelSteps?.[idx],
        };
      }),
    }),
  );
};

export const contentToDataRow = ({
  contentRow,
  start,
  end,
}: {
  contentRow: ExcludedContent;
  start: string;
  end: string;
}): RowRaw => {
  const title = contentRow?.content?.title;
  const teamCurrency = contentRow?.budgetProposalData?.teamCurrency;
  return {
    isExcluded: contentRow.isExcluded,
    providerId: contentRow?.content?.provider?.provider_id,
    contentId: contentRow?.content?.collection_id,
    title,
    titleLink: contentRow?.content?.collection_id
      ? buildContentPath(contentRow?.content?.collection_id, {
          dateFrom: start.substring(0, 10),
          dateTo: end.substring(0, 10),
        })
      : undefined,
    status: contentRow.status,
    lifetimeBudgetSegments: teamCurrency?.lifetimeBudget?.lifetimeBudgetSegments,
    initialBiddingStrategy: {
      value: teamCurrency?.initialBiddingStrategy?.value,
      type: teamCurrency?.initialBiddingStrategy?.type,
    },
    initialBudgetDaily: teamCurrency?.initialBudgetDaily,
    proposedBiddingStrategy: {
      value: teamCurrency?.proposedBiddingStrategy?.value,
      type: teamCurrency?.proposedBiddingStrategy?.type,
      applicationDelta: teamCurrency?.proposedBiddingStrategy?.applicationDelta,
      currentTcpa: teamCurrency?.proposedBiddingStrategy?.currentTcpa,
      currentTroas: teamCurrency?.proposedBiddingStrategy?.currentTroas,
      dailyBudgetChange: teamCurrency?.proposedBiddingStrategy?.dailyBudgetChange,
      realizedRoas: teamCurrency?.proposedBiddingStrategy?.realizedRoas,
      troasDelta: teamCurrency?.proposedBiddingStrategy?.troasDelta,
      realizedCpa: teamCurrency?.proposedBiddingStrategy?.realizedCpa,
      tcpaDelta: teamCurrency?.proposedBiddingStrategy?.tcpaDelta,
    },
    biddingStrategyChangePercent: teamCurrency?.biddingStrategyChangePercent,
    // @ts-ignore TODO: fix type once backend is updated with the new schema
    budgetWillBeApplied: contentRow?.budgetProposalData?.budgetWillBeApplied,
    // @ts-ignore TODO: fix type once backend is updated with the new schema
    biddingStrategyWillBeApplied: contentRow?.budgetProposalData?.biddingStrategyWillBeApplied,
    previousDailyBudget: contentRow?.budget?.spent,
    proposedDailyBudget: contentRow?.budget?.proposed,
    proposedDailyBudgetChange: contentRow?.budget?.changePercent,
    impactGroup: contentRow.impactGroup,
    target: contentRow.target,
    label: contentRow.label,
    funnelSteps: contentRow?.funnelSteps,
  };
};

export const getOptiAttributedTooltipContent = ({
  measured,
  attributed,
  changePercent,
  funnelStepTitle,
}: {
  measured: number;
  attributed: number;
  changePercent: number;
  funnelStepTitle: string;
}) => (
  <div>
    <div
      style={{ borderColor: '#424347', color: '#B7BAC7CC' }}
      className="] border-b p-1 py-2 text-center text-xs font-medium uppercase"
    >
      {funnelStepTitle}: Attributed
    </div>

    <div className="p-2">
      <div className="flex min-w-[125px] items-baseline justify-between gap-12 p-1">
        <span className="flex items-center font-light text-neutral-400">Attributed</span>
        <span>{shortenNumber(attributed, 3)}</span>
      </div>

      <div className="mb-0 flex min-w-[125px] items-baseline justify-between gap-12 p-1">
        <span className="flex items-center font-light text-neutral-400">Measured</span>
        <span>{shortenNumber(measured < 0 ? 0 : measured, 3)}</span>
      </div>

      <div className="flex flex-row items-center justify-between gap-6 p-1">
        <span className="text-xs font-normal text-neutral-400">Difference:</span>
        <span
          style={{ color: changePercent > 0 ? '#0ec76a' : '#E22252' }}
          className="text-right text-xs font-medium text-green-600"
        >
          {changePercent}%
        </span>
      </div>
    </div>
  </div>
);

// Helper function to map weekday enum values to dayjs day numbers (0 = Sunday, 1 = Monday, etc.)
export const getWeekdayDayNumber = (weekday: string): number => {
  const weekdayMap: Record<string, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0,
  };
  return weekdayMap[weekday] ?? -1;
};

// Helper function to find all occurrences of a weekday within the last 7 days from optimization start date
// Matches backend logic: looks at 7 days ago to 1 day before start date (excluding start date itself)
export const findWeekdaysInLast7Days = (weekday: string, optimizationStartDate?: string): dayjs.Dayjs[] => {
  const targetDay = getWeekdayDayNumber(weekday);
  if (targetDay === -1) return [];

  if (!optimizationStartDate) return [];

  // Parse the start date - extract just the date part to avoid timezone issues
  const dateString = optimizationStartDate.substring(0, 10); // Get YYYY-MM-DD part
  const startDate = dayjs(dateString).startOf('day');
  if (!startDate.isValid()) return [];

  const sevenDaysAgo = startDate.subtract(7, 'day').startOf('day');
  const dates: dayjs.Dayjs[] = [];

  // Iterate through the last 7 days (excluding start date, so 7 days ago to 1 day before start date)
  let currentDate = sevenDaysAgo;
  while (currentDate.isBefore(startDate)) {
    if (currentDate.day() === targetDay) {
      dates.push(currentDate);
    }
    currentDate = currentDate.add(1, 'day');
  }

  return dates;
};

// Helper function to format all weekdays with their dates
// Returns a formatted string with all occurrences of the weekday in the last 7 days
export const formatWeekdayWithDates = (weekday: string, optimizationStartDate?: string): string => {
  const dates = findWeekdaysInLast7Days(weekday, optimizationStartDate);
  if (dates.length === 0) {
    // Fallback to just the weekday name if no dates found
    return weekday.charAt(0) + weekday.slice(1).toLowerCase();
  }
  // Format all dates for this weekday
  return dates
    .map((date) => {
      const weekdayName = date.format('dddd'); // Full weekday name (e.g., "Saturday")
      return `${weekdayName}, ${date.format('DD MMMM YYYY')}`;
    })
    .join(', ');
};
