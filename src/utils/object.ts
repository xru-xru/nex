import { ObjectMap } from '../types/types.custom';

import { toArr } from './array';

// Comment: check whether adding to an object can be done
export function maybe<T>(key: string, value: T, checkFn?: (value: T) => T): Record<string, T> | void {
  let acceptVal = value;

  if (typeof checkFn === 'function') {
    acceptVal = checkFn(value);
  }

  return acceptVal
    ? {
        [key]: value,
      }
    : undefined;
}
// Comment: this is used for cases when we want to create a map of
// elements. Usually used in normalization of data.
// We are using it mainly for normalizing selections and keeping
// track of what is selected and what is not.
// This function adds the array of elements to the map.
export function combineMap<T>(source: ObjectMap<T>, adding: T[], keyFn: (a: T) => string): ObjectMap<T> {
  return {
    ...source,
    ...adding.reduce((prev, next) => {
      const key = keyFn(next);

      if (!source[key]) {
        prev[key] = next;
      }

      return prev;
    }, {}),
  };
}
// COmment: this is used for cases when we want to create a map
// of elements. Usually used in normalization of data.
// We are using it mainly for normalizing selections and keeping
// track of what is selected and what is not.
// This function removes the array of keys from the map
export function unloadMap<T>(source: ObjectMap<T>, removing: T[], keyFn: (a: T) => string): ObjectMap<T> {
  const next = { ...source };
  removing.forEach((r) => {
    delete next[keyFn(r)];
  });
  return next;
}
// Comment: to check if an object is empty. Sometimes it is handy
export function isEmptyObj(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
// Comment: to check if an object is empty. Sometimes it is handy
// TODO: merge this one and the isEmptyObj above
export function emptyObj(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
// Comment: small helper used to remove properties from an element.
// For example, gql adds the "__typename" field to the object.
// There are some cases when we want to remove it before we pass
// things further in the chain.
export function removeProperties(obj: Record<string, any>, properties: string[] | string): Record<string, any> {
  const objClone = { ...obj };
  const propArr = toArr<string>(properties);
  propArr.forEach((p) => {
    delete objClone[p];
  });
  return objClone;
}
