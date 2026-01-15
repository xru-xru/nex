import { mergePaginatedQuery } from '../utils/graphql';

export type QueryKey =
  | 'collections'
  | 'portfolios'
  | 'measurements'
  | 'kpis'
  | 'notifications'
  | 'funnels'
  | 'contentWithData'
  | 'childCollectionsPg';
type Options = {
  fetchMore: any;
  queryKey: QueryKey;
  cursor: string;
};
export function useFetchMoreQuery({ fetchMore, queryKey, cursor }: Options) {
  if (!fetchMore || !queryKey || typeof cursor !== 'string') {
    throw new Error(`useLoadMore: can not be used without all params`);
  }

  function fetchAndUpdate() {
    fetchMore({
      variables: {
        after: cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        // TODO: Learn how to pass the TYPE down through different functions in Flow
        return mergePaginatedQuery<any>(queryKey, prev, fetchMoreResult);
      },
    });
  }

  return {
    fetchAndUpdate,
  };
}
