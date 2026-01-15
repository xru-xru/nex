import React, { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { DateParam, useQueryParams } from 'use-query-params';

import { useChildCollectionQuery } from '../../graphql/content_old/queryChildCollections';

import { format } from '../../utils/dates';

import Button from '../../components/Button';
import GridHeader from 'components/GridHeader';
import Text from 'components/Text';

import ContentPageTableRow from './ContentPageTableRow';

type Props = {
  contentId: number;
};

function ContentPageTable({ contentId }: Props) {
  const [childCollections, setChildCollections] = useState([]);
  const [endCursor, setEndCursor] = useState<string>();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [queryParams] = useQueryParams({
    dateFrom: DateParam,
    dateTo: DateParam,
  });

  const {
    data: childCollectionsData,
    loading: childCollectionsLoading,
    fetchMore,
  } = useChildCollectionQuery({
    collection_id: contentId,
    dateFrom: format(dayjs(queryParams.dateFrom), 'utcStartMidnight'),
    dateTo: format(dayjs(queryParams.dateTo), 'utcEndMidnight'),
  });

  useEffect(() => {
    if (!childCollectionsLoading && childCollectionsData?.childCollectionsPg) {
      const collectionsPageInfo = childCollectionsData.childCollectionsPg.pageInfo;

      setChildCollections(childCollectionsData.childCollectionsPg.edges);
      setEndCursor(collectionsPageInfo.endCursor);
      setHasNextPage(collectionsPageInfo.hasNextPage);
    }
  }, [childCollectionsLoading, childCollectionsData]);

  const loadMoreData = useCallback(() => {
    if (hasNextPage && !loadingMore) {
      setLoadingMore(true);
      fetchMore({ variables: { after: endCursor } })
        .then(({ data }) => {
          const newEdges = data.childCollectionsPg.edges.filter(
            (newEdge) =>
              !childCollections.some((currentEdge) => currentEdge.node.collection_id === newEdge.node.collection_id),
          );

          const nextPageInfo = data.childCollectionsPg.pageInfo;

          setChildCollections((prevChildCollections) => [...prevChildCollections, ...newEdges]);
          setEndCursor(nextPageInfo.endCursor);
          setHasNextPage(nextPageInfo.hasNextPage);
        })
        .finally(() => {
          setLoadingMore(false);
        });
    }
  }, [hasNextPage, fetchMore, endCursor, loadingMore, childCollections]);

  return (
    <div data-cy="contentPageSubcontentTable">
      <GridHeader>
        <Text>Name</Text>
      </GridHeader>
      {childCollections?.length ? (
        childCollections.map((item) => <ContentPageTableRow key={item.node?.collection_id} data={item} />)
      ) : (
        <Text>No content</Text>
      )}
      {hasNextPage ? (
        <Button
          onClick={loadMoreData}
          variant="contained"
          disabled={loadingMore}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '16px',
          }}
        >
          Load more
        </Button>
      ) : null}
    </div>
  );
}

export default ContentPageTable;
