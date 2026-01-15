import React, { useCallback, useEffect, useMemo } from 'react';

import dayjs from 'dayjs';
import { BooleanParam, StringParam, useQueryParams } from 'use-query-params';

import {
  NexoyaBudgetProposalDataApplicationType,
  NexoyaOptimizationPerformance,
  NexoyaOptimizationV2,
  NexoyaOptimizedContent,
  NexoyaOptimizedContentStatusType,
  NexoyaTargetBiddingApplyMode,
} from 'types';

import { usePortfolio } from '../../../../context/PortfolioProvider';

import extractSkippedContent from 'utils/extractSkippedContent';

import { TableManager } from '../../../../components/Table/TableManager';
import { ExtendedTable } from '../../../../components/Table/ExtendedTable';
import SvgCheckCircle from '../../../../components/icons/CheckCircle';

import { TableStyled } from '../../styles/OptimizationProposal';

import { nexyColors } from '../../../../theme';
import NoDataFound from '../../NoDataFound';
import { OPTIMIZATION_STATUSES } from '../../Optimize';
import { includedRowToJsx, skippedRowToJsx } from './columns';
import {
  contentToDataRow,
  getColumnsBasedOnTableViewSwitch,
  getCustomCellStyles,
  getRowDataBasedOnTableViewSwitch,
} from './utils';
import useFunnelStepsStore from '../../../../store/funnel-steps';

const DEPTH_NUMBER_IN_COLUMN_TREE = 2;

export interface ExcludedContent extends NexoyaOptimizedContent {
  isExcluded?: boolean;
}

export interface IEditRowProps {
  isPageLoading: boolean;
  handleInclude: (contentId: number) => void;
  handleExclude: (contentId: number) => void;
}

type Props = {
  optimization: NexoyaOptimizationV2;
  optimizationPerformance: NexoyaOptimizationPerformance;
  editRowProps: IEditRowProps;
  usedBudgetProposalTargetBiddingApplyMode: NexoyaTargetBiddingApplyMode;
};

export const OptimizationProposalTable = ({
  optimization,
  editRowProps,
  optimizationPerformance,
  usedBudgetProposalTargetBiddingApplyMode,
}: Props) => {
  const [queryParams, setQueryParams] = useQueryParams({
    tableViewSwitch: StringParam,
    tableMetricsSwitch: StringParam,
    optimizationSwitch: StringParam,
    showSkippedContents: BooleanParam,
  });
  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const { funnelSteps } = useFunnelStepsStore();

  useEffect(() => {
    if (queryParams.tableViewSwitch === 'focus') {
      setQueryParams({ showSkippedContents: true });
    } else {
      setQueryParams({ showSkippedContents: false });
    }
  }, [queryParams.tableViewSwitch]);

  const isActivePortfolio = dayjs(portfolioMeta?.end).isAfter(dayjs());

  const { optimizationContent, skippedContent } = extractSkippedContent(optimizationPerformance?.contents);

  const isExcluded = useCallback(
    (content: NexoyaOptimizedContent) =>
      content?.budgetProposalData?.applicationType === NexoyaBudgetProposalDataApplicationType.SkipFromProposal,
    [],
  );

  const excludedContent = useMemo(
    () =>
      optimizationContent.filter(isExcluded).map((content) => ({
        ...content,
        status: {
          type: NexoyaOptimizedContentStatusType.Skipped,
          reason: 'SKIP_FROM_PROPOSAL',
        },
        isExcluded: true,
      })),
    [optimizationContent, isExcluded],
  );

  const includedContent = useMemo(
    () =>
      optimizationContent
        .filter((content) => !isExcluded(content))
        .map((content) => ({ ...content, isExcluded: false })),
    [optimizationContent, isExcluded],
  );

  const contentToDataRowMemo = useCallback(
    (contentRow: ExcludedContent) => contentToDataRow({ contentRow, start: optimization.start, end: optimization.end }),
    [optimization.start, optimization.end],
  );

  const rowsRaw = useMemo(
    () => [...includedContent, ...excludedContent].map(contentToDataRowMemo),
    [includedContent, excludedContent, contentToDataRowMemo],
  );

  const { groupedRowsRaw, groupedSkippedContentRowsRaw } = getRowDataBasedOnTableViewSwitch({
    optimizationPerformance: optimizationPerformance,
    tableView: queryParams.tableViewSwitch,
    // The excluded rows are always in rowsRaw, but if the switch is off, we must filter the !row.isExcluded
    rows: queryParams.showSkippedContents ? rowsRaw : rowsRaw.filter((row) => !row.isExcluded),
    skippedRows: queryParams.showSkippedContents ? skippedContent : [],
  });

  const hasTargets = rowsRaw.some((row) => row.initialBiddingStrategy.value);
  const hasLifetimeBudget = rowsRaw.some((row) => row.lifetimeBudgetSegments?.length > 0);
  const hasLabels = rowsRaw.some((row) => row.label);

  const columns = useMemo(
    () =>
      getColumnsBasedOnTableViewSwitch({
        tableViewSwitch: queryParams.tableViewSwitch,
        optimizedTotal: optimizationPerformance.total,
        tableMetricsSwitch: queryParams.tableMetricsSwitch,
        hasTargets,
        hasLifetimeBudget,
        hasLabels,
        portfolioType: portfolioMeta?.type,
        isBaselinePredictionRescaled: optimization.isBaselinePredictionRescaled,
        isPortfolioAttributed: portfolioMeta?.isAttributed,
        ignoreWeekdays: optimization.ignoreWeekdays,
        optimizationStartDate: optimization.start,
      }),
    [
      queryParams.tableViewSwitch,
      queryParams.tableMetricsSwitch,
      hasTargets,
      optimizationPerformance.total,
      optimization.isBaselinePredictionRescaled,
      optimization.ignoreWeekdays,
      optimization.start,
    ],
  );

  const includedRowsJsx = groupedRowsRaw?.map((item) =>
    includedRowToJsx(item, editRowProps, queryParams.tableViewSwitch, usedBudgetProposalTargetBiddingApplyMode),
  );

  const skippedRowsJsx = groupedSkippedContentRowsRaw.map((item) =>
    skippedRowToJsx(item, optimization, isActivePortfolio),
  );

  const tableData = [...includedRowsJsx, ...skippedRowsJsx];
  const attributedFunnelStepTitle = funnelSteps.find((fs) => fs?.isAttributed)?.title || '';

  const shouldRenderNoDataForFocusView = queryParams.tableViewSwitch === 'focus' && !groupedRowsRaw.length;
  const shouldRenderNoDataForLabelsView =
    queryParams.tableViewSwitch === 'labels' && !groupedRowsRaw.some((row) => row.label);
  const isInProgressView = queryParams.optimizationSwitch === OPTIMIZATION_STATUSES.RUNNING;

  return (
    <>
      <TableStyled>
        {shouldRenderNoDataForFocusView ? (
          <NoDataFound
            style={{
              background: nexyColors.white,
              border: '1px solid #eaeaea',
              ...(isInProgressView
                ? {}
                : {
                    borderBottom: 'none',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }),
            }}
            icon={<SvgCheckCircle style={{ color: nexyColors.greenTeal, width: 24, height: 24 }} />}
            title="This optimization is at its highest potential"
            subtitle="There are no content pieces in this view."
          />
        ) : shouldRenderNoDataForLabelsView ? (
          <NoDataFound
            style={{
              background: nexyColors.white,
              border: '1px solid #eaeaea',
              ...(isInProgressView
                ? {}
                : {
                    borderBottom: 'none',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }),
            }}
            icon={<SvgCheckCircle style={{ color: nexyColors.greenTeal, width: 24, height: 24 }} />}
            title="This optimization has no contents with labels assigned"
            subtitle="There are no content pieces in this view."
          />
        ) : (
          <ExtendedTable
            data={tableData}
            columns={columns}
            tableId="optimization_proposal_table"
            renderTableManager={({
              columns,
              getToggleHideAllColumnsProps,
              toggleHideAllColumns,
              setStickyColumns,
              stickyColumns,
            }) => (
              <TableManager
                columns={columns}
                getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
                toggleHideAllColumns={toggleHideAllColumns}
                setStickyColumns={setStickyColumns}
                stickyColumns={stickyColumns}
                depth={DEPTH_NUMBER_IN_COLUMN_TREE}
              />
            )}
            getCustomCellStyles={(column, row) =>
              getCustomCellStyles(column, row, portfolioMeta?.isAttributed, attributedFunnelStepTitle)
            }
          />
        )}
      </TableStyled>
    </>
  );
};
