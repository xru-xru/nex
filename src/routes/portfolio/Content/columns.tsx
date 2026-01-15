import { ACTIONS_HEADER_ID } from '../components/OptimizationProposal/columns';
import { BigHeaderCell } from '../styles/OptimizationProposal';
import { withSortSkipped } from '../components/OptimizationProposal/withSortSkipped';
import { sortTypes } from '../../../components/Table/sortTypes';
import Checkbox from '../../../components/Checkbox';

export const getColumns = ({
  allSelected,
  toggleAllSelected,
  contentWidth,
}: {
  allSelected: boolean;
  toggleAllSelected: () => void;
  contentWidth: number;
}) => [
  {
    accessor: ACTIONS_HEADER_ID,
    disableSortBy: true,
    Header: '',
    tableManagerHeader: <BigHeaderCell>Content</BigHeaderCell>,
    className: 'border-right',
    columns: [
      {
        Header: () => (
          <div className="flex h-full items-center justify-center">
            <Checkbox type="checkbox" checked={allSelected} onChange={toggleAllSelected} />
          </div>
        ),
        id: 'select',
        accessor: 'select',
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
        width: contentWidth,
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
];
