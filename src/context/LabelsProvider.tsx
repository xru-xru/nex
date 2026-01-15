import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';

import { NexoyaPortfolioLabel } from '../types/types';

import { useLabelsQuery } from '../graphql/labels/queryLabels';

import { emptyArr } from '../utils/array';

type LabelsState = {
  labels: NexoyaPortfolioLabel[];
  labelsMap: Map<number, NexoyaPortfolioLabel>;
};

const LabelsContext = React.createContext<any>(null);

function LabelsProvider(props: any) {
  const [labelsFilter, setLabelsFilter] = useState<NexoyaPortfolioLabel[]>([]);
  const [state, setState] = React.useState<LabelsState>({
    labels: [],
    labelsMap: new Map(),
  });
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { data, loading, error, refetch } = useLabelsQuery({ portfolioId });
  const labels = data?.portfolioV2?.labels;

  useEffect(() => {
    if (!loading && !emptyArr(labels)) {
      setState({
        labels,
        labelsMap: new Map(labels?.map((fw) => [fw.labelId, fw])),
      });
    }
  }, [labels, setState, loading]);

  const handleAddLabel = useCallback(
    (labelFilter: NexoyaPortfolioLabel) => {
      setLabelsFilter((prevState) => [...prevState, labelFilter]);
    },
    [setLabelsFilter],
  );

  const handleRemoveLabel = useCallback(
    (labelFilter: NexoyaPortfolioLabel) => {
      setLabelsFilter((prevState) => [...prevState.filter((f) => f.labelId !== labelFilter.labelId)]);
    },
    [setLabelsFilter],
  );

  const handleResetLabelFilterState = useCallback(() => {
    setLabelsFilter([]);
  }, [setLabelsFilter]);

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
        labelsFilter,
        handleAddLabel,
        handleRemoveLabel,
        handleResetLabelFilterState,
      },
    }),
    [state, setState, refetch, labelsFilter, handleAddLabel, handleRemoveLabel, handleResetLabelFilterState],
  );

  return <LabelsContext.Provider value={values} {...props} />;
}

function withLabelsProvider(Component: any) {
  return (props: any) => (
    <LabelsProvider>
      <Component {...props} />
    </LabelsProvider>
  );
}

function useLabels() {
  const context = React.useContext(LabelsContext);

  if (context === undefined) {
    throw new Error(`useLabels must be used within LabelsProvider`);
  }

  const {
    state,
    refetch,
    filter: { labelsFilter, handleAddLabel, handleRemoveLabel, handleResetLabelFilterState },
  } = context;

  const labelById = React.useCallback(
    (labelId: number): NexoyaPortfolioLabel | {} => {
      const label = state.labelsMap.get(labelId);

      if (!label) {
        // eslint-disable-next-line no-console
        console.warn(`useLabels: we could not find such label (labelId:${labelId})`);
        return {};
      }

      return label;
    },
    [state],
  );

  return {
    ...state,
    labelById,
    refetch,
    filter: {
      labelsFilter,
      handleAddLabel,
      handleRemoveLabel,
      handleResetLabelFilterState,
    },
  };
}

export { LabelsProvider, withLabelsProvider, useLabels };
