import React, { Dispatch, SetStateAction } from 'react';
import { classes, ExtendedTable } from '../../Table/ExtendedTable';
import { getData } from '../../../routes/portfolio/components/Content/PortfolioRule/data-table';
import { getColumns } from '../../../routes/portfolio/components/Content/PortfolioRule/columns';
import { TableManager } from '../../Table/TableManager';
import { ACTIONS_HEADER_ID } from '../../../routes/portfolio/components/OptimizationProposal/columns';
import { TableStyled } from '../../../routes/portfolio/styles/OptimizationProposal';
import { DataTableFilterOption } from '../../../routes/portfolio/components/Content/PortfolioRule/types';

import { NexoyaContentFilterFieldName, NexoyaContentFilterOperator } from '../../../types';
import {
  getFilterValueInputBasedOnType,
  PortfolioRuleType,
} from '../../../routes/portfolio/components/Content/PortfolioRule/utils';
import { useFilteredContentsQuery } from '../../../graphql/portfolioRules/queryFilteredContents';
import { Skeleton } from '../../../components-ui/Skeleton';
import { toast } from 'sonner';
import styled from 'styled-components';
import { useFilteredContentsStore } from '../../../store/filter-contents';
import { createArrayOf } from '../../../utils/array';
import NoDataFound from '../../../routes/portfolio/NoDataFound';
import { SlidersHorizontal } from 'lucide-react';

interface Props {
  filters: DataTableFilterOption[];
  providerIds: number[];
  accountIds: number[];
  portfolioId: number;
  shouldFetch?: boolean;
  excludePortfolioContents?: boolean;
  setShouldFetch?: Dispatch<SetStateAction<boolean>>;
  selectedContentIds: number[];
  setSelectedContentIds: Dispatch<SetStateAction<number[]>>;
  configType: PortfolioRuleType | 'portfolio-events' | 'other';
  handleCheckboxAction: (contentId: number) => void;
  defaultPageSize?: number;
  inPortfolioOnly?: boolean;
  // Whether to auto-select filtered items when filters change.
  // Set to false when we want to preserve only explicitly selected items —
  // e.g., when editing assigned contents for portfolio events, we want to display only what was already selected.
  preselectNewFilteredItems?: boolean;
}

function FilterContentsTable({
  filters,
  providerIds,
  accountIds,
  portfolioId,
  shouldFetch,
  setShouldFetch,
  selectedContentIds,
  setSelectedContentIds,
  excludePortfolioContents,
  configType,
  handleCheckboxAction,
  defaultPageSize = 50,
  inPortfolioOnly,
  preselectNewFilteredItems = true,
}: Props) {
  const { filteredContents, setFilteredContents } = useFilteredContentsStore();

  const getDeduplicatedFilters = (filters: DataTableFilterOption[]) =>
    filters.filter(
      (filter, index, self) =>
        filter?.filterValues?.length > 0 &&
        filter?.filterValues?.some((value) => value !== '') &&
        (filter.type !== 'date' ||
          self.findIndex(
            (f) => f.type === filter.type && f.value === filter.value && f.filterOperator === filter.filterOperator,
          ) === index),
    );

  const deduplicatedFilters = getDeduplicatedFilters(filters);

  const { loading } = useFilteredContentsQuery({
    portfolioId,
    filters: [
      ...deduplicatedFilters.map((option) => ({
        fieldName: option.value as NexoyaContentFilterFieldName,
        operator: option.filterOperator as NexoyaContentFilterOperator,
        value: getFilterValueInputBasedOnType(option.type, option.filterValues),
      })),
      providerIds?.length
        ? {
            fieldName: NexoyaContentFilterFieldName.SourceProviderId,
            operator: NexoyaContentFilterOperator.Eq,
            value: { numberArr: providerIds?.map((providerId) => providerId) },
          }
        : null,
      accountIds?.length
        ? {
            fieldName: NexoyaContentFilterFieldName.ParentContentId,
            operator: NexoyaContentFilterOperator.Eq,
            value: { numberArr: accountIds?.map((accountId) => accountId) },
          }
        : null,
    ].filter(Boolean),
    excludePortfolioContents,
    inPortfolioOnly: inPortfolioOnly || false,
    skip: !shouldFetch || (!deduplicatedFilters?.length && !providerIds?.length && !accountIds?.length),
    onCompleted: (data) => {
      const filteredContents =
        configType === 'content-rule'
          ? data?.filterContents
          : // TODO: Cover the case when child contents are also included in the portfolio events config type
            configType === 'portfolio-events'
            ? data?.filterContents?.filter((fc) => fc.portfolioContentId)
            : data?.filterContents;
      setFilteredContents(filteredContents || []);
      setShouldFetch(false);
      if (preselectNewFilteredItems) {
        setSelectedContentIds(filteredContents.map((fc) => fc.contentId) || []);
      }
    },
    onError: (error) => {
      console.error('Error fetching filtered contents:', error);
      toast.error('Error fetching filtered contents');
      setFilteredContents([]);
      setSelectedContentIds([]);
    },
  });

  const tableData = loading
    ? createArrayOf(10)
    : getData({
        content: filteredContents,
        isContentExcluded: (contentId: number) => !selectedContentIds?.includes(contentId),
        handleCheckboxAction,
      });

  const columns = getProcessedColumns(loading);

  return filteredContents?.length || loading ? (
    <TableContainerStyled className="w-full max-w-[1998px]" maxHeight="80vh">
      <ExtendedTable
        tableId="content_table"
        disablePagination={false}
        disableManager={false}
        disableExpanded={false}
        data={tableData}
        columns={columns}
        defaultPageSize={defaultPageSize}
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
            depth={1}
          />
        )}
      />
    </TableContainerStyled>
  ) : (
    <NoDataFound
      icon={
        <div className="rounded-full bg-[#E6F9F0] p-2">
          <SlidersHorizontal className="!size-6 text-[#0EC76A]" />
        </div>
      }
      title={
        providerIds?.length && accountIds.length
          ? 'No data found for the current filter'
          : 'Get started by selecting a filter'
      }
      subtitle={
        providerIds?.length && accountIds.length
          ? 'Change the filter and then try again with your new selection'
          : 'In order to see the contents here, start by select a filter to filter the contents'
      }
    />
  );
}

export default FilterContentsTable;

const getProcessedColumns = (loading: boolean) => {
  const baseColumns = getColumns();
  if (loading) {
    return baseColumns.map((column) => ({
      ...column,
      columns: column.columns?.map((subColumn) => ({
        ...subColumn,
        Cell: () => <Skeleton className="h-5 w-full" />,
      })),
    }));
  }
  return baseColumns;
};

const TableContainerStyled = styled(TableStyled)`
  .${classes.container} {
    max-height: 67vh;
    @media (max-height: 1072px) {
      max-height: 61vh;
    }
  }
`;
