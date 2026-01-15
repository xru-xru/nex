import dayjs from 'dayjs';

import { NexoyaMetadata } from 'types';
import { BrickDataFormatted } from 'types/types.custom';

import dataTypes from 'constants/metadataTypes';

import { format } from 'utils/dates';
import { round } from 'utils/number';
import { capitalizeWords } from 'utils/string';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useCurrencyStore } from 'store/currency-selection';

dayjs.extend(customParseFormat);

export default function useFormatMetadata(data: NexoyaMetadata[] = []): Map<string, BrickDataFormatted> {
  const formattedData = data.reduce(
    (acc, curr) => [...acc, ...(curr.metadata_type ? [{ ...curr, ...dataTypes[curr.metadata_type] }] : [])],
    [] as NexoyaMetadata[],
  );

  const { numberFormat } = useCurrencyStore();

  function getValues(type: string, value: string | number): string {
    switch (type) {
      case 'date':
        return typeof value === 'string' ? format(value.substring(0, 10), 'DD MMM YYYY') : '';
      case 'double':
        return new Intl.NumberFormat(numberFormat, {}).format(round(+value));
      case 'string':
        return typeof value === 'string' ? capitalizeWords(value, '_') : '';
      case 'id':
        return value.toString();
      default:
        return value.toString();
    }
  }

  return formattedData
    .filter((metadata) => metadata.metadata_type)
    .reduce((acc, curr) => {
      acc.set(curr.metadata_type, {
        title: capitalizeWords(curr.metadata_type, '_'),
        value: getValues(curr.value_type, curr.value_lookup || curr.value),
      });
      return acc;
    }, new Map<string, BrickDataFormatted>());
}
