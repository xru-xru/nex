import dayjs from 'dayjs';

import { NexoyaPortfolio } from '../types';

import { buildPortfolioPath } from '../routes/paths';

import { DATE_SELECTOR_DEFAULT_FORMAT, djsAnchors, format, GLOBAL_DATE_FORMAT } from './dates';
import { DateSelectorProps, getPortfolioDateRanges } from '../components/DateSelector';
import { EVENT } from '../constants/events';
import Tooltip from '../components/Tooltip';
import ButtonIcon from '../components/ButtonIcon';
import { X } from 'lucide-react';
import { portfolioTabs } from '../configs/portfolio';
import { track } from '../constants/datadog';

export const DEFAULT_PORTFOLIO_DATE_RANGE = {
  dateFrom: dayjs.utc().subtract(3, 'week').startOf('day').toDate(),
  dateTo: dayjs.utc().endOf('day').toDate(),
};

export const DEFAULT_PORTFOLIO_COMPARE_DATE_RANGE = {
  dateFrom: dayjs(DEFAULT_PORTFOLIO_DATE_RANGE.dateFrom).subtract(2, 'week').toDate(),
  dateTo: dayjs(DEFAULT_PORTFOLIO_DATE_RANGE.dateTo).subtract(2, 'week').toDate(),
};

// Simplifies the process of formatting date ranges and building portfolio path with query parameters
export const buildPortfolioPathWithDates = (
  portfolioNode: NexoyaPortfolio,
  dateParams?: { dateFrom?: string; dateTo?: string },
) => {
  const { portfolioId, startDate, endDate } = portfolioNode;
  const path = buildPortfolioPath(portfolioId);

  const startDay = dayjs.utc(startDate);
  const endDay = dayjs.utc(endDate);

  const formattedStartDate = startDay.format(GLOBAL_DATE_FORMAT);
  const formattedEndDate = endDay.format(GLOBAL_DATE_FORMAT);

  // Default range as dayjs objects for comparison
  const defaultStart = dayjs.utc(DEFAULT_PORTFOLIO_DATE_RANGE.dateFrom);
  const defaultEnd = dayjs.utc(DEFAULT_PORTFOLIO_DATE_RANGE.dateTo);

  // Determine if start or end date falls outside the default date range
  const isStartBeforeDefault = startDay.isBefore(defaultStart);
  const isEndAfterDefault = endDay.isAfter(defaultEnd);

  // Build query based on conditions
  let queryParams = `?dateFrom=${formattedStartDate}&dateTo=${formattedEndDate}`;

  // If portfolio dates are completely outside the default range, adjust accordingly
  if (isStartBeforeDefault && isEndAfterDefault) {
    queryParams = `?dateFrom=${format(defaultStart, GLOBAL_DATE_FORMAT, true)}&dateTo=${format(
      defaultEnd,
      GLOBAL_DATE_FORMAT,
      true,
    )}`;
  } else if (!isStartBeforeDefault && isEndAfterDefault) {
    queryParams = `?dateFrom=${formattedStartDate}&dateTo=${format(defaultEnd, GLOBAL_DATE_FORMAT, true)}`;
  }

  // Override if dateParams exist AND differ from defaults
  const dateQueryParamsDifferentThanDefaults =
    dateParams?.dateFrom !== format(DEFAULT_PORTFOLIO_DATE_RANGE.dateFrom, GLOBAL_DATE_FORMAT, true) &&
    dateParams?.dateTo !== format(DEFAULT_PORTFOLIO_DATE_RANGE.dateTo, GLOBAL_DATE_FORMAT, true);

  if (dateParams?.dateFrom && dateParams?.dateTo && dateQueryParamsDifferentThanDefaults) {
    queryParams = `?dateFrom=${dateParams.dateFrom}&dateTo=${dateParams.dateTo}`;
  }

  return path + queryParams;
};

export function createDateSelectorProps({
  setDates,
  portfolioId,
  activeTab,
  portfolioStart,
  portfolioEnd,
  hasPortfolioEnded,
  dateFrom,
  dateTo,
  queryParams,
  dateFormat,
  resetInitialDateRange,
}: {
  setDates: (dates: { dateFrom: Date; dateTo: Date }) => void;
  portfolioId: number;
  activeTab: string;
  portfolioStart: string;
  portfolioEnd: string;
  dateFrom: Date;
  dateTo: Date;
  hasPortfolioEnded: boolean;
  queryParams: any;
  dateFormat: string;
  resetInitialDateRange: () => void;
}): DateSelectorProps {
  return {
    onDateChange: (inp: { from: Date; to: Date }) => {
      setDates({ dateFrom: inp.from, dateTo: inp.to });
      resetInitialDateRange();
      track(EVENT.DATE_RANGE_CHANGE, {
        portfolioId,
        tab: activeTab,
        start: dayjs(inp.from).format(GLOBAL_DATE_FORMAT),
        end: dayjs(inp.to).format(GLOBAL_DATE_FORMAT),
      });
    },
    dateFrom,
    dateTo,
    hideFutureQuickSelection: true,
    disableBeforeDate: new Date(format(dayjs(portfolioStart), 'utcStartMidnight')),
    disableAfterDate:
      activeTab === portfolioTabs.BUDGET || activeTab === portfolioTabs.TARGET
        ? new Date(format(portfolioEnd, 'utcStartMidnight', true))
        : hasPortfolioEnded
          ? new Date(format(portfolioEnd, 'utcStartMidnight', true))
          : new Date(format(djsAnchors.today, 'utcStartMidnight', true)),
    dateRanges: getPortfolioDateRanges(
      new Date(portfolioStart),
      hasPortfolioEnded
        ? new Date(format(portfolioEnd, 'utcMidday', true))
        : new Date(format(dayjs().utc(), 'utcMidday', true)),
    ),
    useNexoyaDateRanges: true,
    format: queryParams.dateComparisonActive ? dateFormat : DATE_SELECTOR_DEFAULT_FORMAT,
    renderStartAdornment: queryParams.dateComparisonActive ? () => null : null,
  };
}

export function createCompareDateSelectorProps({
  setCompare,
  portfolioId,
  activeTab,
  compareFrom,
  compareTo,
  compareDateRanges,
  disableAfter,
  dateFormat,
  setQueryParams,
}: {
  setCompare: (dates: { dateFrom: Date; dateTo: Date }) => void;
  portfolioId: number;
  activeTab: string;
  compareFrom: Date | null;
  compareTo: Date | null;
  disableAfter: Date | null;
  compareDateRanges: any;
  dateFormat: string;
  setQueryParams: (params: any) => void;
}): DateSelectorProps {
  return {
    onDateChange: (inp: { from: Date; to: Date }) => {
      setCompare({ dateFrom: inp.from, dateTo: inp.to });
      track(EVENT.COMPARE_DATE_RANGE_CHANGE, {
        portfolioId,
        tab: activeTab,
        start: dayjs(inp.from).format(GLOBAL_DATE_FORMAT),
        end: dayjs(inp.to).format(GLOBAL_DATE_FORMAT),
      });
    },
    dateFrom: compareFrom || null,
    dateTo: compareTo || null,
    hideFutureQuickSelection: true,
    hidePastQuickSelection: false,
    disableAfterDate: disableAfter ? new Date(format(dayjs(disableAfter), 'utcStartMidnight')) : null,
    dateRanges: compareDateRanges,
    useNexoyaDateRanges: false,
    format: dateFormat,
    renderStartAdornment: () => (
      <Tooltip placement="left" variant="dark" size="small" content="Cancel comparison">
        <ButtonIcon
          style={{ borderRadius: '50%', padding: 2, marginRight: 4 }}
          onClick={(e) => {
            e.preventDefault();
            setQueryParams({ dateComparisonActive: false, compareFrom: null, compareTo: null });
          }}
        >
          <X className="h-2.5 w-2.5 text-neutral-300" />
        </ButtonIcon>
      </Tooltip>
    ),
  };
}
