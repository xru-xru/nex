import React from 'react';

import { get } from 'lodash';
import { NumberParam, useQueryParams } from 'use-query-params';

import { NexoyaMeasurementConnection } from 'types/types';

import { State, useGlobalDate, withDateProvider } from 'context/DateProvider';
import { useKpisFilter } from 'context/KpisFilterProvider';
import { useKpisQuery } from 'graphql/kpi/queryKpis';

import ErrorMessage from 'components/ErrorMessage';
import NoResults from 'components/KPIsFilterTable/NoResults';
import LoadingPlaceholder from 'components/LoadingPlaceholder';

import * as Styles from './styles/KpisListTable';

interface RenderProps {
  loading: boolean;
  kpis: NexoyaMeasurementConnection;
  edges: any[];
}

interface Props {
  children: (renderProps: RenderProps) => React.ReactNode;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  noCard?: boolean;
  saveToParams?: boolean;
  offset?: number;
  page?: number;
  setHasNextPage?: (e: boolean) => void;
  resetPagination?: (e: boolean) => void;
}

const KpisTable = ({ children, saveToParams, offset, page, setHasNextPage, resetPagination }: Props) => {
  const { collectionSelection, measurementSelection, providerSelection, sum, search, active } = useKpisFilter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selection, setSelection] = React.useState({
    c: 0, //collections
    m: 0, //measurements
    p: 0, // providers
  });
  const { dateFrom: from, dateTo: to }: State = useGlobalDate();
  const [queryParams, setQueryParams] = useQueryParams({
    searchPg: NumberParam,
    offset: NumberParam,
  });
  React.useEffect(() => {
    if (saveToParams) {
      setQueryParams({
        searchPg: page,
        offset,
      });
    }
    // eslint-disable-next-line
  }, [saveToParams, page, offset]);
  const { data, loading, error } = useKpisQuery({
    collections: collectionSelection.selected.map((c) => c.collection_id),
    measurements: measurementSelection.selected.map((m) => m.measurement_id),
    providers: providerSelection.selected.map((p) => p.provider_id),
    sum: sum.value,
    limit: offset,
    search: search.value,
    dateFrom: from(),
    dateTo: to(),
    isActive: active.value,
    offset: (queryParams.searchPg - 1) * offset,
  });
  const kpis: NexoyaMeasurementConnection = get(data, 'kpis', {});
  const edges: any[] = React.useMemo(() => get(kpis, 'edges', []) || [], [kpis]);
  const noEdges = edges.length === 0; // indicates value returned from search or not
  React.useEffect(() => {
    if (search.value !== searchTerm) {
      setSearchTerm(search.value);
      resetPagination(true);
    }
  }, [search, resetPagination, searchTerm]);
  React.useEffect(
    () => {
      // there is no declarative way to know if tree renders from filter interaction
      // se we need to track rerender state manually
      const shouldResetPagination =
        collectionSelection.selected?.length !== selection.c ||
        measurementSelection.selected?.length !== selection.m ||
        providerSelection.selected?.length !== selection.p;
      resetPagination(shouldResetPagination);

      if (collectionSelection.selected?.length !== selection.c) {
        setSelection({
          ...selection,
          c: collectionSelection.selected?.length || 0,
        });
      }
      if (measurementSelection.selected?.length !== selection.m) {
        setSelection({
          ...selection,
          m: measurementSelection.selected?.length || 0,
        });
      }
      if (providerSelection.selected?.length !== selection.p) {
        setSelection({
          ...selection,
          p: providerSelection.selected?.length || 0,
        });
      }
    },
    // eslint-disable-next-line
    [
      collectionSelection.selected?.length,
      measurementSelection.selected?.length,
      providerSelection.selected?.length,
      selection,
    ],
  );
  // enable/disable pagination increment
  React.useEffect(() => setHasNextPage(!noEdges && edges.length >= offset), [setHasNextPage, noEdges, edges, offset]);

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
      <NoResults isVisible={!loading && !keepLoading && noEdges} />
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
      ) : null}
      {error ? <ErrorMessage error={error} /> : null}
    </Styles.CardStyled>
  );
};

export default withDateProvider(KpisTable);
