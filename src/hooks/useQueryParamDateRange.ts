import { useEffect } from 'react';
import dayjs from 'dayjs';
import { StringParam, useQueryParams } from 'use-query-params';

import { format, GLOBAL_DATE_FORMAT } from '../utils/dates';

interface IDateRange {
  dateFrom: Date;
  dateTo: Date;
}

/**
 * Save date in YYYY-MM-DD format in UTC.
 * Output dates with dateFrom set to utcStartMidnight and dateTo set to utcEndMidnight.
 *
 * Avoid using DateParam from use-query-params as this reads times as local time midnight, not UTC midnight.
 */
export const useQueryParamDateRange = (
  defaultRange: IDateRange,
  queryParamNames = { dateFrom: 'dateFrom', dateTo: 'dateTo' },
) => {
  const [queryParams, setQueryParams] = useQueryParams({
    [queryParamNames.dateFrom]: StringParam,
    [queryParamNames.dateTo]: StringParam,
  });

  const setQueryParamsWithUtc = ({ dateFrom = null, dateTo = null }: IDateRange) => {
    setQueryParams({
      [queryParamNames.dateFrom]: dateFrom ? dayjs.utc(dateFrom).format('YYYY-MM-DD') : null,
      [queryParamNames.dateTo]: dateTo ? dayjs.utc(dateTo).format('YYYY-MM-DD') : null,
    });
  };

  useEffect(() => {
    if ((!queryParams[queryParamNames.dateFrom] || !queryParams[queryParamNames.dateTo]) && defaultRange) {
      setQueryParamsWithUtc(defaultRange);
    }
  }, [queryParams, queryParamNames.dateFrom, queryParamNames.dateTo]);

  const dateFrom = queryParams[queryParamNames.dateFrom]
    ? new Date(format(queryParams[queryParamNames.dateFrom], GLOBAL_DATE_FORMAT, true))
    : null;
  const dateTo = queryParams[queryParamNames.dateTo]
    ? new Date(format(queryParams[queryParamNames.dateTo], GLOBAL_DATE_FORMAT, true))
    : null;

  return { dateFrom, dateTo, setDates: setQueryParamsWithUtc };
};
