import React from 'react';

import { StringParam, useQueryParam } from 'use-query-params';

import { PARAMS } from '../routes/paths';

import usePortfolioLifetimeController from './PortfolioLifetimeController';
// import useSortOrderController from './SortOrderController';
import useSearchController from './SearchController';

function usePortfoliosFilterController() {
  const [paramLifetime = PARAMS.PORTFOLIOS_FILTER.values.ACTIVE] = useQueryParam(
    PARAMS.PORTFOLIOS_FILTER.key,
    StringParam
  );
  const [order, setOrder] = React.useState<{
    orderBySuccessRate: string | null | undefined;
    orderByTitle: string | null | undefined;
  }>({
    orderBySuccessRate: null,
    orderByTitle: 'ASC',
  });
  const { search, setSearch } = useSearchController();
  const { lifetime, setLifetime } = usePortfolioLifetimeController(
    // @ts-expect-error
    paramLifetime
  );
  // We need to make sure that if url query changes we change the filter as well
  React.useEffect(() => {
    if (paramLifetime !== lifetime) {
      // @ts-expect-error
      setLifetime(paramLifetime);
    }
  }, [lifetime, setLifetime, paramLifetime]);
  return {
    order: {
      value: {
        orderBySuccessRate: order.orderBySuccessRate,
        orderByTitle: order.orderByTitle,
      },
      setOrder,
    },
    search: {
      value: search,
      setSearch,
    },
    lifetime: {
      value: lifetime,
      setLifetime,
    },
  };
}

export default usePortfoliosFilterController;
