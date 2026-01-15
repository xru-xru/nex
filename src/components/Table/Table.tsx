import React, { useMemo, useState } from 'react';
import {
  Cell,
  ColumnInstance,
  HeaderGroup,
  TableCellProps,
  TableHeaderProps,
  TableOptions,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
  useTable,
} from 'react-table';

import clsx from 'clsx';
import styled from 'styled-components';

import SvgSort from 'components/icons/Sort';

import { colorByKey } from 'theme/utils';

import { ButtonSortStyled } from './ButtonSortStyled';
import { Row } from './Row';
import { TableManager } from './TableManager';
import { getHiddenColumns } from './cacheHiddenColumns';
import { sortTypes } from './sortTypes';
import { IColumnProps } from './tableTypes';

export const classes = {
  header: 'NEXYTableHeader',
  row: 'NEXYTableRow',
};

/**
 * @param data In addition to normal keys, special key 'highlight' can be used to add highligh to a row.
 * @param columns In addition to normal keys:
 *  'highlight' adds a gray background color to a cloumn
 *  'isHiddenInManager' hides the column in the table manager
 *  'disableSortBy' disables sorting and hides the sort SVG
 */
interface Props<D extends object = {}> extends TableOptions<D> {
  disableManager?: boolean;
  disableSort?: boolean;
  tableId?: string;
}
export const Table: React.FC<Props> = ({ columns, data, disableManager, disableSort, tableId }) => {
  const hooks: any[] = [useBlockLayout, useResizeColumns];
  if (!disableSort) hooks.push(useSortBy);
  const initialHiddenColumns = useMemo<string[]>(() => getHiddenColumns(tableId), [tableId]);
  const [sortState, setSortState] = useState([]); // Preserve sort state even when data changes
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
    toggleHideAllColumns,
  } = useTable(
    {
      columns,
      data,
      sortTypes,
      initialState: {
        hiddenColumns: initialHiddenColumns,
        // @ts-ignore
        sortBy: sortState,
      },
      stateReducer: (newState, action) => {
        // @ts-ignore
        if (action.type === 'toggleSortBy') setSortState(newState.sortBy);
        return newState;
      },
    },
    ...hooks,
  );

  ensureNotAllHidden(allColumns);
  const tableManagerWidth = 32;
  const tableManagerColStyle = {
    width: tableManagerWidth.toString() + 'px',
    minWidth: tableManagerWidth.toString() + 'px',
  };

  const [stickyColumns, setStickyColumns] = React.useState([]);
  const getStylingByHeader = (header: HeaderGroup<IColumnProps>, target: 'cell' | 'header') => {
    const isSticky = stickyColumns.includes(header.id);
    if (isSticky) {
      const headers = headerGroups.flatMap((headerGroup) => headerGroup.headers);
      const ownIndex = headers.indexOf(header);
      const stickyLeft = headers
        .slice(0, ownIndex)
        .filter((header) => stickyColumns.includes(header.id))
        .map((header) => header.totalWidth)
        .reduce((partialSum, a) => partialSum + a, 0);
      return {
        className: target === 'header' ? 'alwaysSticky' : 'sticky',
        style: {
          left: (stickyLeft + tableManagerWidth).toString() + 'px',
        },
      };
    }
    return {};
  };
  const getCellStyling = (cell: Cell<IColumnProps>) => {
    const headers = headerGroups.flatMap((headerGroup) => headerGroup.headers);
    const header = headers.find((header) => header.id === cell.column.id);
    return getStylingByHeader(header, 'cell');
  };

  const getOriginalColumn = (id: string) => columns.find((col) => col.accessor === id);

  const [enableSticky] = React.useState(true);
  const isFirst = (index: number) => index === 0;
  return (
    <Styles enableSticky={enableSticky}>
      <table {...getTableProps()}>
        <thead className={classes.header}>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {!disableManager && isFirst(index) ? (
                <th className="alwaysSticky" style={{ ...tableManagerColStyle, zIndex: 100 }}>
                  <TableManager
                    columns={allColumns}
                    getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
                    toggleHideAllColumns={toggleHideAllColumns}
                    setStickyColumns={setStickyColumns}
                    stickyColumns={stickyColumns}
                  />
                </th>
              ) : null}
              {headerGroup.headers.map((column) => {
                const withSortProps = disableSort
                  ? getStylingByHeader(column, 'header')
                  : column.getSortByToggleProps(getStylingByHeader(column, 'header'));
                const headerProps = column.getHeaderProps();
                ensureEvenWidth(headerProps);
                return (
                  <th {...headerProps} key={column['id']}>
                    {column['enableColumnResize'] ? (
                      <div
                        title={`Resize ${column.Header} column`}
                        {...column.getResizerProps()}
                        className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                      />
                    ) : null}
                    <Row {...withSortProps} style={{ height: '100%' }}>
                      {column.render('Header')}{' '}
                      {column['disableSortBy'] ? null : (
                        <ButtonSortStyled
                          style={{ justifySelf: 'start', position: 'static' }}
                          asc={column['isSorted'] ? !column['isSortedDesc'] : null}
                          desc={column['isSortedDesc']}
                        >
                          <SvgSort />
                        </ButtonSortStyled>
                      )}
                    </Row>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            let rowClassList = [classes.row];
            if (row.original?.['highlight']) rowClassList.push('highlight');
            if (row.original['classList']) rowClassList = [...rowClassList, ...row.original['classList']];
            prepareRow(row);
            return (
              <tr className={clsx(rowClassList)} {...row.getRowProps()} key={row?.id}>
                {disableManager ? null : (
                  <td
                    className={clsx(['sticky', row.original?.['highlight'] ? 'highlight' : null])}
                    style={tableManagerColStyle}
                  />
                )}
                {row.cells.map((cell) => {
                  const originalColumn = getOriginalColumn(cell.column.id);
                  const classList = [];
                  if (originalColumn?.['highlight'] || row.original?.['highlight']) classList.push('highlight');
                  const styling = getCellStyling(cell);
                  if (styling.className) classList.push(styling.className);
                  const cellProps = cell.getCellProps({
                    className: clsx(classList),
                    style: styling.style,
                  });
                  ensureEvenWidth(cellProps);
                  return (
                    <td
                      className={clsx(
                        cell.column.isResizing ? 'isResizing' : '',
                        cell.column['enableColumnResize'] ? 'columnResizable' : '',
                      )}
                      {...cellProps}
                      key={cell?.column?.id}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Styles>
  );
};

const ensureNotAllHidden = (columns: ColumnInstance<IColumnProps>[]) => {
  const allHidden = !columns.some((col) => col.isVisible);
  if (allHidden) columns[0].toggleHidden();
};

const ensureEvenWidth = (props: TableCellProps | TableHeaderProps) => {
  if (props.style.width && !props.style.minWidth) props.style.minWidth = props.style.width;
  if (props.style.width && !props.style.maxWidth) props.style.maxWidth = props.style.width;
};

const Styles = styled.div<any>`
  overflow: scroll;
  max-height: 100%;
  height: 100%;

  .sticky {
    position: ${(props) => (props.enableSticky ? 'sticky' : 'initial')};
    left: 0;
    top: 0;
    background-color: white;
  }
  .alwaysSticky {
    position: sticky;
    left: 0;
    top: 0;
    background-color: white;
  }

  table {
    margin: 0;
    border-spacing: 0;
    border-collapse: collapse;
    text-align: right;

    th {
      padding: 12px 1rem;
      min-height: 20px;
      text-transform: uppercase;
      color: ${colorByKey('neutral700')};
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 15.4px */
      letter-spacing: 0.44px;
      font-size: 12px;
      align-items: center;
      border-width: 0 0 1px 0;
      border-style: solid;
      border-color: #eaeaea;

      :nth-child(2) {
        div {
          text-align: left;
          align-items: flex-start;
          justify-content: flex-start;
        }
      }

      position: relative;
      .resizer {
        display: inline-block;
        width: 2px;
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
          width: 2px;
          background: ${colorByKey('purpleish')};
        }
      }
    }

    tr {
      align-items: stretch;
      min-height: 20px;

      border-width: 0 0 1px 0;
      border-style: solid;
      border-color: #eaeaea;

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
      border-style: solid;
      border-color: #eaeaea;
      overflow-wrap: break-word;
      overflow: hidden;

      :first-child {
        border-width: 0;
      }
      :last-child {
        border-width: 0;
      }
    }

    .highlight {
      background-color: #f8f8f9 !important;
    }

    .isResizing {
      border-color: ${colorByKey('purpleish')};
      border-right-width: 2px;
    }
  }
`;
