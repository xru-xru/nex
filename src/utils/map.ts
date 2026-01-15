// @ts-nocheck
export function unionMap<K, V>(source: Map<K, V>, add: V[], keyFn: (a: V) => K): Map<K, V> {
  return new Map([...source, ...add.map((a) => [keyFn(a), a])]);
}
export function differenceMap<K, V>(source: Map<K, V>, remove: V[], keyFn: (r: V) => K): Map<K, V> {
  const nextMap = new Map<K, V>([...source]);
  remove.forEach((r) => nextMap.delete(keyFn(r)));
  return nextMap;
}
