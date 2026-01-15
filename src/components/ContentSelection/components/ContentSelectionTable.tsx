import React from 'react';

import { get } from 'lodash';
import { NumberParam, useQueryParams } from 'use-query-params';

import { PaginationTypes } from 'types';

import { useContentFilter } from 'components/../context/ContentFilterProvider';
import { usePortfolio } from 'components/../context/PortfolioProvider';
import { useContentWithDataQuery } from 'components/../graphql/collection/queryContentWithData';
import { useKpisFilter } from 'context/KpisFilterProvider';

import { equalContent } from 'components/../utils/content';
import useContentCheckAll from 'hooks/useContentCheckAll';

import AvatarProvider from 'components/AvatarProvider';
import Checkbox from 'components/Checkbox';
import * as Styles from 'components/ContentSelection/styles/ContentSelectionTable';
import ErrorBoundary from 'components/ErrorBoundary';
import ErrorMessage from 'components/ErrorMessage';
import GridHeader from 'components/GridHeader';
import GridRow from 'components/GridRow';
import GridWrap from 'components/GridWrap';
import NoResults from 'components/KPIsFilterTable/NoResults';
import LoadingPlaceholder from 'components/LoadingPlaceholder/LoadingPlaceholder';
import Pagination from 'components/Pagination';
import Text from 'components/Text';
import Typography from 'components/Typography';

function ContentSelectionTable() {
  const [after, setAfter] = React.useState<number>();
  const [prevs, setPrevs] = React.useState<Record<number, number>>();
  const [queryParams, setQueryParams] = useQueryParams({
    searchPg: NumberParam,
    offset: NumberParam,
  });
  const {
    //@ts-ignore
    contentSelection: { add, remove, reset, selected },
  } = usePortfolio();
  //@ts-ignore
  const { search, providerSelection, collectionTypeSelection } = useContentFilter();
  const { active } = useKpisFilter();
  const {
    data,
    loading,
    error,
    //@ts-ignore
    loadingMore,
  } = useContentWithDataQuery({
    offset: after,
    first: queryParams.offset,
    where: {
      collectionTypes: collectionTypeSelection.selected.length
        ? collectionTypeSelection.selected.map((item) => item.collection_type_id)
        : undefined,
      providerIds: providerSelection.selected.length
        ? providerSelection.selected.map((item) => item.provider_id)
        : null,
      title: search.value,
      isActive: active.value,
    },
  });

  const isCollectionIdInChildContent = (collectionId: number) =>
    selected.some(
      (parentItem) =>
        parentItem.childContent &&
        parentItem.childContent.map((childItem) => childItem.collection_id).includes(collectionId),
    );

  const collections = get(data, 'contentWithData', []) || [];
  const edges = get(collections, 'edges', []) || [];
  const filteredCollectionEdgesByChildContent = edges.filter(
    (obj) => !isCollectionIdInChildContent(obj.node.collection_id),
  );

  const pageInfo = get(data, 'contentWithData.pageInfo', {}) || {};
  const allCheckbox = useContentCheckAll({
    selected,
    connection: collections,
    add,
    remove,
    reset,
  });
  // TODO this is not a perfect solution
  // ContentWithData query accepts offset as string of last collection id in the list
  // on other places offset is a number of entries to be skipped on db query
  // until those two differences are ironed out, pagination has to have two
  // different behaviours for incrementing/decrementing
  // ===========================================
  const lastCollectionId: number = edges[edges.length - 1]?.node?.collection_id;
  function handleIncrement() {
    const searchPg = ++queryParams.searchPg;
    setAfter(lastCollectionId);
    setPrevs((s) => ({ ...s, [queryParams.searchPg]: lastCollectionId }));
    setQueryParams({
      searchPg,
      offset: queryParams.offset,
    });
  }
  function handleDecrement() {
    const searchPg = --queryParams.searchPg;
    setAfter(prevs[queryParams.searchPg]);
    setQueryParams({
      searchPg,
      offset: queryParams.offset,
    });
  }
  function handlePagination(e: PaginationTypes) {
    return e === PaginationTypes.INCREMENT ? handleIncrement() : handleDecrement();
  }
  function handleOffsetChange(offset: number) {
    setQueryParams({
      searchPg: queryParams.searchPg,
      offset,
    });
  }
  // ===========================================
  React.useEffect(
    () =>
      setQueryParams({
        searchPg: queryParams.searchPg || 1,
        offset: queryParams.offset || 50,
      }),
    // eslint-disable-next-line
    [],
  );
  const noResults = !loading && !loadingMore && edges.length === 0;
  return (
    <Styles.WrapStyled>
      <ErrorBoundary>
        <GridWrap>
          <GridHeader>
            <Checkbox
              onClick={allCheckbox.onClick}
              checked={allCheckbox.checked}
              indeterminate={allCheckbox.indeterminate}
              disabled={allCheckbox.disabled}
            />
            <Text>Source</Text>
            <Text>Name</Text>
            <Text>Type</Text>
          </GridHeader>
          {loading ? (
            <Styles.LoadingWrapStyled>
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
            </Styles.LoadingWrapStyled>
          ) : (
            <>
              <NoResults className="noResultsContentSelection" isVisible={noResults} />
              {filteredCollectionEdgesByChildContent.map((item, index) => {
                const collectionItem = get(item, 'node', {}) || {};
                const isSelected = selected.some((c) => equalContent(c, collectionItem));
                return (
                  <GridRow key={`${collectionItem.collection_id}-${index}`}>
                    <Checkbox
                      name="checkKpi"
                      checked={isSelected}
                      onChange={(_: Event, beingChecked: boolean) => {
                        beingChecked ? add(collectionItem) : remove(collectionItem);
                      }}
                    />
                    {collectionItem.provider ? (
                      <AvatarProvider
                        providerId={collectionItem.provider.provider_id}
                        size={24}
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    ) : null}
                    <Typography
                      component="p"
                      style={{
                        lineHeight: 1,
                        cursor: 'pointer',
                      }}
                      withTooltip
                      onClick={() => {
                        !isSelected ? add(collectionItem) : remove(collectionItem);
                      }}
                    >
                      {collectionItem.title}
                    </Typography>

                    <Styles.TypeStyled>
                      <Typography withTooltip>{collectionItem.collectionType.name}</Typography>
                    </Styles.TypeStyled>
                  </GridRow>
                );
              })}
            </>
          )}
        </GridWrap>
        {!loading && !loadingMore && edges.length !== 0 ? (
          <Pagination
            onArrowClick={handlePagination}
            onResultNumChange={handleOffsetChange}
            decrementDisabled={!queryParams.searchPg || queryParams.searchPg === 1}
            // @ts-ignore
            incrementDisabled={!pageInfo.hasNextPage}
            reset={reset}
            style={{ marginBottom: 24 }}
          />
        ) : null}
      </ErrorBoundary>
      {error ? <ErrorMessage error={error} /> : null}
    </Styles.WrapStyled>
  );
}

export default ContentSelectionTable;
