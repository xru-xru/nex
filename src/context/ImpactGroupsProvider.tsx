import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';

import { useImpactGroupsQuery } from '../graphql/impactGroups/queryImpactGroups';

import { emptyArr } from '../utils/array';
import { NexoyaImpactGroup } from '../types';

type ImpactGroupsState = {
  impactGroups: NexoyaImpactGroup[];
  impactGroupsMap: Map<number, NexoyaImpactGroup>;
};

const ImpactGroupsContext = React.createContext<any>(null);

function ImpactGroupsProvider(props: any) {
  const [impactGroupsFilter, setImpactGroupsFilter] = useState<NexoyaImpactGroup[]>([]);
  const [state, setState] = React.useState<ImpactGroupsState>({
    impactGroups: [],
    impactGroupsMap: new Map(),
  });
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { data, loading, error, refetch } = useImpactGroupsQuery({ portfolioId });
  const impactGroups = data?.portfolioV2?.impactGroups;

  useEffect(() => {
    if (!loading && !emptyArr(impactGroups)) {
      setState({
        impactGroups,
        impactGroupsMap: new Map(impactGroups?.map((ig) => [ig.impactGroupId, ig])),
      });
    }
  }, [impactGroups, setState, loading]);

  const handleAddImpactGroup = useCallback(
    (impactGroupFilter: NexoyaImpactGroup) => {
      setImpactGroupsFilter((prevState) => [...prevState, impactGroupFilter]);
    },
    [setImpactGroupsFilter],
  );

  const handleRemoveImpactGroup = useCallback(
    (impactGroupFilter: NexoyaImpactGroup) => {
      setImpactGroupsFilter((prevState) => [
        ...prevState.filter((f) => f.impactGroupId !== impactGroupFilter.impactGroupId),
      ]);
    },
    [setImpactGroupsFilter],
  );

  const handleResetImpactGroupFilterState = useCallback(() => {
    setImpactGroupsFilter([]);
  }, [setImpactGroupsFilter]);

  if (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  const values = React.useMemo(
    () => ({
      state,
      setState,
      refetch,
      filter: {
        impactGroupsFilter,
        handleAddImpactGroup,
        handleRemoveImpactGroup,
        handleResetImpactGroupFilterState,
      },
    }),
    [
      state,
      setState,
      refetch,
      impactGroupsFilter,
      handleAddImpactGroup,
      handleRemoveImpactGroup,
      handleResetImpactGroupFilterState,
    ],
  );

  return <ImpactGroupsContext.Provider value={values} {...props} />;
}

function withImpactGroupsProvider(Component: any) {
  return (props: any) => (
    <ImpactGroupsProvider>
      <Component {...props} />
    </ImpactGroupsProvider>
  );
}

function useImpactGroups() {
  const context = React.useContext(ImpactGroupsContext);

  if (context === undefined) {
    throw new Error(`useImpactGroups must be used within ImpactGroupsProvider`);
  }

  const {
    state,
    setState,
    refetch,
    filter: { impactGroupsFilter, handleAddImpactGroup, handleRemoveImpactGroup, handleResetImpactGroupFilterState },
  } = context;

  const impactGroupById = React.useCallback(
    (impactGroupId: number): NexoyaImpactGroup | {} => {
      const impactGroup = state.impactGroupsMap.get(impactGroupId);

      if (!impactGroup) {
        // eslint-disable-next-line no-console
        console.warn(`useImpactGroups: we could not find such impactGroup (impactGroupId:${impactGroupId})`);
        return {};
      }

      return impactGroup;
    },
    [state],
  );

  return {
    ...state,
    setState,
    impactGroupById,
    refetch,
    filter: {
      impactGroupsFilter,
      handleAddImpactGroup,
      handleRemoveImpactGroup,
      handleResetImpactGroupFilterState,
    },
  };
}

export { ImpactGroupsProvider, withImpactGroupsProvider, useImpactGroups };
