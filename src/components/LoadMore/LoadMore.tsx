import { FetchMoreOptions } from '@apollo/client';

import { QueryKey } from '../../hooks/useFetchMoreQuery';
import { useFetchMoreQuery } from '../../hooks/useFetchMoreQuery';

import ButtonLoadMore from '../ButtonLoadMore';

type Props = {
  fetchMore: (options: FetchMoreOptions) => Promise<any>;
  cursor: string;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore: boolean;
  queryKey: QueryKey;
  onClickCb?: () => void;
};

function LoadMore({ fetchMore, cursor, loading, loadingMore, hasMore, queryKey, onClickCb }: Props) {
  const { fetchAndUpdate } = useFetchMoreQuery({
    fetchMore,
    cursor,
    queryKey,
  });

  if (!hasMore) {
    return null;
  }

  return (
    <ButtonLoadMore
      isLoading={loading || loadingMore}
      onClick={() => {
        // not the happiest solution to do if else with the callback
        // rethink it.
        // it was done having in mind query param handling in KpisTable0 -
        // when page param updates (onClickCb), the whole component re-renders, which triggers the
        // initial query, and fetchAndUpdate() is triggered at the same time  - which leads to missbehaviour
        if (onClickCb) {
          onClickCb();
        } else fetchAndUpdate();
      }}
    />
  );
}

export default LoadMore;
