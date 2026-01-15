export interface IColumnProps {
  highlight?: boolean;
  sortType?: string;
}

declare module 'react-table' {
  // @ts-ignore
  export interface ColumnInstance<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseResizeColumnsColumnProps<D>,
      UseSortByOptions<D>,
      UseSortByColumnProps<D> {}
}
