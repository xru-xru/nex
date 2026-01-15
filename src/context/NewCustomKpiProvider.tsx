/* eslint-disable no-use-before-define */
import React, { Reducer } from 'react';

import { NexoyaMeasurement } from '../types/types';
import '../types/types';

import { useSafeContext } from '../hooks/useSafeContext';
import { difference, toArr, union } from '../utils/array';
import { equalCustomKpis } from '../utils/kpi';

export type CalculationType = 'sum' | 'avg' | 'max' | 'min';
type State = {
  calcType: CalculationType;
  kpis: NexoyaMeasurement[];
  name: string;
  description: string;
  // used for checkbox in footer of creation wizard
  // if true, search term is sent to BE when creating Custom KPI
  // if true, search term has priority over kpis (kpis don't need to be sent)
  includeSearch: boolean;
};
const NewCustomKpiContext = React.createContext<any>(null);
const MSG = {
  CALC_CHANGE: 'CALC_CHANGE',
  FIELD_CHANGE: 'FIELD_CHANGE',
  INCLUDE_SEARCH_CHANGE: 'INCLUDE_SEARCH_CHANGE',
  KPI_ADD: 'KPI_ADD',
  KPI_REMOVE: 'KPI_REMOVE',
  RESET_STATE: 'RESET_STATE',
};
const initState = {
  kpis: [],
  name: '',
  description: '',
  calcType: 'sum',
  includeSearch: false,
};

function reducer(state: State, msg: Record<string, any>) {
  switch (msg.type) {
    case MSG.FIELD_CHANGE: {
      return { ...state, [msg.payload.name]: msg.payload.value };
    }

    case MSG.RESET_STATE: {
      return { ...initState };
    }

    case MSG.CALC_CHANGE: {
      return { ...state, calcType: msg.payload };
    }

    case MSG.INCLUDE_SEARCH_CHANGE: {
      return { ...state, includeSearch: msg.payload };
    }

    case MSG.KPI_ADD: {
      return {
        ...state,
        kpis: union<NexoyaMeasurement>(state.kpis, msg.payload, equalCustomKpis),
      };
    }

    case MSG.KPI_REMOVE: {
      return {
        ...state,
        kpis: difference<NexoyaMeasurement>(state.kpis, msg.payload, equalCustomKpis),
      };
    }

    default: {
      // TODO: change this into a function which is reused and stripped
      // from the code in compile process. The same happens in other places
      if (import.meta.env.MODE === 'development') {
        throw new Error(`Unsupported action type: ${msg.type}`);
      }

      return state;
    }
  }
}

function NewCustomKpiProvider(props: any) {
  const [state, dispatch] = React.useReducer<Reducer<any, any>>(reducer, {
    ...initState,
  });
  const value = React.useMemo(() => [state, dispatch], [state]);
  return <NewCustomKpiContext.Provider value={value} {...props} />;
}

function useNewCustomKpi() {
  const [state, dispatch] = useSafeContext(NewCustomKpiContext, 'NewCustomKpi');
  const resetState = React.useCallback(
    () =>
      dispatch({
        type: MSG.RESET_STATE,
      }),
    [dispatch]
  );
  const setCalcType = React.useCallback(
    (type: CalculationType) =>
      dispatch({
        type: MSG.CALC_CHANGE,
        payload: type,
      }),
    [dispatch]
  );
  const addKpi = React.useCallback(
    (adding: NexoyaMeasurement | NexoyaMeasurement[]) =>
      dispatch({
        type: MSG.KPI_ADD,
        payload: toArr<NexoyaMeasurement>(adding),
      }),
    [dispatch]
  );
  const removeKpi = React.useCallback(
    (removing: NexoyaMeasurement | NexoyaMeasurement[]) =>
      dispatch({
        type: MSG.KPI_REMOVE,
        payload: toArr<NexoyaMeasurement>(removing),
      }),
    [dispatch]
  );
  const fieldChange = React.useCallback(
    (ev: React.SyntheticEvent<any>) => {
      const { name, value } = ev.currentTarget;
      dispatch({
        type: MSG.FIELD_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatch]
  );
  const setIncludeSearch = React.useCallback(
    (includeSearch: boolean) => {
      dispatch({
        type: MSG.INCLUDE_SEARCH_CHANGE,
        payload: includeSearch,
      });
    },
    [dispatch]
  );
  return {
    ...state,
    setCalcType,
    setIncludeSearch,
    addKpi,
    removeKpi,
    fieldChange,
    resetState,
  };
}

function withNewCustomKpiProvider(Component: any) {
  return function WithNewCustomKpiProvider(props: any) {
    return (
      <NewCustomKpiProvider>
        <Component {...props} />
      </NewCustomKpiProvider>
    );
  };
}

export { NewCustomKpiProvider, useNewCustomKpi, withNewCustomKpiProvider };
