import { PaginatedQuery } from '../types/types.custom';

export function mergePaginatedQuery<T>(
  queryKey: string,
  prev: PaginatedQuery<T>,
  next: PaginatedQuery<T>
): PaginatedQuery<T> {
  return {
    ...prev,
    [queryKey]: {
      ...prev[queryKey],
      edges: [...prev[queryKey].edges, ...next[queryKey].edges],
      pageInfo: next[queryKey].pageInfo,
    },
  };
}
export type MergedQueryState = {
  loading: boolean;
  error:
    | Error
    | {
        message: string;
      }
    | null;
};
export function mergeQueryState(...queries: any[]): MergedQueryState {
  let loading = false;
  let error = null;
  queries.forEach((q) => {
    if (q.loading) {
      loading = q.loading;
    }

    if (q.error) {
      error = q.error;
    }
  });
  return {
    loading,
    error,
  };
}
export function separateLoading(query: Record<string, any>): any {
  return {
    ...query,
    initLoading: query.networkStatus === 1,
    loading: query.networkStatus !== 3 && query.loading,
    loadingMore: query.networkStatus === 3,
    refetching: query.networkStatus === 4,
  };
}
// Comment: try catch of async mutation which we keep repeating
export async function tryCatchMutation(mutation: (...args: any[]) => any, options?: Record<string, any>) {
  try {
    return await mutation(options);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
