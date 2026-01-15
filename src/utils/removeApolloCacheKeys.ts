export default function removeApolloCacheKeys(cache: any, search: string | Record<string, any>): void {
  // TODO: This is dangerous. We need a better way to check if you
  // are passing a string which should be regexp or an actual regexp
  let regex;

  if (typeof search === 'string') {
    regex = new RegExp(search);
  } else if (typeof search === 'object') {
    regex = search;
  }

  Object.keys(cache.data.data.ROOT_QUERY).filter(
    (k) => k.match(regex) && cache.evict({ id: 'ROOT_QUERY', fieldName: k })
  );
}
