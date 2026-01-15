// TODO: Add proper checks
// Current check based on https://gitlab.com/nexoya/core-graphql/-/blob/develop/tables/datatype.json
const CURRENCY_LABELS = ['{datatype:currency.label}'];
const CURRENCY_SYMBOL = ['$', 'CHF'];
export default function isCurrencyDatatype(datatype: any = {}): boolean {
  // in case datatype is null
  if (!datatype) return false;
  return CURRENCY_LABELS.includes(datatype.label) || CURRENCY_SYMBOL.includes(datatype.symbol);
}
