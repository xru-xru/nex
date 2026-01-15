import React from 'react';

import { NexoyaMeasurement } from '../../../../types/types';
import { ChannelInput } from '../../../../types/types.custom';
import { $Values } from 'utility-types';

import { buildKpiKey } from '../../../../utils/buildReactKeys';
import { equalKpis } from '../../../../utils/kpi';

export type KpisObjectMap = Record<string, NexoyaMeasurement>;
export type State = {
  toAdd: KpisObjectMap;
  toRemove: KpisObjectMap;
  selectedKpis: NexoyaMeasurement[];
  loading: boolean;
};
// eslint-disable-next-line no-use-before-define
type ActionTypes = $Values<typeof ACTIONS>;
type Action = {
  type: ActionTypes;
  kpi?: NexoyaMeasurement;
  loading?: boolean;
};

function removeFromArray(source, kpi) {
  return source.filter((s) => !equalKpis(s, kpi));
}

function removeChannelKpi(source, kpi) {
  const itemsEqual = (x, y) => x.provider_id === y.provider_id && x.measurement_id !== y.measurement_id;

  return source.filter((s) => !itemsEqual(s, kpi));
}

function removeFromObject(source, key) {
  const { [key]: deleteKey, ...nextSource } = source;
  return nextSource;
}

const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  REMOVE_CHANNEL_ITEM: 'REMOVE_CHANNEL_ITEM',
  SET_LOADING: 'SET_LOADING',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const { kpi } = action;

      if (kpi) {
        const kpiKey = buildKpiKey(kpi);
        const nextToAdd = !state.toRemove[kpiKey] ? { ...state.toAdd, [kpiKey]: kpi } : state.toAdd;
        return {
          ...state,
          selectedKpis: [...state.selectedKpis, kpi],
          toAdd: nextToAdd,
          toRemove: { ...removeFromObject(state.toRemove, kpiKey) },
        };
      }

      throw new Error(`You must provider 'kpi' for: ${action.type}`);
    }

    case ACTIONS.REMOVE_ITEM: {
      const { kpi } = action;

      if (kpi) {
        const kpiKey = buildKpiKey(kpi);
        const nextToRemove = !state.toAdd[kpiKey] ? { ...state.toRemove, [kpiKey]: kpi } : state.toRemove;
        return {
          ...state,
          selectedKpis: [...removeFromArray(state.selectedKpis, kpi)],
          toRemove: nextToRemove,
          toAdd: { ...removeFromObject(state.toAdd, kpiKey) },
        };
      }

      throw new Error(`You must provider 'kpi' for: ${action.type}`);
    }

    case ACTIONS.REMOVE_CHANNEL_ITEM: {
      const { kpi } = action;

      if (kpi) {
        const kpiKey = buildKpiKey(kpi);
        const nextToRemove = !state.toAdd[kpiKey] ? { ...state.toRemove, [kpiKey]: kpi } : state.toRemove;
        return {
          ...state,
          selectedKpis: [...removeChannelKpi(state.selectedKpis, kpi)],
          toRemove: nextToRemove,
          toAdd: { ...removeFromObject(state.toAdd, kpiKey) },
        };
      }

      throw new Error(`You must provider 'kpi' for: ${action.type}`);
    }

    case ACTIONS.SET_LOADING: {
      const { loading } = action;

      if (typeof loading === 'boolean') {
        return { ...state, loading };
      }

      throw new Error(`You must provider 'loading' for: ${action.type}`);
    }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

function initReducer(kpis: NexoyaMeasurement[]): State {
  return {
    toAdd: {},
    toRemove: {},
    selectedKpis: kpis,
    loading: false,
  };
}

function useKpiSelectionReducer(initialKpis: NexoyaMeasurement[] | ChannelInput[]) {
  const [state, dispatch] = React.useReducer(reducer, initialKpis, initReducer);
  // const defaultValues = React.useMemo(() => initialKpis, [initialKpis]);
  const addItem = React.useCallback(
    (kpi: NexoyaMeasurement) =>
      dispatch({
        type: ACTIONS.ADD_ITEM,
        kpi,
      }),
    [dispatch]
  );
  const removeItem = React.useCallback(
    (kpi: NexoyaMeasurement) =>
      dispatch({
        type: ACTIONS.REMOVE_ITEM,
        kpi,
      }),
    [dispatch]
  );
  const removeChannelItem = React.useCallback(
    (kpi: NexoyaMeasurement) =>
      dispatch({
        type: ACTIONS.REMOVE_CHANNEL_ITEM,
        kpi,
      }),
    [dispatch]
  );
  const setLoading = React.useCallback(
    (loading: boolean) =>
      dispatch({
        type: ACTIONS.SET_LOADING,
        loading,
      }),
    [dispatch]
  );
  const touched = Object.keys(state.toAdd).length !== 0 || Object.keys(state.toRemove).length !== 0;
  return {
    ...state,
    addItem,
    removeItem,
    removeChannelItem,
    setLoading,
    touched,
  };
}

export { useKpiSelectionReducer };
