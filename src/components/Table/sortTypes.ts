import { Row } from 'react-table';

const moneyToString = (str: string) => str.replace(/\D/g, '');
const sortMoney = (rowA: Row, rowB: Row, columnId: string) =>
  Number(moneyToString(rowA.original[columnId] ?? '')) >= Number(moneyToString(rowB.original[columnId] ?? '')) ? 1 : -1;

const getJsxKey = (row: Row, columnId: string) => row.original?.[columnId]?.key;
const sortJsxKey = (rowA: Row, rowB: Row, columnId: string) =>
  getJsxKey(rowA, columnId) > getJsxKey(rowB, columnId) ? 1 : -1;
const sortJsxKeyNumber = (rowA: Row, rowB: Row, columnId: string) =>
  Number(getJsxKey(rowA, columnId)) > Number(getJsxKey(rowB, columnId)) ? 1 : -1;

// Factory function to create a sorting function that uses a specific accessor
const createSortByAccessor = (accessor: string) => (rowA: Row, rowB: Row) => {
  const a = rowA.original[accessor]?.key;
  const b = rowB.original[accessor]?.key;

  if (a === undefined || b === undefined) return 0;
  return Number(a) < Number(b) ? 1 : -1;
};

export const sortTypes = {
  money: sortMoney,
  jsxKey: sortJsxKey,
  jsxKeyAsNumber: sortJsxKeyNumber,
  createSortByAccessor,
};
