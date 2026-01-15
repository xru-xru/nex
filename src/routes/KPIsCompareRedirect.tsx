import React from 'react';
import { RouterHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import {
  ArrayParam,
  DateParam,
  useQueryParams, // stringify,
} from 'use-query-params';

import { encodeDateQuery } from '../utils/dates';
import { filterEmpty } from '../utils/queryParams';

import { PATHS } from './paths';

type Props = {
  history: RouterHistory;
};
// old query params are not taken into consideration, because we use new names
// to avoid naming conflicts
export function buildNewKpiComparePath(newParams: Record<string, any>) {
  const serialize = (obj) => {
    const str = [];
    for (const p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    return str.join('&');
  };
  return `${PATHS.APP.KPIS}${'?'}${serialize(filterEmpty(newParams))}`;
}

// component that redirects user from old kpi compare page to
// kpis list page with open sidepanel
function KPIsCompareRedirect({ history }: Props) {
  const [queryParams] = useQueryParams({
    kpi: ArrayParam,
    dateFrom: DateParam,
    dateTo: DateParam,
  });
  const newParams = {
    kpi: queryParams.kpi,
    dateFromCompare: encodeDateQuery(queryParams.dateFrom),
    dateToCompare: encodeDateQuery(queryParams.dateTo),
    isCompareMetricsOpen: 1,
  };
  React.useEffect(
    () => history.push(buildNewKpiComparePath(newParams)), // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return <div />;
}

export default withRouter(KPIsCompareRedirect);
