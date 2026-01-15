import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { NetworkStatus } from '@apollo/client';
import { BooleanParam, NumberParam, useQueryParam } from 'use-query-params';

import { NexoyaPageInfo, NexoyaPortfolioParentContent } from 'types';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { useTeam } from '../../../context/TeamProvider';
import { useSidePanelState } from '../../../components/SidePanel';
import { TableStyled } from '../styles/OptimizationProposal';
import { TableManager } from '../../../components/Table/TableManager';
import { PaginationControls } from '../../../components/Table/PaginationControls';
import { ACTIONS_HEADER_ID } from '../components/OptimizationProposal/columns';
import { getColumns } from '../components/Content/Table/columns';
import { getData } from '../components/Content/Table/data-table';
import MultipleSwitch from '../../../components/MultipleSwitchFluid';
import NoDataFound from '../NoDataFound';
import SvgKpi from '../../../components/icons/Kpi';
import { ContentFilter } from '../components/ContentFilter';
import { ContentFilterChips } from '../ContentFilterChips';
import { Skeleton } from '../../../components-ui/Skeleton';
import { cn } from '../../../lib/utils';

// Queries and hooks
import { useFunnelStepsV2Query } from '../../../graphql/funnelSteps/queryFunnelSteps';
import { useContentRuleQuery } from '../../../graphql/portfolioRules/queryContentRules';
import { useImpactGroupRuleQuery } from '../../../graphql/portfolioRules/queryImpactGroupRules';
import { useAttributionRuleQuery } from '../../../graphql/portfolioRules/queryAttributionRules';
import { usePortfolioParentContentsQuery } from '../../../graphql/content/queryPortfolioContents';
import { useProviderMetricOptionsQuery } from '../../../graphql/content/queryContentMetricOptions';
import usePortfolioFeatureFlag from '../../../components/PortfolioFeatureSwitch/usePortfolioFeatureFlag';

// State stores
import { useContentFilterStore } from '../../../store/content-filter';
import { useContentRulesStore } from '../../../store/content-rules';
import { useAttributionRulesStore } from '../../../store/attribution-rules';
import { useImpactGroupRulesStore } from '../../../store/impact-group-rules';

// Constants and utils
import { PORTFOLIO_FEATURE_FLAGS } from '../../../constants/featureFlags';
import { buildPortfolioContentFilterVariables } from '../utils/content';

// Components
import { BulkActionsFloatingBar } from './BulkActionsFloatingBar';
import ContentEdit from '../components/Content/ContentEdit';
import { ContentEditWizard } from '../components/Content/Wizard/ContentEditWizard';
import { VirtualizerExtendedTable } from '../../../components/Table/VirtualizerExtendedTable';

type Props = {
  dateFrom: Date;
  dateTo: Date | string;
  portfolioId: number;
};

const ContentEditWrapperStyled = styled.div<{ useAbsolutePosition?: boolean }>`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  ${({ useAbsolutePosition }) =>
    useAbsolutePosition &&
    css`
      position: absolute;
      top: 16px;
      right: 0;
    `}
`;

export const LoadingWrapStyled = styled.div`
  padding-top: 20px;
  height: 100vh;

  & > div {
    margin-bottom: 15px;
    background: #f4f6f7;
    height: 40px;

    &:nth-child(1) {
      opacity: 1;
    }
    &:nth-child(2) {
      opacity: 0.75;
    }
    &:nth-child(3) {
      opacity: 0.5;
    }
    &:nth-child(4) {
      opacity: 0.25;
    }
  }
`;

const TABLE_VIEW_OPTIONS = [
  { id: 'simple', text: 'Simple' },
  { id: 'advanced', text: 'Advanced' },
];

function Content({ dateFrom, dateTo, portfolioId }: Props) {
  const [useLegacySearchScreen] = useQueryParam('useLegacySearchScreen', BooleanParam);
  const [queryParamTeamId] = useQueryParam('team_id', NumberParam);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);
  const [tableView, setTableView] = useState<'simple' | 'advanced'>(TABLE_VIEW_OPTIONS[0].id as 'simple');

  const [visibleFunnelStepIds, setVisibleFunnelStepIds] = useState<number[]>([]);

  // Pagination state
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<NexoyaPageInfo>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [paginatedContents, setPaginatedContents] = useState<Record<number, NexoyaPortfolioParentContent[]>>({ 0: [] });

  // Selection state
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  const [lastSelectedContentId, setLastSelectedContentId] = useState<number | null>(null);

  // Hooks
  const { isOpen } = useSidePanelState();
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();
  const { pageSize, setPageSize } = useContentFilterStore();
  const { setContentRules } = useContentRulesStore();
  const { setAttributionRules } = useAttributionRulesStore();
  const { setImpactGroupRules } = useImpactGroupRulesStore();

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  // Feature flags
  const { isFeatureEnabled: hasSelfServicePortfolioFeatureEnabled } = usePortfolioFeatureFlag([
    PORTFOLIO_FEATURE_FLAGS.SELF_SERVICE_PORTFOLIO,
  ]);
  const isAttributed = portfolioMeta?.isAttributed;

  // GraphQL queries
  const { data: providerMetricOptionsData, loading: metricOptionsLoading } = useProviderMetricOptionsQuery({
    portfolioId,
    skip: tableView === 'simple',
  });

  const { data, fetchMore, networkStatus } = usePortfolioParentContentsQuery({
    ...buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
    onCompleted: () => setLoading(false),
  });

  const { data: funnelStepsData } = useFunnelStepsV2Query({ portfolioId });
  const funnelSteps = funnelStepsData?.portfolioV2?.funnelSteps || [];

  // Rules queries
  useContentRuleQuery({
    portfolioId,
    onCompleted: (data) => setContentRules(data?.portfolioV2?.contentRules),
    skip: !hasSelfServicePortfolioFeatureEnabled,
  });

  useImpactGroupRuleQuery({
    portfolioId,
    skip: !hasSelfServicePortfolioFeatureEnabled,
    onCompleted: (data) => setImpactGroupRules(data?.portfolioV2?.impactGroupRules),
  });

  useAttributionRuleQuery({
    portfolioId,
    skip: !isAttributed,
    onCompleted: (data) => setAttributionRules(data?.portfolioV2?.attributionRules),
  });

  // Effects
  useEffect(() => {
    if (networkStatus === NetworkStatus.ready && data?.portfolioV2?.portfolioParentContents) {
      const contents = data.portfolioV2.portfolioParentContents.edges?.map((edge) => edge.node) || [];
      setPaginatedContents((prev) => ({ ...prev, [pageIndex]: contents }));
      setPageInfo(data.portfolioV2.portfolioParentContents.pageInfo);
      setPageCount(data.portfolioV2.portfolioParentContents?.totalPages);
      setSelectedContentIds([]);
    }
  }, [data, networkStatus, pageIndex, pageSize]);

  // Reset page index if we're out of bounds after filter change
  useEffect(() => {
    if (pageIndex >= pageCount) {
      setPageIndex(0);
    }
  }, [pageCount, pageIndex]);

  // Component mount and keyboard shortcut
  useEffect(() => {
    setTimeout(() => setIsMounted(true));

    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        document.getElementById('content-search')?.focus();
      }
    };

    if (!isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    // Reset visible funnel steps when table view changes or when funnel steps data changes
    if (tableView === 'advanced' && funnelSteps.length > 0) {
      setVisibleFunnelStepIds([]);

      // Progressively add funnel steps with calculated timeout
      funnelSteps.forEach((step, index) => {
        setTimeout(
          () => {
            setVisibleFunnelStepIds((prev) => [...prev, step.funnelStepId]);
          },
          250 * (index + 1),
        );
      });
    }
  }, [tableView, funnelSteps, pageSize, paginatedContents[pageIndex]?.length]);

  // Handler functions
  const handlePageChange = async (page) => {
    setLoading(true);
    setPageIndex(page);

    const response = await fetchMore({
      variables: {
        after: page > pageIndex ? pageInfo?.endCursor : null,
        before: page < pageIndex ? pageInfo?.startCursor : null,
        first: page > pageIndex ? pageSize : null,
        last: page < pageIndex ? pageSize : null,
      },
    });

    if (response.data) {
      const contents = response.data.portfolioV2?.portfolioParentContents?.edges?.map((edge) => edge.node) || [];
      setPaginatedContents((prev) => ({ ...prev, [page]: contents }));
      setPageInfo(response.data.portfolioV2?.portfolioParentContents?.pageInfo);
      setLoading(false);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setLoading(true);
    setPageSize(newSize);
    setPageIndex(0);
    setPaginatedContents({ 0: [] });

    fetchMore({
      variables: { first: newSize },
    }).finally(() => setLoading(false));
  };

  const handleCheckboxAction = (contentId: number, shiftKey: boolean) => {
    if (shiftKey && lastSelectedContentId !== null) {
      // Find the indices of the current and last selected content
      const contentList = paginatedContents[pageIndex].map((pc) => pc.content?.contentId);
      const currentIndex = contentList.indexOf(contentId);
      const lastIndex = contentList.indexOf(lastSelectedContentId);

      if (currentIndex !== -1 && lastIndex !== -1) {
        // Determine the range to select
        const start = Math.min(currentIndex, lastIndex);
        const end = Math.max(currentIndex, lastIndex);

        // Get the IDs of content in the range
        const contentIdsToToggle = contentList.slice(start, end + 1).filter((id) => id !== undefined);

        // Add these IDs to the selected list if not already selected
        setSelectedContentIds((prev) => {
          // Get unique IDs that aren't already in the selection
          const newSelectionSet = new Set([...prev, ...contentIdsToToggle]);
          return Array.from(newSelectionSet);
        });
      }
    } else {
      setSelectedContentIds((prev) => {
        if (prev.includes(contentId)) {
          return prev.filter((id) => id !== contentId);
        }
        return [...prev, contentId];
      });
      setLastSelectedContentId(contentId);
    }
  };

  const handleSelectAllContents = () => {
    if (paginatedContents[pageIndex]?.length === 0) return;

    const allContentIds = paginatedContents[pageIndex].map((pc) => pc.content?.contentId).filter(Boolean);
    if (
      allContentIds.length === selectedContentIds.length &&
      allContentIds.every((id) => selectedContentIds.includes(id))
    ) {
      setSelectedContentIds([]);
    } else {
      setSelectedContentIds(allContentIds);
    }
  };

  // Helper functions for table data
  const hasLabels = portfolioMeta?.labels?.length > 0;
  const hasBidStrategy = paginatedContents?.[pageIndex]?.some((c) => c?.content?.biddingStrategy);
  const hasBudgetLimits = paginatedContents?.[pageIndex]?.some((c) => c?.budgetMin || c?.budgetMax);

  const getProcessedColumns = (loading: boolean) => {
    const baseColumns = getColumns({
      funnelSteps: funnelSteps.filter((step) => visibleFunnelStepIds.includes(step.funnelStepId)),
      hasLabels,
      hasBidStrategy,
      hasBudgetLimits,
      isAttributed: portfolioMeta?.isAttributed,
      tableView,
      hasSelfServicePortfolioFeatureEnabled,
      handleSelectAllContents,
      allContentsSelected: selectedContentIds.length
        ? paginatedContents[pageIndex]?.every((pc) => selectedContentIds.includes(pc.content?.contentId))
        : false,
    });
    if (loading) {
      return baseColumns.map((column) => {
        // @ts-ignore
        if (column.columns) {
          return {
            ...column,
            // @ts-ignore
            columns: column.columns.map((subColumn) => ({
              ...subColumn,
              Cell: () => <Skeleton className="h-5 w-full" />,
            })),
          };
        }
        return {
          ...column,
          Cell: () => <Skeleton className="h-5 w-full" />,
        };
      });
    }
    return baseColumns;
  };

  const getSkeletonRow = () => ({
    content: {},
    subRows: [],
  });

  const tableData = loading
    ? Array.from({ length: 20 }, getSkeletonRow)
    : getData({
        funnelSteps,
        portfolioContents: paginatedContents[pageIndex] || [],
        handleCheckboxAction,
        providerMetricOptions: providerMetricOptionsData?.portfolioV2?.providerMetricOptions,
        metricOptionsLoading,
        isContentSelected: (contentId: number) => selectedContentIds.includes(contentId),
        isAdvancedView: tableView === 'advanced',
        teamId: queryParamTeamId,
        portfolioInfo: {
          start: portfolioMeta?.start,
          end: portfolioMeta?.end,
          portfolioId: portfolioMeta?.portfolioId,
        },
      });

  return (
    <>
      {/* Header */}
      <div className="mb-7 ml-1 flex justify-between">
        <div>
          <div className="text-[20px] font-medium tracking-normal">Content</div>
          <div className="text-md font-normal text-neutral-500">See and manage all contents in your portfolio.</div>
        </div>
        <ContentEditWrapperStyled useAbsolutePosition={true}>
          {useLegacySearchScreen ? <ContentEdit dateTo={dateTo} dateFrom={dateFrom} /> : <ContentEditWizard />}
        </ContentEditWrapperStyled>
      </div>

      {/* Filter and View Controls */}
      <div className="mb-4 flex w-full justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <ContentFilter />
          </div>
          <ContentFilterChips />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] uppercase text-neutral-300">Table view</span>
          <MultipleSwitch
            sections={TABLE_VIEW_OPTIONS}
            initial={tableView}
            current={tableView}
            onToggle={setTableView}
          />
        </div>
      </div>

      {/* Table or No Data */}
      {isMounted && (
        <>
          {loading || paginatedContents[pageIndex]?.length ? (
            <TableStyled maxHeight="90vh">
              <VirtualizerExtendedTable
                tableId="content_table"
                disableManager={false}
                disableExpanded={false}
                disablePagination
                data={tableData}
                columns={getProcessedColumns(loading)}
                tableView={tableView}
                renderTableManager={({
                  columns,
                  getToggleHideAllColumnsProps,
                  toggleHideAllColumns,
                  setStickyColumns,
                  stickyColumns,
                }) => (
                  <TableManager
                    idsNotAllowedToHide={[ACTIONS_HEADER_ID, 'expander', 'content']}
                    columns={columns}
                    getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
                    toggleHideAllColumns={toggleHideAllColumns}
                    setStickyColumns={setStickyColumns}
                    stickyColumns={stickyColumns}
                    depth={0}
                  />
                )}
              />
            </TableStyled>
          ) : (
            <NoDataFound
              icon={<SvgKpi />}
              title="There are no contents assigned in this portfolio."
              subtitle="Please select the 'Edit content' button to add contents. Once you do, you will see them here."
            />
          )}

          {/* Pagination */}
          <div className={cn('flex justify-end', selectedContentIds.length ? 'mb-14' : '')}>
            <PaginationControls
              showFirstPageButton={false}
              showLastPageButton={false}
              gotoPage={handlePageChange}
              canPreviousPage={pageIndex > 0}
              canNextPage={pageInfo?.hasNextPage}
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageSize={pageSize}
              pageOptions={Array.from({ length: pageCount }, (_, i) => i)}
              setPageSize={handlePageSizeChange}
              nextPage={() => handlePageChange(pageIndex + 1)}
              previousPage={() => handlePageChange(pageIndex - 1)}
            />
          </div>

          {/* Bulk Actions */}
          {selectedContentIds.length > 0 && (
            <BulkActionsFloatingBar
              resetContentSelection={() => setSelectedContentIds([])}
              contents={paginatedContents?.[pageIndex]?.filter((pc) =>
                selectedContentIds.includes(pc.content?.contentId),
              )}
            />
          )}
        </>
      )}
    </>
  );
}

export default Content;
