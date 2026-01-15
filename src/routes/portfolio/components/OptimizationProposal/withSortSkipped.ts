import { Row } from 'react-table';

type ISortFn = (rowA: any, rowB: any, columnId: string, isDesc: boolean) => number;

export const withSortSkipped = (sortFn: ISortFn) => {
  const sortSkipped = (rowA: Row, rowB: Row, columnId: string, isDesc: boolean) => {
    //@ts-ignore
    const getSortGroup = (row: Row): string => row.original.sortGroup || 0;
    if (getSortGroup(rowA) === getSortGroup(rowB)) return sortFn(rowA, rowB, columnId, isDesc);

    if (getSortGroup(rowA) > getSortGroup(rowB)) return isDesc ? -1 : 1;
    return isDesc ? 1 : -1;
  };

  return sortSkipped;
};
