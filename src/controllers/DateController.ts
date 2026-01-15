import React from 'react';

import dayjs from 'dayjs';

import { distanceRange, djsAnchors, format, isSame } from '../utils/dates';

type State = {
  dateFrom: Date;
  dateTo: Date;
};

function useDateController() {
  const { dateFrom, dateTo } = distanceRange({
    distance: 7,
    endOf: false,
    anchor: djsAnchors.yesterday,
  });
  const [dates, setDates] = React.useState<State>({
    dateFrom,
    dateTo,
  });
  const handleDateChange = React.useCallback(
    ({ from: fromDate, to: toDate }) => {
      setDates((s) => ({ ...s, dateFrom: fromDate, dateTo: toDate }));
    },
    [setDates]
  );
  const startDate = React.useMemo(() => {
    return format(dates.dateFrom, 'utcStartMidnight');
  }, [dates]);
  const endDate = React.useMemo(() => {
    if (isSame(dates.dateTo, djsAnchors.today)) {
      // TODO: At the moment, this is being tested only. Needs to be reviewed
      // In case the date is today, the data should be fetched with a current time converted to the UTC time.
      // COMMENT: This will be automatically translated to this format
      // "2019-03-18T15:11:00.759Z" by GraphQl for some reason :D
      return format(new Date(), 'utcInterval'); // intervalUtcString(new Date());
      // return new Date().toUTCString();
    }

    return format(dayjs(dates.dateTo), 'utcEndMidnight');
  }, [dates]);
  return {
    from: dates.dateFrom,
    to: dates.dateTo,
    handleDateChange,
    startDate,
    endDate,
  };
}

export default useDateController;
