import React from 'react';

import { NumberParam, useQueryParams } from 'use-query-params';

import { PaginationTypes } from 'types';

import { withDateProvider } from '../context/DateProvider';
import { KpisFilterProvider2 } from '../context/KpisFilterProvider';

import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import KpisFilters from '../components/KPIsFilterTable/KpisFilters';
import KpisHeader from '../components/KPIsFilterTable/KpisHeader';
import KpisTable from '../components/KpisListTable';
import MainContent from '../components/MainContent';
import Pagination from 'components/Pagination/Pagination';
import ScrollToTop from 'components/ScrollToTop';

import TableResult from './kpis0/TableResults';

const KPIs = () => {
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [reset, setReset] = React.useState(false);
  function handlePagination(e: PaginationTypes) {
    const newPage = e === PaginationTypes.INCREMENT ? queryParams.searchPg + 1 : queryParams.searchPg - 1;
    setQueryParams({
      searchPg: newPage,
      offset: queryParams.offset,
    });
  }
  function handleOffsetChange(offset: number) {
    setQueryParams({
      searchPg: queryParams.searchPg,
      offset,
    });
  }
  const [queryParams, setQueryParams] = useQueryParams({
    searchPg: NumberParam,
    offset: NumberParam,
  });
  React.useEffect(
    () =>
      setQueryParams({
        searchPg: queryParams.searchPg || 1,
        offset: queryParams.offset || 50,
      }),
    // eslint-disable-next-line
    []
  );
  return (
    <ScrollToTop>
      <MainContent className="sectionToPrint">
        <ErrorBoundary>
          <KpisFilterProvider2>
            <KpisHeader saveToParams={true} showCreateCustomKpi={true} />
            <KpisFilters saveToParams={true} />
            <KpisTable
              saveToParams={true}
              offset={queryParams.offset}
              page={queryParams.searchPg}
              setHasNextPage={setHasNextPage}
              resetPagination={setReset}
            >
              {({ kpis, loading, edges }) =>
                !loading && <TableResult kpis={kpis} edges={edges} enableHeaderActions={true} />
              }
            </KpisTable>
            <Pagination
              onArrowClick={handlePagination}
              onResultNumChange={handleOffsetChange}
              decrementDisabled={!queryParams.searchPg || queryParams.searchPg === 1}
              incrementDisabled={!hasNextPage}
              reset={reset}
            />
          </KpisFilterProvider2>
        </ErrorBoundary>
      </MainContent>
    </ScrollToTop>
  );
};

export default withDateProvider(KPIs);
