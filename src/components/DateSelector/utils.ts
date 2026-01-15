import dayjs from 'dayjs';

import { DateRange } from '../../context/DateProvider';

const getWeekToDate = (): DateRange => {
  return {
    from: dayjs().startOf('week').startOf('day').toDate(),
    to: dayjs().endOf('day').toDate(),
  };
};
export const getWeekToYesterday = (): DateRange => {
  return {
    from: dayjs().startOf('week').startOf('day').toDate(),
    to: dayjs().subtract(1, 'day').endOf('day').toDate(),
  };
};
const getThisMonth = (): DateRange => {
  return {
    from: dayjs().startOf('month').startOf('day').toDate(),
    to: dayjs().endOf('month').toDate(),
  };
};
const getThisWeek = (): DateRange => {
  return {
    from: dayjs().startOf('week').startOf('day').toDate(),
    to: dayjs().endOf('week').toDate(),
  };
};
const getThisYear = (): DateRange => {
  return {
    from: dayjs().startOf('year').startOf('day').toDate(),
    to: dayjs().endOf('year').toDate(),
  };
};
const getMonthToDate = (): DateRange => {
  return {
    from: dayjs().startOf('month').startOf('day').toDate(),
    to: dayjs().endOf('day').toDate(),
  };
};
export const getMonthToYesterday = (): DateRange => {
  return {
    from: dayjs().startOf('month').startOf('day').toDate(),
    to: dayjs().subtract(1, 'day').endOf('day').toDate(),
  };
};
const getYearToDate = (): DateRange => {
  return {
    from: dayjs().startOf('year').startOf('day').toDate(),
    to: dayjs().endOf('day').toDate(),
  };
};
export const getYearToYesterday = (): DateRange => {
  return {
    from: dayjs().startOf('year').startOf('day').toDate(),
    to: dayjs().subtract(1, 'day').endOf('day').toDate(),
  };
};
const getLastYearRange = (): DateRange => {
  return {
    from: dayjs().subtract(1, 'year').startOf('year').toDate(),
    to: dayjs().subtract(1, 'year').endOf('year').toDate(),
  };
};
const getLastThreeMonthsRange = (): DateRange => {
  return {
    from: dayjs().subtract(90, 'day').startOf('day').toDate(),
    to: dayjs().subtract(1, 'day').endOf('day').toDate(),
  };
};
const getLast30Days = (): DateRange => {
  return {
    from: dayjs().subtract(30, 'day').startOf('day').toDate(),
    to: dayjs().subtract(1, 'day').endOf('day').toDate(),
  };
};
const getLastMonthRange = (): DateRange => {
  return {
    from: dayjs().subtract(1, 'month').startOf('month').toDate(),
    to: dayjs().subtract(1, 'month').endOf('month').endOf('day').toDate(),
  };
};
const getLastWeekRange = (): DateRange => {
  return {
    from: dayjs().subtract(7, 'day').startOf('day').toDate(),
    to: dayjs().subtract(1, 'day').endOf('day').toDate(),
  };
};
const getNextWeekRange = (): DateRange => {
  return {
    from: dayjs().add(1, 'day').startOf('day').toDate(),
    to: dayjs().add(7, 'day').endOf('day').toDate(),
  };
};
const getNextMonthRange = (): DateRange => {
  return {
    from: dayjs().add(1, 'month').startOf('month').toDate(),
    to: dayjs().add(1, 'month').endOf('month').toDate(),
  };
};
const getNext8WeeksRange = (): DateRange => {
  return {
    from: dayjs().add(1, 'day').startOf('day').toDate(),
    to: dayjs().add(8, 'week').endOf('day').toDate(),
  };
};
const getNext3MonthsRange = (): DateRange => {
  return {
    from: dayjs().startOf('month').toDate(),
    to: dayjs().add(3, 'month').endOf('day').toDate(),
  };
};
const getNextYearRange = (): DateRange => {
  return {
    from: dayjs().add(1, 'year').startOf('year').toDate(),
    to: dayjs().add(1, 'year').endOf('year').toDate(),
  };
};

interface DateRangeOption {
  name: string;
  isPast: boolean;
  getDateRange: () => DateRange;
}
export type DateRangeOptions = Record<string, DateRangeOption>;
export const DATE_RANGES: DateRangeOptions = {
  lastWeek: {
    name: 'Last 7 days',
    isPast: true,
    getDateRange: getLastWeekRange,
  },
  last30Days: {
    name: 'Last 30 days',
    isPast: true,
    getDateRange: getLast30Days,
  },
  last90Days: {
    name: 'Last 90 days',
    isPast: true,
    getDateRange: getLastThreeMonthsRange,
  },
  lastMonth: {
    name: 'Last month',
    isPast: true,
    getDateRange: getLastMonthRange,
  },
  lastYear: {
    name: 'Last year',
    isPast: true,
    getDateRange: getLastYearRange,
  },
  thisMonth: {
    name: 'This month',
    isPast: false,
    getDateRange: getThisMonth,
  },
  thisWeek: {
    name: 'This week',
    isPast: false,
    getDateRange: getThisWeek,
  },
  thiYear: {
    name: 'This year',
    isPast: false,
    getDateRange: getThisYear,
  },
  weekToDate: {
    name: 'Week to date',
    isPast: true,
    getDateRange: getWeekToDate,
  },
  monthToDate: {
    name: 'Month to date',
    isPast: true,
    getDateRange: getMonthToDate,
  },
  yearToDate: {
    name: 'Year to date',
    isPast: true,
    getDateRange: getYearToDate,
  },
  nextWeek: {
    name: 'Next week',
    isPast: false,
    getDateRange: getNextWeekRange,
  },
  nextMonth: {
    name: 'Next month',
    isPast: false,
    getDateRange: getNextMonthRange,
  },
  next8Weeks: {
    name: 'Next 8 weeks',
    isPast: false,
    getDateRange: getNext8WeeksRange,
  },
  next3Months: {
    name: 'Next 3 months',
    isPast: false,
    getDateRange: getNext3MonthsRange,
  },
  nextYear: {
    name: 'Next year',
    isPast: false,
    getDateRange: getNextYearRange,
  },
};

export function convertLocalDateToUTCIgnoringTimezone(date: Date) {
  const timestamp = Date.UTC(
    date?.getFullYear(),
    date?.getMonth(),
    date?.getDate(),
    date?.getHours(),
    date?.getMinutes(),
    date?.getSeconds(),
    date?.getMilliseconds(),
  );

  return new Date(timestamp);
}
