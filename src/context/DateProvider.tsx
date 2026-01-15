import React, { createContext } from 'react';
import { Location, withRouter } from 'react-router-dom';

import dayjs from 'dayjs';
import { DateParam, useQueryParams } from 'use-query-params';

import { distanceRange, djsAnchors, format, isSame } from '../utils/dates';

type DateRange = {
  from: Date;
  to: Date;
};
type Props = {
  children: React.ReactElement;
  location: Location;
};
type State = {
  from: Date;
  to: Date;
  setDateRangeChange: (dates: DateRange) => void;
  dateFrom: () => string;
  dateTo: () => string;
};
const DateContext = createContext<State>(null);
const initRange = distanceRange({
  distance: 7,
  endOf: false,
  anchor: djsAnchors.yesterday,
});

function DateProvider({ children, location }: Props) {
  const [query, setQuery] = useQueryParams({
    dateFrom: DateParam,
    dateTo: DateParam,
  });
  const [state, setState] = React.useState({
    from: query.dateFrom || initRange.dateFrom,
    to: query.dateTo || initRange.dateTo,
  });
  React.useEffect(() => {
    if (!query.dateFrom && !query.dateTo) {
      // if there is no date in url,
      // set default date to state and url
      setState((s) => ({
        ...s,
        from: initRange.dateFrom,
        to: initRange.dateTo,
      }));
    } else {
      const djsFrom = dayjs(query.dateFrom);
      const djsTo = dayjs(query.dateTo);

      if (!isSame(djsFrom, state.from) || !isSame(djsTo, state.to)) {
        setState({
          from: djsFrom ? djsFrom.toDate() : state.from,
          to: djsTo ? djsTo.toDate() : state.to,
        });
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, setState]);
  const setDateRangeChange = React.useCallback(
    (nextRange: DateRange) => {
      setQuery({
        dateFrom: nextRange.from,
        dateTo: nextRange.to,
      });
      setState({ ...state, from: nextRange.from, to: nextRange.to });
    },
    [state, setState, setQuery]
  );
  const startDate = React.useCallback(() => {
    return format(state.from, 'utcStartMidnight');
  }, [state]);
  const endDate = React.useCallback(() => {
    if (isSame(state.to, djsAnchors.today)) {
      // TODO: At the moment, this is being tested only. Needs to be reviewed
      // In case the date is today, the data should be fetched with a current time converted to the UTC time.
      // COMMENT: This will be automatically translated to this format
      // "2019-03-18T15:11:00.759Z" by GraphQl for some reason :D
      return format(new Date(), 'utcInterval'); // intervalUtcString(new Date());
      // return new Date().toUTCString();
    }

    return format(dayjs(state.to), 'utcEndMidnight');
  }, [state]);
  // TODO: We are copying and pasting with small changes in many places.
  // Comment: this is to remove the "filter" scope for Amplitude.
  // Unfortunately, we use the same context provider for kpi list and keep it alive on kpi detail page as well.
  const splits = location.pathname.split('/');
  const isKpiPage = !isNaN(splits[2]);
  const nextScope = location.pathname.split('/').filter((s) => {
    return s === '/' || isNaN(s);
  });

  if (isKpiPage) {
    nextScope.push('details');
  }

  const { ...ctx } = state;
  // TODO: Redo the Amplitude into hooks and get rid of this complexity
  return (
    <DateContext.Provider
      value={{
        ...ctx,
        setDateRangeChange: setDateRangeChange,
        dateFrom: startDate,
        dateTo: endDate,
      }}
    >
      {children}
    </DateContext.Provider>
  );
}

function useGlobalDate() {
  const context = React.useContext(DateContext);

  if (context === null) {
    throw new Error('useGlobalDate must be used within DateProvider');
  }

  return context;
}

function withDateProvider(Component: any) {
  const DateProviderWithRouter = withRouter(DateProvider);
  return (props: any) => (
    <DateProviderWithRouter>
      <Component {...props} />
    </DateProviderWithRouter>
  );
}

export default withRouter(DateProvider);
export { useGlobalDate, withDateProvider };
export type { DateRange, State };
