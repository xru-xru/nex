import { ConnectionEdges, PaginationConnection } from '../types/types.custom';
import '../types/types.custom';

// TODO:
// We need to test whether it's a good idea to store these values
// in plain arrays and loop over so many times when adding or removing.
// A better option might be using "Map" or an object which allows for
// easy access and removal.
// The test should also include check if the render method is okay with
// using Object.key(obj).map(...) in case of using objects.
// For the time being, we don't care since we never really store more than
// 20-30 (max) of these selections at onces.
// Comment:
// This is used for combining two arrays of elements of the same
// type into an array without duplicates. This function is
// used when we need to keep a reference to a selection of items
// mostly found in "context".
// The reason for accepting a "filter" function is so we can
// compare the values without any set rules. We want to compare
// portfolios as well as kpis which have different comparison functions.
export function union<T>(source: T[], items: T[], filter?: (a: T, b: T) => boolean): T[] {
  const filterFn = typeof filter === 'function' ? filter : (a, b) => a === b;
  return items.reduce(
    (prev, next) => {
      if (!prev.some((p) => filterFn(p, next))) {
        prev.push(next);
      }

      return prev;
    },
    [...source],
  );
}
// Comment:
// This is used for creating a difference array of elements of the same
// type into an array without duplicates. This function is similar to
// "union" helper. In this case, we are removing an item from
// the reference array which is usually stored in "context" for alter
// use. The reason for accepting "filter" function is so we can
// compare the values without any set rules. We want to compare
// portfolios as well as kpis which have different comparison functions.
export function difference<T>(source: T[], items: T[], filter?: (a: T, b: T) => boolean): T[] {
  const filterFn = typeof filter === 'function' ? filter : (a, b) => a === b;
  return source.filter((s) => !items.some((i) => filterFn(s, i)));
}
// Comment:
// Universal selector to find out whether visible list of items
// in a table are all in a selected items collection. This is used
// in combination of filtered apollo query visible on the screen
// and the context selection of the items for the page.
// It is meant to be used on Paginated queries and the "filter"
// argument is the checker we pass to compare the values.
export function fullVisibleSelection<T>(
  selected: T[],
  connection: PaginationConnection<T>,
  filter: (a: T, b: T) => boolean,
  filterAllowedEdges?: (a: ConnectionEdges<T>) => boolean, //TODO: This is ugly. We need to figure out a better way to handle it.
): boolean {
  let allowedEdges = connection.edges || [];

  // In case we want to filter out the edges from some values.
  // Example is if some of the edges are "disabled" from selection
  // we want to exclude them from the list
  if (typeof filterAllowedEdges === 'function') {
    allowedEdges = allowedEdges.filter(filterAllowedEdges);
  }

  // In case selected are less than edges we can automatically
  // assume not all of the items are selected in the list.
  if (allowedEdges.length === 0 || selected.length < allowedEdges.length) {
    return false;
  }

  // We want to find only the selected items which are actually
  // visible in the collection list. If we use a filter on items, we
  // can have selected items which are not in the list.
  const visibleSelection = allowedEdges.filter((item) => selected.some((s) => !filter(item.node, s)));
  return visibleSelection.length === allowedEdges.length;
}
// Comment:
// To make sure we always have array of items
export function toArr<T>(items: T | T[]): T[] {
  return !Array.isArray(items) ? [items] : [...items];
}
// Comment:
// Little helper to check if an array is empty
export function emptyArr(arr: any[]) {
  return arr?.length === 0;
}
// Helper to check if all elements from arr1 are in arr2
// We cannon use lodash.isEqual, since there the order of elements matters
export function equalArrs(arr1: any[], arr2: any[]) {
  return arr2.every((item) => arr1.includes(item));
}

export const createArrayOf = (count: number) => Array(count).fill({});

export const extractIdsByKey = (array: any[], idKey: string) => array.map((item) => item[idKey]);
