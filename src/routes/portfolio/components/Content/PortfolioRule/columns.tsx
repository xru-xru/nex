import React from 'react';
import { BigHeaderCell } from '../../../styles/OptimizationProposal';
import { withSortSkipped } from '../../OptimizationProposal/withSortSkipped';
import { sortTypes } from '../../../../../components/Table/sortTypes';
import { ACTIONS_HEADER_ID } from '../../OptimizationProposal/columns';

export const getColumns = () => [
  {
    accessor: ACTIONS_HEADER_ID,
    disableSortBy: true,
    Header: '',
    tableManagerHeader: <BigHeaderCell>Content</BigHeaderCell>,
    className: 'border-right',
    columns: [
      {
        Header: '',
        id: 'excludeContent',
        accessor: 'excludeContent',
        className: 'border-right',
        disableSortBy: true,
        enableColumnResize: true,
        width: 45,
        sortType: withSortSkipped(sortTypes.jsxKey),
      },
      {
        Header: 'Content',
        id: 'content',
        accessor: 'content',
        className: 'border-right',
        enableColumnResize: true,
        width: '100%',
        sortType: withSortSkipped(sortTypes.jsxKey),
      },
    ],
  },
  {
    accessor: 'parentHeader',
    disableSortBy: true,
    Header: '',
    tableManagerHeader: <BigHeaderCell>Parent content</BigHeaderCell>,
    columns: [
      {
        Header: 'Parent content',
        accessor: 'parent',
        className: 'border-right',
        enableColumnResize: true,
        width: 200,
        sortType: withSortSkipped(sortTypes.jsxKey),
      },
    ],
  },
  {
    accessor: 'contentLevelHeader',
    disableSortBy: true,
    Header: '',
    tableManagerHeader: <BigHeaderCell>Content level</BigHeaderCell>,
    columns: [
      {
        Header: 'Content level',
        accessor: 'contentLevel',
        className: 'border-right',
        enableColumnResize: true,
        sortType: withSortSkipped(sortTypes.jsxKey),
      },
    ],
  },
  {
    accessor: 'isInPortfolioHeader',
    disableSortBy: true,
    Header: '',
    tableManagerHeader: <BigHeaderCell>In portfolio?</BigHeaderCell>,
    columns: [
      {
        Header: 'In portfolio',
        accessor: 'isInPortfolio',
        className: 'border-right',
        enableColumnResize: true,
        sortType: withSortSkipped(sortTypes.jsxKey),
      },
    ],
  },
  // {
  //   accessor: 'contentStatusHeader',
  //   disableSortBy: true,
  //   Header: '',
  //   tableManagerHeader: <BigHeaderCell>Content status</BigHeaderCell>,
  //   columns: [
  //     {
  //       Header: 'Content status',
  //       accessor: 'status',
  //       className: 'border-right',
  //       enableColumnResize: true,
  //       sortType: withSortSkipped(sortTypes.jsxKey),
  //     },
  //   ],
  // },

  {
    accessor: 'biddingStrategyHeader',
    disableSortBy: true,
    Header: '',
    tableManagerHeader: <BigHeaderCell>Bidding strategy</BigHeaderCell>,
    columns: [
      {
        Header: 'Bidding strategy',
        accessor: 'biddingStrategy',
        className: 'border-right',
        enableColumnResize: true,
        sortType: withSortSkipped(sortTypes.jsxKey),
      },
    ],
  },
  {
    accessor: 'budgetHeader',
    disableSortBy: true,
    Header: '',
    tableManagerHeader: <BigHeaderCell>Budget</BigHeaderCell>,
    columns: [
      {
        Header: 'Budget',
        accessor: 'budget',
        className: 'border-right',
        enableColumnResize: true,
        sortType: withSortSkipped(sortTypes.jsxKey),
      },
    ],
  },
  {
    accessor: 'durationHeader',
    disableSortBy: true,
    Header: '',
    tableManagerHeader: <BigHeaderCell>Duration</BigHeaderCell>,
    columns: [
      {
        Header: 'Duration',
        accessor: 'duration',
        enableColumnResize: true,
        className: 'border-right',
        sortType: withSortSkipped(sortTypes.jsxKey),
        minWidth: 300,
      },
    ],
  },

  {
    accessor: 'latestMeasurementDataDateHeader',
    disableSortBy: true,
    Header: '',
    tableManagerHeader: <BigHeaderCell>Latest measurement date</BigHeaderCell>,
    columns: [
      {
        Header: 'Latest measurement date',
        accessor: 'latestMeasurementDataDate',
        className: 'border-right',
        enableColumnResize: true,
        width: 300,
        sortType: withSortSkipped(sortTypes.jsxKey),
      },
    ],
  },
  // {
  //   accessor: 'budgetHeader',
  //   disableSortBy: true,
  //   Header: '',
  //   tableManagerHeader: <BigHeaderCell>Budget</BigHeaderCell>,
  //   columns: [
  //     {
  //       Header: 'Budget',
  //       accessor: 'budget',
  //       className: 'border-right',
  //       enableColumnResize: true,
  //       sortType: withSortSkipped(sortTypes.jsxKey),
  //     },
  //   ],
  // },
  // {
  //   accessor: 'attributionWindowHeader',
  //   disableSortBy: true,
  //   Header: '',
  //   tableManagerHeader: <BigHeaderCell>Attribution window</BigHeaderCell>,
  //   columns: [
  //     {
  //       Header: 'Attribution window',
  //       enableColumnResize: true,
  //       className: 'border-right',
  //       accessor: 'attributionWindow',
  //       sortType: withSortSkipped(sortTypes.jsxKey),
  //       minWidth: 162,
  //     },
  //   ],
  // },

  // {
  //   accessor: 'materialityHeader',
  //   disableSortBy: true,
  //   Header: '',
  //   tableManagerHeader: <BigHeaderCell>Materiality - prev 30d</BigHeaderCell>,
  //   columns: [
  //     {
  //       Header: 'Materiality - prev 30d',
  //       enableColumnResize: true,
  //       className: 'border-right',
  //       disableSortBy: true,
  //       accessor: 'materiality',
  //     },
  //   ],
  // },
  // {
  //   accessor: 'avgSpendHeader',
  //   disableSortBy: true,
  //   Header: '',
  //   tableManagerHeader: <BigHeaderCell>Average spend - prev 7d</BigHeaderCell>,
  //   columns: [
  //     {
  //       Header: 'Average spend - prev 7d',
  //       enableColumnResize: true,
  //       accessor: 'avgSpend',
  //       className: 'border-right',
  //       disableSortBy: true,
  //       minWidth: 200,
  //     },
  //   ],
  // },
];
