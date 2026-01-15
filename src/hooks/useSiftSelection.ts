//@ts-nocheck

/* eslint-disable no-use-before-define */
import React from 'react';

import { difference, toArr, union } from '../utils/array';
import { differenceMap, unionMap } from '../utils/map';

type CompareFn<T> = (a: T, b: T) => boolean;
type KeyFn<T> = (a: T) => string;
type Options<T> = {
  initialData?: T[];
  compareFn?: CompareFn<T>;
  keyFn?: KeyFn<T>;
};
type State<T> = {
  addMap: Map<string, T>;
  removeMap: Map<string, T>;
  selected: T[];
  initialSelected: T[];
  compareFn: CompareFn<T>;
  keyFn: KeyFn<T>;
};
type Message<T> =
  | {
      type: typeof MSG.ADD;
      payload: T[];
    }
  | {
      type: typeof MSG.REMOVE;
      payload: T[];
    }
  | {
      type: typeof MSG.RESET;
    }
  | {
      type: typeof MSG.SET_INITIAL;
      payload: T[];
    };
const MSG = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  RESET: 'RESET',
  SET_INITIAL: 'SET_INITIAL',
};

function defaultCompareFn(source: any, check: string) {
  if (typeof source === 'string' && typeof check === 'string') {
    return source === check; // TODO: We should accept a proper keyFn not just default to "id"
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

function inRemove<T, S>(item: T, state: S): boolean {
  return state.removeMap.has(state.keyFn(item));
}

function inSelected<T, S>(item: T, state: S): boolean {
  return state.selected.some((s) => state.keyFn(s) === state.keyFn(item));
}

function inAdd<T, S>(item: T, state: S): boolean {
  return state.addMap.has(state.keyFn(item));
}

function reducer<T>(state: State<T>, msg: Message<T>) {
  switch (msg.type) {
    case MSG.ADD: {
      // Make sure we only add items if necessary
      const canAdd = msg.payload.filter(
        (item) => !inRemove<T, State<T>>(item, state) && !inSelected<T, State<T>>(item, state)
      );
      return {
        ...state,
        selected: union<T>(state.selected, msg.payload, state.compareFn),
        addMap: unionMap<string, T>(state.addMap, canAdd, state.keyFn),
        removeMap: differenceMap<string, T>(state.removeMap, msg.payload, state.keyFn),
      };
    }

    case MSG.REMOVE: {
      const canRemove = msg.payload.filter((item) => !inAdd(item, state) && inSelected(item, state));
      return {
        ...state,
        selected: difference<T>(state.selected, msg.payload, state.compareFn),
        addMap: differenceMap<string, T>(state.addMap, msg.payload, state.keyFn),
        removeMap: unionMap<string, T>(state.removeMap, canRemove, state.keyFn),
      };
    }

    case MSG.RESET: {
      return {
        ...state,
        selected: [...state.initialSelected],
        addMap: new Map(),
        removeMap: new Map(),
      };
    }

    case MSG.SET_INITIAL: {
      return {
        ...state,
        selected: msg.payload,
        initialSelected: msg.payload,
        addMap: new Map(),
        removeMap: new Map(),
      };
    }

    default: {
      // TODO: change this into a function which is reused and stripped
      // from the code in compile process. The same happens in other places
      if (import.meta.env.MODE !== 'production') {
        throw new Error(`useSiftSelection: Unsupported action type: ${msg.type}`);
      }

      return state;
    }
  }
}

function useSiftSelection<T>({
  initialData = [],
  compareFn = defaultCompareFn,
  keyFn = defaultKeyFn,
}: Options<T> = {}) {
  const [state, dispatch]: [State<keyof T>, React.Dispatch] = React.useReducer<State<T>, Message<T>>(reducer, {
    addMap: new Map(),
    removeMap: new Map(),
    selected: initialData,
    initialSelected: initialData,
    compareFn,
    keyFn,
  });
  const add = React.useCallback(
    (adding: T | T[]) =>
      dispatch({
        type: MSG.ADD,
        payload: toArr<T>(adding),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const remove = React.useCallback(
    (removing: T | T[]) =>
      dispatch({
        type: MSG.REMOVE,
        payload: toArr<T>(removing),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const reset = React.useCallback(
    () =>
      dispatch({
        type: MSG.RESET,
      }),
    [dispatch]
  );
  const setInitial = React.useCallback(
    (data: T[]) =>
      dispatch({
        type: MSG.SET_INITIAL,
        payload: data,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const touched = state.addMap.size !== 0 || state.removeMap.size !== 0;
  return { ...(state as State<any>), add, remove, reset, setInitial, touched };
}

export default useSiftSelection;
