import { RangeModifier } from 'react-day-picker/types/Modifiers';

import dayjs, { ConfigType } from 'dayjs';
import en from 'dayjs/locale/en';
import utc from 'dayjs/plugin/utc';
import { DateParam } from 'use-query-params';

import { DayjsObj, NexoyaDailyMetric } from '../types';

import { DateSelectorProps } from '../components/DateSelector';

dayjs.locale({ ...en, weekStart: 1 });
dayjs.extend(utc);

export const UTC_TIMEZONE = 'T00:00:00.000Z';

const djsToday = dayjs();

export const GLOBAL_DATE_FORMAT = 'YYYY-MM-DD';
export const READABLE_FORMAT = 'D MMM YYYY';
export const PORTFOLIO_FORMAT = 'DD MMM YYYY';
export const DATE_SELECTOR_DEFAULT_FORMAT = 'D MMM';
export const DATE_SELECTOR_YEARLY_DEFAULT_FORMAT = 'D MMM YYYY';
export const CHART_TOOLTIP_DATE_FORMAT = 'ddd DD MMM, YYYY';

export const djsAnchors: Record<string, DayjsObj> = {
  today: djsToday,
  yesterday: djsToday.subtract(1, 'day'),
  twoWeeksFuture: djsToday.add(2, 'week'),
  startOf7DaysAgo: djsToday.subtract(7, 'day').startOf('day'),
  startOf3MonthsAgo: djsToday.subtract(3, 'month').endOf('day'),
  endOfLastWeek: djsToday.subtract(1, 'week').endOf('week'),
  endOfLastMonth: djsToday.subtract(1, 'month').endOf('month'),
  endOfLastYear: djsToday.subtract(1, 'year').endOf('year'),
};

// Used to make sure we are receiving a valid date to use.
function validateAndGetDjs(date: string | Date | DayjsObj, isUtc = false) {
  let djsDate: dayjs.Dayjs;
  if (isUtc) djsDate = dayjs.utc(date);
  else djsDate = dayjs(date);

  if (!djsDate.isValid()) {
    throw new Error(`checkValidDate: provided value is not a valid date (${date?.toString()})`);
  }

  return djsDate;
}

// Used to make sure we are using a "Date" object and not a string
// or other types
export function ensureDate(date: string | Date | DayjsObj): Date {
  const djs = validateAndGetDjs(date);
  return djs.toDate();
}
// Comment:
// This is used in case we want to first check if the
// first argument is acceptable for us to use
// with the "firstARgIsSafeCheck" function which returns boolean
// If it's not safe, we go to fallback.
// This is used for checking if yesterday falls outside of this week (reporting)
// export function firstOr(
//   maybeDate: Date,
//   fallback: Date,
//   firstArgIsSafeCheck: (first: Date, second: Date) => boolean
// ): Date {
//   return firstArgIsSafeCheck(maybeDate, fallback) ? maybeDate : fallback;
// }
// Used to check if it is the same 'day, week, month, year'.
export function isSame(
  toCheckDate: string | Date | DayjsObj,
  anchor: string | Date | DayjsObj,
  type: 'day' | 'week' | 'month' | 'year' = 'day',
  isUtc = false,
): boolean {
  const djsToCheck = validateAndGetDjs(toCheckDate, isUtc);
  const djsAnchor = validateAndGetDjs(anchor, isUtc);
  return djsToCheck.isSame(djsAnchor, type);
}
// Used to check if the first provided day is earlier
// then the next date. It ignores time of the day. It always
// uses the start of the day as the anchor to check.
export function isEarlierDay(dateToCheck: string | Date | DayjsObj, anchor: string | Date | DayjsObj): boolean {
  const djsAnchor = validateAndGetDjs(anchor);
  const djsToCheck = validateAndGetDjs(dateToCheck);
  return djsToCheck.startOf('day') < djsAnchor.startOf('day');
}
// Used to check if the first provided day is later
// than the next date. It ignores time of the day. It always
// uses the start of the day as the anchor to check.
export function isLaterDay(dateToCheck: string | Date | DayjsObj, anchor: string | Date | DayjsObj): boolean {
  const djsAnchor = validateAndGetDjs(anchor);
  const djsToCheck = validateAndGetDjs(dateToCheck);
  return djsToCheck.startOf('day') > djsAnchor.startOf('day');
}
export function isToday(dateToCheck: ConfigType): boolean {
  return djsAnchors.today.startOf('day').isSame(dayjs(dateToCheck).startOf('day'));
}
export function isYesterday(dateToCheck: ConfigType): boolean {
  return djsAnchors.today.subtract(1, 'day').startOf('day').isSame(dayjs(dateToCheck).startOf('day'));
}
export function isInTheFuture(dateToCheck: ConfigType): boolean {
  return dayjs(dateToCheck).startOf('day').isAfter(dayjs().startOf('day'));
}
// Used to check and get the earlier date from two provided.
// It is ignores the time of the day and always returns JS Date
export function getEarlierDay(dateToCheck: string | Date | DayjsObj, anchor: string | Date | DayjsObj): Date {
  const djsAnchor = validateAndGetDjs(anchor);
  const djsToCheck = validateAndGetDjs(dateToCheck);
  return isEarlierDay(djsToCheck, djsAnchor) ? djsToCheck.toDate() : djsAnchor.toDate();
}
// Used to check and get the later date from two provided.
// It is ignores the time of the day and always returns JS Date
export function getLaterDay(dateToCheck: string | Date | DayjsObj, anchor: string | Date | DayjsObj) {
  const djsAnchor = validateAndGetDjs(anchor);
  const djsToCheck = validateAndGetDjs(dateToCheck);
  return isLaterDay(djsToCheck, djsAnchor) ? djsToCheck.toDate() : djsAnchor.toDate();
}
// Use to stringify the date into a format that "use-query-params" uses
// internally for the url params. If returned null we ignore the param
// otherwise let the package dictate the format
export function encodeDateQuery(date?: ConfigType): string[] | null {
  const djsDate = dayjs(date);

  if (!djsDate.isValid()) {
    return null;
  }

  /* @ts-ignore */
  return DateParam.encode(djsDate.toDate());
}
// Used to count the number of 'days, weeks, months...'
// between two different dates.
export function diffCount(
  anchor: string | Date | DayjsObj,
  dateToCheck: string | Date | DayjsObj,
  type: 'day' | 'week' | 'month' | 'year' = 'day',
): number {
  const djsAnchor = validateAndGetDjs(anchor);
  const djsToCheck = validateAndGetDjs(dateToCheck);
  return Math.abs(djsAnchor.startOf(type).diff(djsToCheck.startOf(type), type));
}
// Used to format the timestamp. Either for display in the UI
// or for including the date in the URL as a param or sending
// it over graphql request
export function format(date: string | Date | DayjsObj = new Date(), format = 'DD-MM-YYYY', isUtc = false): string {
  const djsDate = validateAndGetDjs(date, isUtc);

  switch (format) {
    case 'utcWithTime':
      return djsDate.utc().format();

    case 'utcStartMidnight':
      return `${djsDate.format('YYYY-MM-DD').substr(0, 10)}T00:00:00.000Z`;

    case 'utcEndMidnight':
      return `${djsDate.format('YYYY-MM-DD').substr(0, 10)}T23:59:59.999Z`;

    case 'utcMidday':
      return `${djsDate.format('YYYY-MM-DD').substr(0, 10)}T12:00:00.000Z`;

    case 'utc':
      return `${djsDate.format('YYYY-MM-DD').substr(0, 10)}T00:00:00.000Z`;

    case 'utcInterval':
      return `${djsDate.toJSON().substr(0, 15)}0:00.000Z`;

    case 'portfolio':
      const dateString = dayjs(date).utc()?.toISOString().substr(0, 10);
      const formattedDate = new Date(dateString);
      const djsDate1 = validateAndGetDjs(formattedDate);
      return `${djsDate1.format(PORTFOLIO_FORMAT)}`;

    default:
      return djsDate.format(format);
  }
}
type Options = {
  distance?: number;
  anchor?: string | Date | DayjsObj;
  future?: boolean;
  type?: 'day' | 'week' | 'month' | 'year';
  startOf?: 'day' | 'week' | 'month' | 'year' | boolean;
  endOf?: 'day' | 'week' | 'month' | 'year' | boolean;
  anchorDayInclusive?: boolean;
  modifier?: (
    from: ConfigType,
    to: ConfigType,
  ) => {
    from: ConfigType;
    to: ConfigType;
  };
};
// Used to create a date range from one anchor and with specified
// distance from the anchor. This is mainly used for creating a
// dynamic date range like we do in reports (last 7 days, last month...)
export function distanceRange({
  distance = 0,
  type = 'day',
  anchor = djsAnchors.today,
  future = false,
  startOf = true,
  endOf = true,
  anchorDayInclusive = true,
  modifier = null,
}: Options): {
  dateFrom: Date;
  dateTo: Date;
} {
  const djsAnchor = validateAndGetDjs(anchor);
  // Comment: In case we want to include the anchor date into the
  // full distance of the range, we need to remove one day.
  const nextDistance = anchorDayInclusive ? Math.max(distance - 1, 0) : distance;
  const djsDistance = future ? djsAnchor.add(nextDistance, type) : djsAnchor.subtract(nextDistance, type);
  let from: ConfigType = future ? djsAnchor : djsDistance;
  let to: ConfigType = future ? djsDistance : djsAnchor;

  if (startOf) {
    const applyType = typeof startOf === 'string' ? startOf : type;
    from = from.startOf(applyType);
  }

  if (endOf) {
    const applyType = typeof endOf === 'string' ? endOf : type;
    to = to.endOf(applyType);
  }

  // Comment:
  // In case we want to do some modification before we return the final
  // result, we apply it here. We are expecting to keep working with "dayjs"
  // objects.
  if (modifier) {
    const modified = modifier(from, to);
    (from as any) = modified.from;
    (to as any) = modified.to;
  }

  return {
    dateFrom: (from as any).toDate(),
    dateTo: (to as any).toDate(),
  };
}

export const getFormattedDateSelector = (dateSelectorProps: Partial<DateSelectorProps>, numberFormat: string) =>
  `${dateSelectorProps.dateFrom.toLocaleDateString(numberFormat ?? 'de-CH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} - ${dateSelectorProps.dateTo.toLocaleDateString(numberFormat ?? 'de-CH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'utc',
  })}`;

// Function to check if a date is within any of the disabled ranges
export const isDateWithinDisabledRanges = (date: Date, disabledRanges: RangeModifier[]) => {
  return disabledRanges.some((range) => {
    if (!range.from || !range.to) {
      return false;
    }
    return dayjs(date).isBetween(dayjs(range.from), dayjs(range.to), 'day', '[]');
  });
};

/**
 * Function to get the relative time string from a date
 * e.g. "2d ago", "3w ago"
 */
export function getRelativeTimeString(date: Date) {
  const now = new Date();
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / (60 * 60));
  const days = Math.floor(diffInSeconds / (60 * 60 * 24));
  const weeks = Math.floor(diffInSeconds / (60 * 60 * 24 * 7));
  const months = Math.floor(diffInSeconds / (60 * 60 * 24 * 30));
  const years = Math.floor(diffInSeconds / (60 * 60 * 24 * 365));

  if (years >= 1) {
    return `${Math.abs(years)}y ago`;
  } else if (months >= 1) {
    return `${Math.abs(months)}m ago`;
  } else if (weeks >= 1) {
    return `${Math.abs(weeks)}w ago`;
  } else if (days >= 1) {
    return `${Math.abs(days)}d ago`;
  } else if (hours >= 1) {
    return `${Math.abs(hours)}h ago`;
  } else if (minutes >= 1) {
    return `${Math.abs(minutes)}m ago`;
  } else {
    return `${Math.abs(Math.floor(diffInSeconds))}s ago`;
  }
}

export function fillMissingDays(dailyMetrics: NexoyaDailyMetric[]) {
  // Find first non-null day
  const firstNonNullIndex = dailyMetrics.findIndex((item) => item.day !== null);

  // Fill backwards
  for (let i = firstNonNullIndex - 1; i >= 0; i--) {
    const nextDate = dayjs(dailyMetrics[i + 1].day)
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    dailyMetrics[i] = {
      ...dailyMetrics[i],
      day: nextDate,
    };
  }

  // Fill forwards
  for (let i = firstNonNullIndex + 1; i < dailyMetrics.length; i++) {
    if (dailyMetrics[i].day === null) {
      const prevDate = dayjs(dailyMetrics[i - 1].day)
        .add(1, 'day')
        .format('YYYY-MM-DD');
      dailyMetrics[i] = {
        ...dailyMetrics[i],
        day: prevDate,
      };
    }
  }

  return dailyMetrics;
}
