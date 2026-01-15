//@ts-nocheck
import React from 'react';

/* eslint-disable no-use-before-define */
import { get } from 'lodash';

import { NexoyaProviderFilter } from '../../types/types';
import { ObjectMap } from '../../types/types.custom';

import { difference, toArr, union } from '../../utils/array';
import { combineMap, unloadMap } from '../../utils/object';

type CompareFn<T> = (a: T, b: T) => boolean;
type KeyFn<T> = (a: T) => string;
type Options<T> = {
  groups: NexoyaProviderFilter[];
  compareFn?: CompareFn<T>;
  keyFn?: KeyFn<T>;
};
type SiftSelectionState<T> = {
  toAddMap: ObjectMap<T>;
  toRemoveMap: ObjectMap<T>;
  selected: T[];
  initialSelectedMap: ObjectMap<boolean>;
};
type GroupType<T> = Record<string, SiftSelectionState<T>>;
type State<T> = {
  groups: GroupType<T>;
  initialData: NexoyaProviderFilter[];
  compareFn: CompareFn<T>;
  keyFn: KeyFn<T>;
};
type Message<T> =
  | {
      type: typeof MSG.ADD_ITEMS;
      payload: {
        key: string;
        adding: T[];
      };
    }
  | {
      type: typeof MSG.REMOVE_ITEMS;
      payload: {
        key: string;
        removing: T[];
      };
    }
  | {
      type: typeof MSG.SET_INITIAL;
      payload: NexoyaProviderFilter[];
    };
const MSG = {
  ADD_ITEMS: 'ADD_ITEMS',
  REMOVE_ITEMS: 'REMOVE_ITEMS',
  SET_INITIAL: 'SET_INITIAL',
};

function defaultCompareFn(source: any, check: string) {
  if (typeof source === 'string' && typeof check === 'string') {
    return source === check;
  } else if (typeof check === 'object' && typeof check === 'object') {
    return source.id === check.id;
  }

  throw new Error('useSiftSelection: wrong compareFn builder');
}

function defaultKeyFn(a: any): string {
  if (typeof a === 'string') {
    return a;
  } else if (typeof a === 'object' && a.id) {
    return a.id;
  }

  throw new Error('useSiftSelection: wrong keyFn builder');
}

function setIn(state, key, values) {
  return { ...state, [key]: { ...state[key], ...values } };
}

function initGroups(groups: NexoyaProviderFilter[] = []) {
  return groups.reduce((prev, next) => {
    const selected = get(next, 'filterList', []).filter((f) => f.selected);
    prev[next.filterName] = {
      toAddMap: {},
      toRemoveMap: {},
      selected,
      initialSelectedMap: {},
    };
    selected.forEach((s) => {
      prev[next.filterName].initialSelectedMap[s.id] = true;
    });
    return prev;
  }, {});
}

function reducer<T>(state: State<T>, msg: Message<T>) {
  switch (msg.type) {
    case MSG.ADD_ITEMS: {
      const group = state.groups[msg.payload.key];
      const toAddFiltered = msg.payload.adding.filter(
        (i) => !group.toRemoveMap[state.keyFn(i)] && !group.initialSelectedMap[state.keyFn(i)]
      );
      return {
        ...state,
        groups: setIn(state.groups, msg.payload.key, {
          selected: union<T>(group.selected, msg.payload.adding, state.compareFn),
          toAddMap: combineMap<T>(group.toAddMap, toAddFiltered, state.keyFn),
          toRemoveMap: unloadMap<T>(group.toRemoveMap, msg.payload.adding, state.keyFn),
        }),
      };
    }

    case MSG.REMOVE_ITEMS: {
      const group = state.groups[msg.payload.key];
      const toRemoveFiltered = msg.payload.removing.filter((i) => !group.toAddMap[state.keyFn(i)]);
      return {
        ...state,
        groups: setIn(state.groups, msg.payload.key, {
          selected: difference<T>(group.selected, msg.payload.removing, state.compareFn),
          toAddMap: unloadMap<T>(group.toAddMap, msg.payload.removing, state.keyFn),
          toRemoveMap: combineMap<T>(group.toRemoveMap, toRemoveFiltered, state.keyFn),
        }),
      };
    }

    case MSG.SET_INITIAL: {
      return {
        ...state,
        groups: initGroups(msg.payload),
        initialData: msg.payload,
      };
    }

    default: {
      // TODO: change this into a function which is reused and stripped
      // from the code in compile process. The same happens in other places
      if (import.meta.env.MODE !== 'production') {
        throw new Error(`useProviderFilterState: Unsupported action type: ${msg.type}`);
      }

      return state;
    }
  }
}

function useProviderFiltersState<T>({ groups, keyFn = defaultKeyFn, compareFn = defaultCompareFn }: Options<T> = {}) {
  const [state, dispatch] = React.useReducer<State<T>, Message<T>>(reducer, {
    groups: initGroups(groups),
    initialData: groups,
    compareFn,
    keyFn,
  });
  const addItems = React.useCallback(
    (key: string, adding: T | T[]) =>
      dispatch({
        type: MSG.ADD_ITEMS,
        payload: {
          key,
          adding: toArr<T>(adding),
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const removeItems = React.useCallback(
    (key: string, removing: T | T[]) =>
      dispatch({
        type: MSG.REMOVE_ITEMS,
        payload: {
          key,
          removing: toArr<T>(removing),
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const setInitial = React.useCallback(
    (initialData: NexoyaProviderFilter[]) => {
      dispatch({
        type: MSG.SET_INITIAL,
        payload: initialData,
      });
    },
    [dispatch]
  );
  const touched = Object.keys(state.groups).reduce((prev, key) => {
    if (prev) return prev;
    const next = state.groups[key];
    return Object.keys(next.toAddMap).length !== 0 || Object.keys(next.toRemoveMap).length !== 0;
  }, false);
  return { ...state, addItems, removeItems, touched, setInitial };
}

export default useProviderFiltersState;
