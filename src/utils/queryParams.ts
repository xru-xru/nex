export function filterEmpty(params: Record<string, any>): Record<string, any> {
  const filteredQuery = Object.keys(params).reduce(
    (accu: Record<string, any>, queryParam: string): Record<string, any> => {
      const value = params[queryParam];

      if (value !== null && value !== '') {
        accu[queryParam] = value;
      }

      return accu;
    },
    {}
  );
  return filteredQuery;
}
export function parseQueryString(queryString: string): Record<string, unknown> {
  const query = {};
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  pairs.forEach((pair) => {
    const cleanPair = pair.split('=');
    query[decodeURIComponent(cleanPair[0])] = decodeURIComponent(cleanPair[1] || '');
  });
  return query;
}
export function serialize(obj: Record<string, string | number | boolean>): string {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}
export function stringifyQueryParams(params: Record<string, any>, skipCurrent = false): string {
  const currQuery = skipCurrent ? {} : parseQueryString(window.location.search);
  const nextQuery = { ...currQuery, ...params };
  return serialize(filterEmpty(nextQuery));
}
