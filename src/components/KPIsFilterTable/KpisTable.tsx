import React from 'react';

import { get } from 'lodash';
import { NumberParam, useQueryParams } from 'use-query-params';

import { PaginationTypes } from 'types';
import { NexoyaMeasurementConnection, NexoyaPortfolioEdges } from 'types/types';

import { State, useGlobalDate, withDateProvider } from 'context/DateProvider';
import { useKpisFilter } from 'context/KpisFilterProvider';
import { useKpisQuery } from 'graphql/kpi/queryKpis';

import ErrorMessage from 'components/ErrorMessage';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import Pagination from 'components/Pagination';

import * as Styles from './styles/KpisTable';

import NoResults from './NoResults';

interface RenderProps {
  loading: boolean;
  kpis: NexoyaMeasurementConnection;
  edges: NexoyaPortfolioEdges[];
}

interface Props {
  children: (renderProps: RenderProps) => React.ReactNode;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  noCard?: boolean;
}

const KpisTable = ({ children }: Props) => {
  const { collectionSelection, measurementSelection, providerSelection, sum, search, active } = useKpisFilter();
  const [queryParams, setQueryParams] = useQueryParams({
    searchPg: NumberParam,
    offset: NumberParam,
  });
  function handleOffsetChange(offset: number) {
    setQueryParams({
      searchPg: queryParams.searchPg,
      offset,
    });
  }
  React.useEffect(
    () =>
      setQueryParams({
        searchPg: queryParams.searchPg || 1,
        offset: queryParams.offset || 50,
      }),
    // eslint-disable-next-line
    []
  );
  const { dateFrom: from, dateTo: to }: State = useGlobalDate();
  const { data, loading, loadingMore, error } = useKpisQuery({
    collections: collectionSelection.selected.map((c) => c.collection_id),
    measurements: measurementSelection.selected.map((m) => m.measurement_id),
    providers: providerSelection.selected.map((p) => p.provider_id),
    sum: sum.value,
    limit: queryParams.offset || 50,
    search: search.value,
    dateFrom: from(),
    dateTo: to(),
    isActive: active.value,
    offset: queryParams.searchPg === 1 ? 0 : (queryParams.searchPg - 1) * queryParams.offset,
  });
  const kpis: NexoyaMeasurementConnection = get(data, 'kpis', {});
  const pageInfo = get(data, 'kpis.pageInfo', {}) || {};
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const edges = get(kpis, 'edges', []) || [];
  function handlePagination(e: PaginationTypes) {
    const newPage = e === PaginationTypes.INCREMENT ? queryParams.searchPg + 1 : queryParams.searchPg - 1;
    setQueryParams({
      searchPg: newPage,
      offset: queryParams.offset,
    });
  }
  const noEdges = edges.length === 0; // indicates value returned from search or not

  const keepLoading: boolean =
    !loading &&
    Object.keys(kpis).length === 0 &&
    noEdges && // !extendedSearch.value &&
    sum.value;
  React.useEffect(() => {
    const searchActive = search.value.length > 0;

    if (loading || !sum.value || (searchActive && !sum.value) || (!searchActive && sum.value) || !noEdges) {
      return;
    }

    sum.set(false);
  }, [loading, edges, noEdges, search.value, sum]);
  return (
    <Styles.CardStyled minHeight="500px">
      {!sum.value ? (
        <Styles.ExtendedSearchWrapStyled>
          <p data-cy="extendedSearchText">We extended your search with all KPIs.</p>
        </Styles.ExtendedSearchWrapStyled>
      ) : null}
      <NoResults isVisible={!loading && !loadingMore && !keepLoading && noEdges} />
      {children({
        kpis,
        loading,
        edges,
      })}
      {loading || keepLoading ? (
        <Styles.LoadingWrapStyled>
          <LoadingPlaceholder />
          <LoadingPlaceholder />
          <LoadingPlaceholder />
          <LoadingPlaceholder />
        </Styles.LoadingWrapStyled>
      ) : loadingMore ? (
        <Styles.SpinnerStyled
          size="15px"
          style={{
            marginTop: 25,
          }}
        />
      ) : edges.length > 0 ? (
        <Pagination
          onArrowClick={handlePagination}
          onResultNumChange={handleOffsetChange}
          decrementDisabled={!queryParams.searchPg || queryParams.searchPg === 1}
          incrementDisabled={!pageInfo.hasNextPage}
          reset={false}
        />
      ) : null}
      {error ? <ErrorMessage error={error} /> : null}
    </Styles.CardStyled>
  );
};

export default withDateProvider(KpisTable);
