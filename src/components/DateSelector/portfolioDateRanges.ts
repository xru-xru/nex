import dayjs from 'dayjs';

import { DateRange } from 'context/DateProvider';

import {
  DATE_RANGES,
  DateRangeOptions,
  getMonthToYesterday,
  getWeekToYesterday,
  getYearToYesterday,
} from 'components/DateSelector/utils';

export const getAllTimeRange = (portfolioStartDate: Date, portfolioEndDate: Date) => ({
  from: portfolioStartDate,
  to: portfolioEndDate,
});

const isDateRangeWithinPeriod = (dateRange: DateRange, startDate: Date, endDate: Date): boolean => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  return (
    dayjs(dateRange.from).isBetween(start, end, 'day', '[]') && dayjs(dateRange.to).isBetween(start, end, 'day', '[]')
  );
};

export const getPortfolioDateRanges = (portfolioStartDate: Date, portfolioEndDate: Date) => {
  const portfolioDateRanges: DateRangeOptions = {};
  const updatedDateRanges = {
    ...DATE_RANGES,
    weekToDate: {
      name: 'Week to date',
      isPast: true,
      getDateRange: getWeekToYesterday,
    },
    monthToDate: {
      name: 'Month to date',
      isPast: true,
      getDateRange: getMonthToYesterday,
    },
    yearToDate: {
      name: 'Year to date',
      isPast: true,
      getDateRange: getYearToYesterday,
    },
  };

  portfolioDateRanges.allTime = {
    name: 'All time',
    isPast: true,
    getDateRange: () => getAllTimeRange(portfolioStartDate, portfolioEndDate),
  };

  // Add "Last year" option if we're in a year when last year exists
  // (i.e., we're past Jan 1 of the current year)
  const lastYearStart = dayjs().subtract(1, 'year').startOf('year');
  const lastYearEnd = dayjs().subtract(1, 'year').endOf('year');

  if (dayjs().year() > lastYearStart.year()) {
    // @ts-ignore
    updatedDateRanges.lastYear = {
      name: 'Last year',
      isPast: true,
      getDateRange: () => {
        const portfolioStart = dayjs(portfolioStartDate);
        const portfolioEnd = dayjs(portfolioEndDate);
        return {
          from: (portfolioStart.isAfter(lastYearStart) ? portfolioStart : lastYearStart).toDate(),
          to: (portfolioEnd.isBefore(lastYearEnd) ? portfolioEnd : lastYearEnd).toDate(),
        };
      },
    };
  }

  Object.entries(updatedDateRanges).forEach(([key, value]) => {
    if (isDateRangeWithinPeriod(value.getDateRange(), portfolioStartDate, portfolioEndDate)) {
      portfolioDateRanges[key] = value;
    }
  });

  return portfolioDateRanges;
};

export const getPortfolioDateRangesForMeasurements = (portfolioStartDate: Date, portfolioEndDate: Date) => {
  // For measurements, cap the end date at yesterday if it's after today
  const yesterday = dayjs().subtract(1, 'day').toDate();
  const measurementEndDate = dayjs(portfolioEndDate).isAfter(dayjs()) ? yesterday : portfolioEndDate;

  const portfolioMeasurementDateRanges: DateRangeOptions = {
    lastWeek: DATE_RANGES.lastWeek,
    last30Days: DATE_RANGES.last30Days,
    last90Days: DATE_RANGES.last90Days,
    allTime: {
      name: 'All time',
      isPast: true,
      getDateRange: () => getAllTimeRange(portfolioStartDate, measurementEndDate),
    },
  };

  // Add "Last year" option if we're in a year where last year exists
  // (i.e., we're past Jan 1 of the current year)
  const lastYearStart = dayjs().subtract(1, 'year').startOf('year');
  const lastYearEnd = dayjs().subtract(1, 'year').endOf('year');

  if (dayjs().year() > lastYearStart.year()) {
    portfolioMeasurementDateRanges.lastYear = {
      name: 'Last year',
      isPast: true,
      getDateRange: () => {
        const portfolioStart = dayjs(portfolioStartDate);
        const measurementEnd = dayjs(measurementEndDate);
        return {
          from: (portfolioStart.isAfter(lastYearStart) ? portfolioStart : lastYearStart).toDate(),
          to: (measurementEnd.isBefore(lastYearEnd) ? measurementEnd : lastYearEnd).toDate(),
        };
      },
    };
  }

  return portfolioMeasurementDateRanges;
};

export const getCompareDateRanges = (start: Date, end: Date) => {
  // Convert dates to UTC to avoid DST issues
  const utcStart = dayjs(start).utc();
  const utcEnd = dayjs(end).utc();

  // Calculate difference in days
  const daysDifference = utcEnd.diff(utcStart, 'day', true);

  return {
    previousPeriod: {
      name: 'Previous period',
      isPast: true,
      getDateRange: () => ({
        from: dayjs(utcStart)
          .subtract(daysDifference + 1, 'day')
          .toDate(),
        to: dayjs(utcStart).subtract(1, 'd').toDate(),
      }),
    },
    previousMonth: {
      name: 'Previous month',
      isPast: true,
      getDateRange: () => ({
        from: dayjs(utcStart).subtract(1, 'month').toDate(),
        to: dayjs(utcEnd).subtract(1, 'month').toDate(),
      }),
    },
    previousYear: {
      name: 'Previous year',
      isPast: true,
      getDateRange: () => ({
        from: dayjs(utcStart).subtract(1, 'year').toDate(),
        to: dayjs(utcEnd).subtract(1, 'year').toDate(),
      }),
    },
  };
};
