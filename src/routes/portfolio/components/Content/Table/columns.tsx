import * as Styles from '../../../styles/ContentTableRow';
import SvgChevronDown from '../../../../../components/icons/ChevronDown';
import React from 'react';
import { NexoyaFunnelStepV2, NexoyaPortfolioParentContentsSortField } from '../../../../../types';
import styled from 'styled-components';
import { nexyColors } from '../../../../../theme';
import { BigHeaderCell } from 'routes/portfolio/styles/OptimizationProposal';
import { HeaderSortCell } from './HeaderSortCell';
import Checkbox from '../../../../../components/Checkbox';

export const HeaderCell = styled.div`
  color: ${nexyColors.neutral400};

  /* Headings/H6 */
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 15.4px */
  letter-spacing: 0.44px;
  text-transform: uppercase;
  padding: 0;
`;

interface Props {
  funnelSteps: NexoyaFunnelStepV2[];
  hasBidStrategy: boolean;
  hasBudgetLimits: boolean;
  isAttributed: boolean;
  hasLabels: boolean;
  tableView: 'simple' | 'advanced';
  handleSelectAllContents: () => void;
  allContentsSelected: boolean;
  hasSelfServicePortfolioFeatureEnabled?: boolean;
}

export const getColumns = ({
  funnelSteps,
  hasLabels,
  hasBidStrategy,
  hasBudgetLimits,
  isAttributed,
  tableView,
  handleSelectAllContents,
  allContentsSelected,
  hasSelfServicePortfolioFeatureEnabled,
}: Props) => {
  const expanderColumn = {
    Header: '',
    accessor: 'expander',
    id: 'expander',
    width: '50',
    disableSortBy: true,
    disableHiding: true,
    disableSticky: true,
    isHiddenInManager: true,
    Cell: ({ row }) => {
      return row.original.hasChildren ? (
        <Styles.ChevronWrap expanded={row.isExpanded} className="!py-2.5" {...row.getToggleRowExpandedProps()}>
          <SvgChevronDown />
        </Styles.ChevronWrap>
      ) : null;
    },
  };

  const SIMPLE_COLUMNS = [
    {
      Header: '',
      accessor: 'editRow',
      id: 'editRow',
      width: '48',
      disableSortBy: true,
      disableHiding: true,
      isHiddenInManager: true,
      disableSticky: true,
    },
    {
      Header: <Checkbox className="!pl-0 !pr-0.5" onClick={handleSelectAllContents} checked={allContentsSelected} />,
      id: 'selectContent',
      accessor: 'selectContent',
      disableSortBy: true,
      enableColumnResize: false,
      width: 45,
      isHiddenInManager: true,
      disableSticky: true,
    },

    {
      Header: (
        <HeaderSortCell sortFieldKey={NexoyaPortfolioParentContentsSortField.ContentTitle}>Content</HeaderSortCell>
      ),
      tableManagerHeader: <BigHeaderCell>Content</BigHeaderCell>,
      id: 'content',
      accessor: 'content',
      className: 'border-right',
      minWidth: 600,
      disableHiding: true,
      disableSortBy: true,
      enableColumnResize: true,
    },
    {
      Header: (
        <HeaderSortCell sortFieldKey={NexoyaPortfolioParentContentsSortField.IsIncludedInOptimization}>
          Optimization
        </HeaderSortCell>
      ),
      tableManagerHeader: <BigHeaderCell>Optimization</BigHeaderCell>,
      width: 200,
      accessor: 'optimization',
      className: 'border-right',
      enableColumnResize: true,
      disableSortBy: true,
      disableSticky: true,
    },
    {
      Header: (
        <HeaderSortCell sortFieldKey={NexoyaPortfolioParentContentsSortField.ContentType}>Content level</HeaderSortCell>
      ),
      tableManagerHeader: <BigHeaderCell>Content level</BigHeaderCell>,
      width: 200,
      accessor: 'contentLevel',
      className: 'border-right',
      enableColumnResize: true,
      disableSortBy: true,
      disableSticky: true,
    },
    {
      Header: (
        <HeaderSortCell sortFieldKey={NexoyaPortfolioParentContentsSortField.IsRuleManaged}>
          Content mode
        </HeaderSortCell>
      ),
      tableManagerHeader: <BigHeaderCell>Content mode</BigHeaderCell>,
      width: 200,
      accessor: 'contentMode',
      className: 'border-right',
      enableColumnResize: true,
      disableSortBy: true,
      disableSticky: true,
    },
    hasLabels
      ? {
          Header: (
            <HeaderSortCell sortFieldKey={NexoyaPortfolioParentContentsSortField.LabelName}>Label</HeaderSortCell>
          ),
          tableManagerHeader: <BigHeaderCell>Label</BigHeaderCell>,
          enableColumnResize: true,
          className: 'border-right',
          accessor: 'label',
          minWidth: 200,
          disableSortBy: true,
          disableSticky: true,
        }
      : null,
    !isAttributed
      ? {
          Header: (
            <HeaderSortCell sortFieldKey={NexoyaPortfolioParentContentsSortField.ImpactGroupName}>
              Impact group
            </HeaderSortCell>
          ),
          tableManagerHeader: <BigHeaderCell>Impact group</BigHeaderCell>,
          accessor: 'impactGroup',
          enableColumnResize: true,
          className: 'border-right',
          minWidth: 250,
          disableSortBy: true,
          disableSticky: true,
        }
      : null,
    hasBudgetLimits
      ? {
          Header: <HeaderCell>Budget limit</HeaderCell>,
          tableManagerHeader: <BigHeaderCell>Budget limit</BigHeaderCell>,
          enableColumnResize: true,
          className: 'border-right',
          disableSortBy: true,
          accessor: 'budgetLimit',
          minWidth: 250,
          disableSticky: true,
        }
      : null,
    hasSelfServicePortfolioFeatureEnabled
      ? {
          Header: (
            <HeaderSortCell sortFieldKey={NexoyaPortfolioParentContentsSortField.ContentRuleName}>
              Content rule
            </HeaderSortCell>
          ),
          tableManagerHeader: <BigHeaderCell>Content rule</BigHeaderCell>,
          accessor: 'contentRule',
          enableColumnResize: true,
          className: 'border-right',
          minWidth: 250,
          disableSortBy: true,
          disableSticky: true,
        }
      : null,
    !isAttributed && hasSelfServicePortfolioFeatureEnabled
      ? {
          Header: (
            <HeaderSortCell sortFieldKey={NexoyaPortfolioParentContentsSortField.ImpactGroupRuleName}>
              Impact group rule
            </HeaderSortCell>
          ),
          tableManagerHeader: <BigHeaderCell>Impact group rule</BigHeaderCell>,
          accessor: 'impactGroupRule',
          enableColumnResize: true,
          className: 'border-right',
          minWidth: 250,
          disableSortBy: true,
          disableSticky: true,
        }
      : null,
    isAttributed
      ? {
          Header: (
            <HeaderSortCell sortFieldKey={NexoyaPortfolioParentContentsSortField.AttributionRuleName}>
              Attribution rule
            </HeaderSortCell>
          ),
          tableManagerHeader: <BigHeaderCell>Attribution rule</BigHeaderCell>,
          accessor: 'attributionRule',
          enableColumnResize: true,
          className: 'border-right',
          minWidth: 250,
          disableSortBy: true,
          disableSticky: true,
        }
      : null,
  ].filter(Boolean);

  const ADVANCED_COLUMNS = [
    hasBidStrategy
      ? {
          Header: <HeaderCell>Bidding strategy</HeaderCell>,
          tableManagerHeader: <BigHeaderCell>Bidding strategy</BigHeaderCell>,
          enableColumnResize: true,
          accessor: 'bidStrategy',
          className: 'border-right',
          disableSortBy: true,
          minWidth: 250,
          disableSticky: true,
        }
      : null,
    ...funnelSteps.map((funnelStep) => ({
      className: 'border-right',
      Header: <HeaderCell>{funnelStep.title}</HeaderCell>,
      tableManagerHeader: <BigHeaderCell>{funnelStep.title}</BigHeaderCell>,
      accessor: `funnel_${funnelStep.funnelStepId}`,
      disableSortBy: true,
      enableColumnResize: true,
      minWidth: 250,
      disableSticky: true,
    })),
  ].filter(Boolean);

  if (tableView === 'simple') {
    return SIMPLE_COLUMNS;
  }

  if (tableView === 'advanced') {
    const baseColumns = SIMPLE_COLUMNS;

    baseColumns.splice(2, 0, expanderColumn);

    return [...baseColumns, ...ADVANCED_COLUMNS];
  }
};
