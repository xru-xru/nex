import { get } from 'lodash';

import { NexoyaReportDateRange } from '../types/types';
import { UIDateRange } from '../types/types.custom';

import { findRange } from '../constants/report';
import { ensureDate } from '../utils/dates';

export function isCustom(rangeType: string): boolean {
  return rangeType === 'custom';
}
export function getUIDateRange({ rangeType, customRange }: NexoyaReportDateRange): UIDateRange {
  //@ts-expect-error
  const range = findRange(rangeType);

  if (isCustom(rangeType)) {
    let dateFrom = get(customRange, 'dateFrom', '');

    // when util is invoked with typeof string, it is coming from backend
    // we need to make sure Date() constructor returns Date object on the same
    // day in utc timezone
    if (typeof dateFrom === 'string') {
      dateFrom = dateFrom.substring(0, 10);
    }

    let dateTo = get(customRange, 'dateTo', '');

    if (typeof dateFrom === 'string') {
      dateTo = dateTo.substring(0, 10);
    }

    range.range = {
      dateFrom: ensureDate(dateFrom || new Date()),
      dateTo: ensureDate(dateTo || new Date()),
    };
  }

  return range;
}

// Used to translate the report type into a human preferred string
export function translateType(type: string) {
  switch (type) {
    case 'KPI':
      return 'Metric report';

    case 'CHANNEL':
      return ' Channel report';

    default:
      return 'Report';
  }
}
