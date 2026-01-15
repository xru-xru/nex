import { useCallback, useEffect, useState } from 'react';

import { get } from 'lodash';

import { NexoyaFunnelStepType, NexoyaOptimizationV2, NexoyaPortfolioType, NexoyaProvider } from '../types/types';

import { ValidationChartType } from '../context/PortfolioProvider';

import validateNumberInput from '../components/TableFormNumber/utils/validateNumberInput';
import { distanceRange } from '../utils/dates';

import { VALIDATION_CHART_SECTIONS } from '../routes/portfolio/Validation';

import { budgetOptimizationType, budgetRiskType } from '../configs/portfolio';
import useContentSelectionController from './ContentSelectionController';
import { BooleanParam, useQueryParam } from 'use-query-params';

type FormValues = {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  goal: string;
  type: NexoyaPortfolioType;
  // TODO: Change to enum
  budgets: any;
  optimizationType: string;
  optimizationRiskLevel: number;
  budgetDeltaHandlingPolicy: string;
};

export type PartialFunnelStep = {
  title: string;
  funnel_step_id: number;
};

const initRange = distanceRange({
  distance: 7,
  future: true,
});

function usePortfolioController(): Record<string, any> {
  // meta information: name, description, dates
  const initialState: FormValues = {
    title: '',
    description: '',
    startDate: initRange.dateFrom,
    endDate: initRange.dateTo,
    goal: NexoyaFunnelStepType.Conversion,
    budgets: {},
    optimizationType: budgetOptimizationType.AUTOMATIC,
    optimizationRiskLevel: budgetRiskType.MODERATE,
    type: NexoyaPortfolioType.Budget,
    budgetDeltaHandlingPolicy: 'IGNORE',
  };
  const initialPortfolioState = { data: null, loading: true, error: null };

  const [portfolioState, setPortfolioState] = useState(initialPortfolioState);
  const [portfolioMetaState, setPortfolioMetaState] = useState(initialPortfolioState);
  const [portfolioV2FunnelStepsState, setPortfolioV2FunnelStepsState] = useState(initialPortfolioState);
  const [portfolioV2ContentMetricsState, setPortfolioV2ContentMetricsState] = useState(initialPortfolioState);

  const [meta, setMeta] = useState<FormValues>(initialState);
  const [type, setType] = useState<NexoyaPortfolioType | 'target-based' | null>(null);
  const [selectedFunnelStep, setSelectedFunnelStep] = useState<PartialFunnelStep | null | undefined>(null);
  const [visiblePlannedChart, setVisiblePlannedChart] = useState<boolean>(true);

  const [showEvents, setShowEventsState] = useState<boolean>(true);
  const [showEventsParam, setShowEventsParam] = useQueryParam('showEvents', BooleanParam);

  const [providersFilter, setProvidersFilter] = useState<NexoyaProvider[]>([]);
  const [activePredictionChart, setActivePredictionChart] = useState<ValidationChartType>(
    VALIDATION_CHART_SECTIONS[0].id,
  );

  useEffect(() => {
    if (showEventsParam !== undefined) {
      setShowEventsState(showEventsParam);
    }
  }, [showEventsParam]);

  const setShowEvents = useCallback(
    (value: boolean) => {
      setShowEventsParam(value);
    },
    [setShowEventsParam],
  );

  const handleChange = useCallback(
    (ev: any) => {
      const { name, value } = ev.target;
      setMeta((s) => ({ ...s, [name]: value }));
    },
    [setMeta],
  );
  const handleBudgetChange = useCallback(
    (ev: any) => {
      const { name, value } = ev.target;
      setMeta((s) => ({
        ...s,
        budgets: {
          ...s.budgets,
          [name]: validateNumberInput(value) ? value.replace(/^0+(?!\.|$)/, '') : s.budgets[name] || 0,
        },
      }));
    },
    [setMeta],
  );

  const handleAddProvider = useCallback(
    (provider: NexoyaProvider) => {
      setProvidersFilter((prevState) => [...prevState, provider]);
    },
    [setProvidersFilter],
  );

  const handleRemoveProvider = useCallback(
    (provider: NexoyaProvider) => {
      setProvidersFilter((prevState) => [...prevState.filter((f) => f.provider_id !== provider.provider_id)]);
    },
    [setProvidersFilter],
  );

  const handleResetProvideFilterState = useCallback(() => {
    setProvidersFilter([]);
  }, [setProvidersFilter]);

  function handleDateChange({ from, to }) {
    setMeta({ ...meta, startDate: from, endDate: to });
  }

  const contentSelection = useContentSelectionController();

  // reset controller state
  function reset() {
    setMeta(initialState);
    contentSelection.reset();
    setType(null);
  }

  // sums budget entered per provider, having in mind selected content
  const getSummedBudget = useCallback(() => {
    return Object.keys(meta.budgets).reduce((acc, currItem) => {
      if (
        contentSelection.selected.findIndex((item) => {
          return get(item, 'provider.provider_id') === parseInt(currItem);
        }) > -1
      ) {
        return meta.budgets[currItem] ? acc + parseFloat(meta.budgets[currItem]) : acc;
      }

      return acc + parseFloat('0');
    }, 0);
  }, [meta.budgets, contentSelection.selected]);

  return {
    portfolioInfo: {
      data: portfolioState.data,
      loading: portfolioState.loading,
      error: portfolioState.error,
      updateState: setPortfolioState,
    },
    portfolioV2Info: {
      meta: {
        data: portfolioMetaState.data,
        loading: portfolioMetaState.loading,
        error: portfolioMetaState.error,
        updateState: setPortfolioMetaState,
      },
      funnelSteps: {
        data: portfolioV2FunnelStepsState.data,
        loading: portfolioV2FunnelStepsState.loading,
        error: portfolioV2FunnelStepsState.error,
        updateState: setPortfolioV2FunnelStepsState,
      },
      contentMetrics: {
        data: portfolioV2ContentMetricsState.data,
        loading: portfolioV2ContentMetricsState.loading,
        error: portfolioV2ContentMetricsState.error,
        updateState: setPortfolioV2ContentMetricsState,
      },
    },
    meta: {
      value: meta,
      handleChange,
      handleBudgetChange,
      handleDateChange,
    },
    portfolioType: {
      type,
      setType,
    },
    contentSelection,
    selectedFunnelStep: {
      selectedFunnelStep,
      setSelectedFunnelStep,
    },
    performanceChart: {
      showEvents,
      setShowEvents,
    },
    budgetChart: {
      visiblePlannedChart,
      setVisiblePlannedChart,
    },
    predictionChart: {
      activePredictionChart,
      setActivePredictionChart,
    },
    reset,
    getSummedBudget,
    providers: {
      providersFilter,
      handleAddProvider,
      handleRemoveProvider,
      handleResetProvideFilterState,
    },
  };
}

export default usePortfolioController;
