import { RangeTypes } from '../types/types.custom';

import { distanceRange, djsAnchors, isEarlierDay } from '../utils/dates';

interface DaysRanges {
  key: RangeTypes;
  label: string;
  range:
    | {
        dateFrom: Date;
        dateTo: Date;
      }
    | {};
}
export const DAYS_RANGES: DaysRanges[] = [
  {
    key: '7days',
    label: 'Last 7 days',
    range: distanceRange({
      distance: 7,
      anchor: djsAnchors.yesterday,
      type: 'day',
    }),
  },
  {
    key: '30days',
    label: 'Last 30 days',
    range: distanceRange({
      distance: 30,
      anchor: djsAnchors.yesterday,
      type: 'day',
    }),
  },
  {
    key: '90days',
    label: 'Last 90 days',
    range: distanceRange({
      distance: 90,
      anchor: djsAnchors.yesterday,
      type: 'day',
    }),
  },
];

// Comment:
// This is meant to check a specific use case where yesterday turns
// out to be outside of the "currentWeek" date range.
// Yesterday would be Sunday in such case. If so, we make sure
// we set the "from" and "to" as today
function safeCurrentRange(type: 'week' | 'month' | 'year') {
  return (from, to) => {
    const outsideOfCurrent = isEarlierDay(to, djsAnchors.today.startOf(type));
    return {
      from: outsideOfCurrent ? djsAnchors.today : from,
      to: outsideOfCurrent ? djsAnchors.today : to,
    };
  };
}

export const CURRENT_RANGES: DaysRanges[] = [
  {
    key: 'currentWeek',
    label: 'Current week',
    range: distanceRange({
      anchor: djsAnchors.yesterday,
      type: 'week',
      endOf: 'day',
      modifier: safeCurrentRange('week'),
    }),
  },
  {
    key: 'currentMonth',
    label: 'Current month',
    range: distanceRange({
      anchor: djsAnchors.yesterday,
      type: 'month',
      endOf: 'day',
      modifier: safeCurrentRange('month'),
    }),
  },
  {
    key: 'currentYear',
    label: 'Current year',
    range: distanceRange({
      anchor: djsAnchors.yesterday,
      type: 'year',
      endOf: 'day',
      modifier: safeCurrentRange('year'),
    }),
  },
];
export const LAST_RANGES: DaysRanges[] = [
  {
    key: 'lastWeek',
    label: 'Last week',
    range: distanceRange({
      anchor: djsAnchors.endOfLastWeek,
      startOf: 'week',
      endOf: 'week',
    }),
  },
  {
    key: 'lastMonth',
    label: 'Last month',
    range: distanceRange({
      anchor: djsAnchors.endOfLastMonth,
      startOf: 'month',
      endOf: 'month',
    }),
  },
  {
    key: 'lastYear',
    label: 'Last year',
    range: distanceRange({
      anchor: djsAnchors.endOfLastYear,
      startOf: 'year',
      endOf: 'year',
    }),
  },
];
export const FIXED_RANGES: DaysRanges[] = [
  {
    key: 'custom',
    label: 'Fixed',
    range: {},
  },
];
export function dateRanges() {
  return [...DAYS_RANGES, ...CURRENT_RANGES, ...LAST_RANGES, ...FIXED_RANGES];
}
export function findRange(type: RangeTypes): any {
  return dateRanges().find((f) => f.key === type);
}
