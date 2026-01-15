export type Datatype = {
  suffix: boolean;
  symbol: string;
};
export const percentDatatype = {
  suffix: true,
  symbol: '%',
};
export function datatypeValue(value: string | number, datatype: Datatype): string {
  const { suffix, symbol } = datatype;
  return `${!suffix ? symbol : ''} ${value} ${suffix ? symbol : ''}`;
}
