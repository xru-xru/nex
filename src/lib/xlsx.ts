import { Datatype } from '../utils/datatype';
import { datatypeValue } from '../utils/datatype';

export type XLSXColumn = {
  value: string | number;
  type: 'string';
};
export function row(...args: Record<string, any>[]): Record<string, any>[] {
  return [...args];
}
export function col(value: string | number): XLSXColumn {
  return {
    value,
    type: 'string',
  };
}
export function colDatatypeValue(colValue: number, datatype: Datatype): XLSXColumn {
  const value = typeof colValue === 'number' ? datatypeValue(colValue, datatype) : '--';
  return col(value);
}
