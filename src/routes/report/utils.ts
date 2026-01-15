import { get } from 'lodash';

import { NexoyaReportDateRange } from '../../types/types';

import { ensureDate } from '../../utils/dates';
import { removeProperties } from '../../utils/object';

// We need to make sure we are converting date "strings" coming from gql
// into a proper "Date" object we can work with in the date picker.
// Also we need to remove the "__typename" that gql sticks in
export function checkAndConvertDates(dateRange: NexoyaReportDateRange): NexoyaReportDateRange {
  //@ts-expect-error
  const nextDateRange: NexoyaReportDateRange = removeProperties(dateRange, '__typename');

  if (dateRange.rangeType !== 'custom') {
    return nextDateRange;
  }

  let dateFrom = get(nextDateRange, 'customRange.dateFrom', '');

  // when util is invoked with typeof string, it is coming from backend
  // we need to make sure Date() constructor returns Date object on the same
  // day in utc timezone
  if (typeof dateFrom === 'string') {
    dateFrom = dateFrom.substring(0, 10);
  }

  let dateTo = get(nextDateRange, 'customRange.dateTo', '');

  if (typeof dateTo === 'string') {
    dateTo = dateTo.substring(0, 10);
  }

  return {
    ...nextDateRange,
    customRange: {
      dateFrom: ensureDate(dateFrom || new Date()),
      dateTo: ensureDate(dateTo || new Date()),
    },
  };
}
