import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import {
  Cell,
  Column,
  ColumnInstance,
  HeaderGroup,
  Row as RowType,
  TableCellProps,
  TableHeaderProps,
  TableInstance,
  TableOptions,
  TableToggleAllRowsSelectedProps,
  TableToggleHideAllColumnProps,
  useBlockLayout,
  useExpanded,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';

import clsx from 'clsx';
import styled from 'styled-components';

import { useUserQuery } from '../../graphql/user/queryUser';

import { ACTIONS_HEADER_ID, SELECT_HEADER_ID } from '../../routes/portfolio/components/OptimizationProposal/columns';
import SvgSort from 'components/icons/Sort2';

import { colorByKey } from 'theme/utils';

import { nexyColors } from '../../theme';
import { ButtonSortStyled } from './ButtonSortStyled';
import { Row } from './Row';
import { getInitialHiddenColumnsByUser } from './cacheHiddenColumns';
import { sortTypes } from './sortTypes';
import { IColumnProps } from './tableTypes';
import Checkbox from '../Checkbox';
import { cn } from '../../lib/utils';
import { PaginationControls } from './PaginationControls';
import { useVirtualizer } from '@tanstack/react-virtual';

const TABLE_VERSION = 1;
const TABLE_MANAGER_WIDTH = 32;
const EDIT_COLUMN_WIDTH = 48;
const EXPANDER_COLUMN_WIDTH = 50;
const SELECT_COLUMN_WIDTH = 45;

export const classes = {
  container: 'NEXYTableContainer',
  header: 'NEXYTableHeader',
  row: 'NEXYTableRow',
};

interface TableProps<D extends object = {}> extends TableOptions<D> {
  disableManager?: boolean;
  disableExpanded?: boolean;
  disableSort?: boolean;
  disablePagination?: boolean;
  disableRowSelection?: boolean;
  onSelectedRowsChange?: (rows: RowType<D>[]) => void;
  tableId?: string;
  tableView?: 'simple' | 'advanced';
  getCustomCellStyles?: (cell: Column<IColumnProps>, row?: RowType, column?: any) => React.CSSProperties;
  renderTableManager?: (props: TableManagerProps) => JSX.Element;
  defaultPageSize?: number;
}

interface TableManagerProps {
  setStickyColumns: (value: ((prevState: string[]) => string[]) | string[]) => void;
  columns: Array<ColumnInstance<{}>>;
  getToggleHideAllColumnsProps: (props?: Partial<TableToggleHideAllColumnProps>) => TableToggleHideAllColumnProps;
  rows: Array<RowType<{}>>;
  toggleHideAllColumns: (value?: boolean) => void;
  stickyColumns: string[];
  onSelectedRowsChange?: (rows: RowType<{}>[]) => void;
  tableId?: string;
  tableView?: 'simple' | 'advanced';
  defaultPageSize?: number;
}

// Define a type that includes pagination properties
type TableInstanceWithPagination<D extends object = {}> = TableInstance<D> & {
  page: Array<RowType<D>>;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: number[];
  pageCount: number;
  gotoPage: (updater: ((pageIndex: number) => number) | number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (pageSize: number) => void;
  selectedFlatRows: RowType<D>[];
  toggleRowSelected: (rowId: string, set?: boolean) => void;
  toggleAllRowsSelected: (value?: boolean) => void;
  getToggleAllPageRowsSelectedProps: () => TableToggleAllRowsSelectedProps;
  getToggleRowSelectedProps: (row: RowType<D>) => TableToggleAllRowsSelectedProps;
  state: {
    pageIndex: number;
    pageSize: number;
    selectedRowIds: Record<string, boolean>;
  };
};

export const VirtualizerExtendedTable: React.FC<TableProps> = ({
  columns,
  data,
  disableManager,
  disableSort,
  getCustomCellStyles,
  renderTableManager,
  disableExpanded = true,
  disablePagination = true,
  disableRowSelection = true,
  onSelectedRowsChange,
  tableId,
  tableView,
  defaultPageSize = 50,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  React.useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const handleScroll = () => {
        setScrollLeft(scrollElement.scrollLeft);
      };
      scrollElement.addEventListener('scroll', handleScroll);
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const hooks: any[] = [useBlockLayout, useResizeColumns, useGlobalFilter];

  if (!disableSort) hooks.push(useSortBy);
  if (!disableExpanded) hooks.push(useExpanded);
  if (!disablePagination) hooks.push(usePagination);
  if (!disableRowSelection) hooks.push(useRowSelect);

  const match = useRouteMatch<{ portfolioID: string }>();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { data: userData } = useUserQuery();
  const localStorageKey = `${tableId}-${TABLE_VERSION}-tableManager-${userData?.user?.user_id}-${portfolioId}`;

  const localStorageData = getInitialHiddenColumnsByUser(localStorageKey);
  const [stickyColumns, setStickyColumns] = useState(localStorageData.stickyColumns || []);
  const [columnWidths, setColumnWidths] = useState(localStorageData.columnWidths || {});
  const [sortState, setSortState] = useState([]);

  const tableInstance = useTable(
    {
      columns,
      data,
      sortTypes,
      autoResetExpanded: false,
      autoResetResize: false,
      autoResetPage: false,
      // @ts-ignore
      getRowId: (originalRow, relativeIndex) => `${relativeIndex}_${originalRow.contentId}`,
      initialState: {
        hiddenColumns: localStorageData.hiddenColumns,
        // @ts-ignore
        columnResizing: { columnWidths: localStorageData.columnWidths || {} },
        sortBy: sortState,
        pageIndex: 0,
        pageSize: defaultPageSize,
      },
      stateReducer: handleStateReducer,
    },
    ...hooks,
    (hooks) => {
      if (!disableRowSelection) {
        hooks.columns.push((columns) => [
          {
            accessor: SELECT_HEADER_ID,
            id: SELECT_HEADER_ID,
            disableSortBy: true,
            Header: '',
            width: 45,
            isHiddenInManager: true,
            className: 'border-right !p-0',
            columns: [
              {
                width: 45,
                className: 'border-right !p-0',
                isHiddenInManager: true,
                disableSortBy: true,

                id: 'selection',
                // The header can use the table's getToggleAllRowsSelectedProps method or  getToggleAllPageRowsSelectedProps for paginated selection
                // @ts-ignore
                Header: ({ getToggleAllRowsSelectedProps }) => (
                  <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                ),
                // The cell can use the individual row's getToggleRowSelectedProps method
                // to the render a checkbox
                Cell: ({ row }) => (
                  // @ts-ignore
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                ),
              },
            ],
          },

          ...columns,
        ]);
      }
    },
  ) as TableInstanceWithPagination;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    allColumns,
    state: { hiddenColumns, pageIndex, pageSize, selectedRowIds },
    setHiddenColumns,
    selectedFlatRows,
    getToggleHideAllColumnsProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = tableInstance;

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify({ hiddenColumns, stickyColumns, columnWidths }));
  }, [hiddenColumns, stickyColumns, columnWidths, localStorageKey]);

  useEffect(() => {
    if (selectedFlatRows && onSelectedRowsChange && !disableRowSelection) {
      onSelectedRowsChange(selectedFlatRows);
    }
  }, [selectedFlatRows, onSelectedRowsChange]);

  ensureNotAllHidden(allColumns);

  const toggleHideAllColumns = () => {
    // @ts-ignore
    const hideableColumns = allColumns.filter((column) => !column.disableHiding).map((column) => column.id);
    const allHideableColumnsHidden = hideableColumns.every((columnId) => hiddenColumns.includes(columnId));

    if (allHideableColumnsHidden) {
      // Unhide all hideable columns
      setHiddenColumns(hiddenColumns.filter((columnId) => !hideableColumns.includes(columnId)));
    } else {
      // Hide all hideable columns
      setHiddenColumns([...hiddenColumns, ...hideableColumns]);
    }
  };

  const displayRows = !disablePagination
    ? getPaginatedRows(
        // @ts-ignore
        rows.filter((row) => !row.depth),
        pageIndex,
        pageSize,
      )
    : rows;

  return (
    <>
      <StyledTable className={classes.container} enableSticky={true} ref={scrollRef}>
        <table {...getTableProps()}>
          <TableHeader
            headerGroups={headerGroups}
            disableSort={disableSort}
            disableManager={disableManager}
            renderTableManager={renderTableManager}
            getCustomCellStyles={getCustomCellStyles}
            getStylingByHeader={getStylingByHeader}
            allColumns={allColumns}
            getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
            toggleHideAllColumns={toggleHideAllColumns}
            setStickyColumns={setStickyColumns}
            stickyColumns={stickyColumns}
            rows={displayRows}
            scrollLeft={scrollLeft}
            tableView={tableView}
          />
          <TableBody
            rows={displayRows}
            prepareRow={prepareRow}
            disableManager={disableManager}
            getCustomCellStyles={getCustomCellStyles}
            getCellStyling={getCellStyling}
            scrollLeft={scrollLeft}
            tableView={tableView}
          />
        </table>
      </StyledTable>
      <div className={cn('flex w-full', !disableRowSelection ? 'justify-between' : 'justify-end')}>
        {!disableRowSelection && (
          <div className="flex items-center py-3 font-light text-neutral-500">
            <p>
              {Object.keys(selectedRowIds).length} of {rows?.length} row(s) selected
            </p>
          </div>
        )}
        {!disablePagination ? (
          <PaginationControls
            gotoPage={gotoPage}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageOptions={pageOptions}
            pageSize={pageSize}
            setPageSize={setPageSize}
            nextPage={nextPage}
            previousPage={previousPage}
          />
        ) : null}
      </div>
    </>
  );

  function handleStateReducer(newState, action) {
    switch (action.type) {
      case 'toggleSortBy':
        setSortState(newState.sortBy);
        break;
      case 'columnResizing':
        const columnId = Object.keys(newState.columnResizing.columnWidths)[0];
        const contentColumn = document.querySelector(`[data-column-id="${columnId}"]`);

        if (contentColumn && !newState.columnResizing.columnWidths[columnId]) {
          const currentWidth = contentColumn.getBoundingClientRect().width;
          newState.columnResizing.columnWidth = currentWidth;
          newState.columnResizing.columnWidths[columnId] = currentWidth;
          newState.columnResizing.headerIdWidths = [[columnId, currentWidth]];
        }

        setColumnWidths({ ...newState.columnResizing.columnWidths });
        break;
    }
    return newState;
  }

  function getStylingByHeader(header: HeaderGroup<IColumnProps>) {
    const isSticky = stickyColumns.includes(header.id.split('_')[0]) || stickyColumns.includes(header.id.split('_')[0]);

    if (isSticky) {
      return {
        className: 'sticky',
        isSticky: true,
        style: {
          left: '0px',
          boxShadow: '2px 0px 2px 0px rgba(0, 0, 0, 0.05)',
          zIndex: 10,
          overflow: 'visible',
        },
      };
    }
    return { isSticky: false, style: {} };
  }

  function getCellStyling(cell: Cell<IColumnProps>) {
    const headers = headerGroups.flatMap((headerGroup) => headerGroup.headers);
    const header = headers.find((header) => header.id === cell.column.id);
    return getStylingByHeader(header);
  }
};

const TableHeader = ({
  headerGroups,
  disableSort,
  disableManager,
  renderTableManager,
  getCustomCellStyles,
  getStylingByHeader,
  allColumns,
  getToggleHideAllColumnsProps,
  toggleHideAllColumns,
  setStickyColumns,
  stickyColumns,
  rows,
  scrollLeft,
  tableView,
}) => {
  // Find the first column to insert the table manager once
  const managerColumnId = React.useMemo(() => {
    const firstGroup = headerGroups[0];
    if (!firstGroup) return null;

    const column = firstGroup.headers.find(
      (col) => col.originalId === ACTIONS_HEADER_ID || firstGroup.headers.indexOf(col) === 0,
    );
    return column?.id;
  }, [headerGroups]);

  return (
    <thead className={classes.header}>
      {headerGroups.map((headerGroup, index) => (
        <tr {...headerGroup.getHeaderGroupProps()} key={index}>
          {headerGroup.headers.map((column) => {
            const sortStyles = !disableSort ? column.getSortByToggleProps() : null;
            const stickyStyles = getStylingByHeader(column);

            const headerProps = column.getHeaderProps();
            ensureEvenWidth(headerProps);
            const customStyles = getCustomCellStyles ? getCustomCellStyles(column) : {};
            const shouldRenderManager = !disableManager && column.id === managerColumnId;

            const finalStyles = {
              ...headerProps.style,
              ...customStyles,
              ...(shouldRenderManager ? { display: 'flex', justifyContent: 'flex-start' } : {}),
              ...stickyStyles.style,
            };

            if (stickyStyles.isSticky) {
              let offset = 0;
              if (tableView === 'advanced') {
                offset = EXPANDER_COLUMN_WIDTH + SELECT_COLUMN_WIDTH + EDIT_COLUMN_WIDTH;
              } else if (tableView === 'simple') {
                offset = SELECT_COLUMN_WIDTH + EDIT_COLUMN_WIDTH;
              }
              const transformX = Math.max(0, scrollLeft - offset);
              finalStyles.transform = `translateX(${transformX}px)`;
            }

            return (
              <th
                className={clsx(column['className'] ?? '', stickyStyles.className ?? '')}
                {...headerProps}
                key={column['id']}
                data-column-id={column['id']}
                style={finalStyles}
              >
                {shouldRenderManager &&
                  renderTableManager({
                    columns: allColumns,
                    getToggleHideAllColumnsProps,
                    toggleHideAllColumns,
                    setStickyColumns,
                    stickyColumns,
                    rows,
                  })}
                {/* Rest of the header cell content */}
                {column['enableColumnResize'] && (
                  <div
                    {...column.getResizerProps()}
                    data-resizer={column.id}
                    title="Resize column"
                    className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                  />
                )}
                <Row
                  {...sortStyles}
                  title=""
                  style={{ height: '100%' }}
                  isSortable={!column['disableSortBy']}
                  {...column.rowProps}
                >
                  {column.render('Header')}{' '}
                  {!column['disableSortBy'] && (
                    <ButtonSortStyled
                      style={{ justifySelf: 'start', position: 'static' }}
                      asc={column['isSorted'] ? !column['isSortedDesc'] : null}
                      desc={column['isSortedDesc']}
                    >
                      <SvgSort style={{ width: 12, height: 10.5 }} />
                    </ButtonSortStyled>
                  )}
                </Row>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};

const TableBody = ({
  rows,
  prepareRow,
  disableManager,
  getCustomCellStyles,
  getCellStyling,
  scrollLeft,
  tableView,
}) => {
  const rowVirtualizer = useVirtualizer({
    count: rows.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53,
  });
  const parentRef = React.useRef(null);

  return (
    <div
      ref={parentRef}
      style={{
        height: '700px',
        overflow: 'auto', // Needs to scroll!
        scrollbarWidth: 'none',
      }}
    >
      <table style={{ width: '100%' }}>
        <tbody style={{ position: 'relative', width: '100%' }}>
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const row = rows[virtualItem.index];

            let rowClassList = [classes.row];
            if (row?.original['classList']) rowClassList = [...rowClassList, ...row.original['classList']];
            if (row?.original?.['highlight']) rowClassList.push('highlight');
            prepareRow(row);
            const rowProps = row?.getRowProps();
            return (
              <tr
                className={clsx(rowClassList)}
                {...rowProps}
                key={virtualItem.key}
                style={{
                  ...rowProps.style,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {disableManager ? null : (
                  <td
                    className={clsx([row?.original?.['highlight'] ? 'highlight' : null])}
                    style={{ ...tableManagerColStyle, width: 0, padding: 0, minWidth: 0 }}
                  />
                )}
                {row?.cells.map((cell) => {
                  const classList = [];
                  const styling = getCellStyling(cell);
                  if (styling.className) classList.push(styling.className);
                  if (cell.column['className']) classList.push(cell.column['className']);
                  if (row?.original?.['highlight']) classList.push('highlight');
                  if (row?.original?.['lightHighlight']) classList.push('lightHighlight');

                  const cellStyle = { ...styling.style };
                  if (styling.isSticky) {
                    let offset = 0;
                    if (tableView === 'advanced') {
                      offset = EXPANDER_COLUMN_WIDTH + SELECT_COLUMN_WIDTH + EDIT_COLUMN_WIDTH;
                    } else if (tableView === 'simple') {
                      offset = SELECT_COLUMN_WIDTH + EDIT_COLUMN_WIDTH;
                    }
                    const transformX = Math.max(0, scrollLeft - offset);
                    cellStyle.transform = `translateX(${transformX}px)`;
                  }
                  const cellProps = cell.getCellProps({
                    className: clsx(classList),
                    style: cellStyle,
                  });
                  ensureEvenWidth(cellProps);
                  const customStyles = getCustomCellStyles ? getCustomCellStyles(cell.column, row, cell) : {};
                  return (
                    <td
                      className={clsx(
                        cell.column.isResizing ? 'isResizing' : '',
                        cell.column['enableColumnResize'] ? 'columnResizable' : '',
                        cell.column['className'] ?? '',
                      )}
                      {...cellProps}
                      key={cell?.column?.id}
                      style={{
                        ...cellProps.style,
                        ...customStyles,
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* This is needed to ensure the tbody has the correct height for scrolling */}
          <tr style={{ height: `${rowVirtualizer.getTotalSize()}px`, pointerEvents: 'none', visibility: 'hidden' }}>
            <td colSpan={100} />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: { indeterminate?: boolean }, ref: React.Ref<HTMLInputElement>) => {
    const defaultRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref || defaultRef) as React.RefObject<HTMLInputElement>;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [resolvedRef, indeterminate]);

    return (
      <div className="flex h-full items-center justify-center">
        <Checkbox type="checkbox" ref={resolvedRef} {...rest} />
      </div>
    );
  },
);

const ensureNotAllHidden = (columns: ColumnInstance<IColumnProps>[]) => {
  const allHidden = !columns.some((col) => col.isVisible);
  if (allHidden) columns[0].toggleHidden();
};

const ensureEvenWidth = (props: TableCellProps | TableHeaderProps) => {
  if (props.style.width && !props.style.minWidth) props.style.minWidth = props.style.width;
  if (props.style.width && !props.style.maxWidth) props.style.maxWidth = props.style.width;
};

// Helper to get paginated rows for top-level only
function getPaginatedRows(rows, pageIndex, pageSize) {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginated = rows.slice(start, end);

  const flattenedRows = [];
  paginated.forEach((row) => {
    flattenedRows.push(row);
    if (row.isExpanded) {
      row.subRows.forEach((subRow) => flattenedRows.push(subRow));
    }
  });

  return flattenedRows;
}

const tableManagerColStyle = {
  width: TABLE_MANAGER_WIDTH.toString() + 'px',
  minWidth: TABLE_MANAGER_WIDTH.toString() + 'px',
};

const StyledTable = styled.div<any>`
  overflow-x: scroll;
  position: relative;
  scrollbar-width: thin;

  .sticky {
    position: ${(props) => (props.enableSticky ? 'relative' : 'initial')} !important;
    left: 0;
    top: 0;
    background-color: white;
    z-index: 1230;
  }
  .alwaysSticky {
    position: sticky;
    left: 0;
    top: 0;
  }

  table {
    margin: 0;
    border-spacing: 0;
    border-collapse: collapse;
    text-align: right;
    position: relative;
    width: 100%;

    th {
      padding: 0.25rem 1rem;
      min-height: 20px;
      color: ${nexyColors.raisinBlack};
      align-items: center;
      border-width: 0 0px 1px 0;
      border-style: solid;
      border-color: rgb(42 42 50 / 8%);

      font-size: 11px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 12px */
      letter-spacing: 0.24px;
      width: 100%;

      :first-child {
        padding: 0;
      }

      :last-child {
        border-width: 0 0 1px 0;
      }
      position: relative;
      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action: none;
        user-select: none;

        &:hover {
          background: ${colorByKey('lavender')};
        }

        &.isResizing {
          width: 4px;
          background: ${colorByKey('purpleish')};
        }
      }
    }

    tr {
      align-items: stretch;
      min-height: 20px;

      border-width: 0 0 1px 0;
      border-style: solid;
      border-color: rgb(42 42 50 / 8%);
      width: 100%;

      :last-child {
        border-width: 0;
      }
    }

    td {
      margin: 0;
      padding: 0.5rem 0.75rem;
      align-items: center;
      min-height: 20px;
      border-width: 0;
      overflow-wrap: break-word;
      overflow: hidden !important;
      width: 100%;

      :first-child {
        border-width: 0;
      }
      :last-child {
        border-width: 0;
      }
    }

    .highlight {
      background-color: ${nexyColors.seasalt} !important;
    }

    .lightHighlight {
      background-color: ${nexyColors.ghostWhite} !important;
    }

    .isResizing {
      border-color: ${colorByKey('purpleish')};
      border-right-width: 2px;
    }
  }
`;
