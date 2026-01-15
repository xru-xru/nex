import { useLocation } from 'react-router-dom';

import queryString, { ParsedQuery } from 'query-string';

interface RouterQuery {
  query: string | null;
  stringifyUpdatedQuery: (value: string) => string;
} // TODO: get rid of this and instead use a smarter solution.
// This is only used once in the "TabsRouted" which is kind of useless anyway

export default function useReactRouterQuery(key: string): RouterQuery {
  const location = useLocation();
  const search: ParsedQuery<string> = queryString.parse(location.search);
  const queryExists = typeof search[key] === 'string';

  function stringifyUpdatedQuery(value: string): string {
    const nextSearch = { ...(search as object), [key]: value };
    return queryString.stringify(nextSearch);
  }

  return {
    //@ts-ignore
    query: queryExists ? search[key] : null,
    stringifyUpdatedQuery,
  };
}
