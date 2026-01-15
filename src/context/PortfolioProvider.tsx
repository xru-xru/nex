import React from 'react';

import {
  NexoyaBudgetDeltaHandlingPolicy,
  NexoyaFunnelStepPerformance,
  NexoyaFunnelStepType,
  NexoyaPortfolio,
  NexoyaPortfolioPerformance,
  NexoyaPortfolioType,
  NexoyaPortfolioV2,
  NexoyaProvider,
} from '../types';

import usePortfolioController from '../controllers/PortfolioController';

type FormValues = {
  title: string;
  type: NexoyaPortfolioType;
  description: string;
  startDate: Date;
  endDate: Date;
  goal: string;
  optimizationType: string;
  optimizationRiskLevel: number;
  budgetDeltaHandlingPolicy: NexoyaBudgetDeltaHandlingPolicy;
};

interface NexoyaProviderWithLogo extends NexoyaProvider {
  providerLogoColor: string;
}

interface PartialFunnelStep extends NexoyaFunnelStepPerformance {
  title: string;
  funnel_step_id: any;
  type: NexoyaFunnelStepType;
}

interface QueryInfo<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  updateState: ({ data, loading, error }: { data: T; loading?: boolean; error?: any }) => void;
}

type PortfolioInfo = QueryInfo<NexoyaPortfolio>;

type PortfolioV2MetaInfo = QueryInfo<NexoyaPortfolioV2>;

type PortfolioV2FunnelStepsInfo = QueryInfo<NexoyaFunnelStepPerformance[]>; // Update with proper structure

type PortfolioV2ContentMetricsInfo = QueryInfo<NexoyaPortfolioPerformance>; // Update with proper structure

export type ValidationChartType = 'time-based' | 'prediction-details' | 'prediction-timeline' | 'achieved-predicted';

interface PortfolioV2Info {
  meta: PortfolioV2MetaInfo;
  funnelSteps: PortfolioV2FunnelStepsInfo;
  contentMetrics: PortfolioV2ContentMetricsInfo;
}

interface MetaInfo {
  value: FormValues;
  handleChange: any;
  handleBudgetChange: any;
  // @ts-ignore
  handleDateChange: ({ from: Date, to: Date }) => void;
}

interface SelectedFunnelStep {
  selectedFunnelStep: PartialFunnelStep | null;
  setSelectedFunnelStep: React.Dispatch<React.SetStateAction<Partial<PartialFunnelStep> | null>>;
}

interface BudgetChart {
  visiblePlannedChart: boolean;
  setVisiblePlannedChart: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PredictionChart {
  activePredictionChart: ValidationChartType;
  setActivePredictionChart: React.Dispatch<React.SetStateAction<ValidationChartType>>;
}

interface PerformanceChart {
  showEvents: boolean;
  setShowEvents: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Providers {
  providersFilter: NexoyaProviderWithLogo[];
  handleAddProvider: (provider: NexoyaProviderWithLogo) => void;
  handleRemoveProvider: (provider: NexoyaProviderWithLogo) => void;
  handleResetProvideFilterState: () => void;
}

interface IPortfolioContext {
  portfolioInfo: PortfolioInfo;
  portfolioV2Info: PortfolioV2Info;
  meta: MetaInfo;
  contentSelection: any; // TODO: Update with proper type
  portfolioType: {
    type: NexoyaPortfolioType | 'target-based' | null;
    setType: React.Dispatch<React.SetStateAction<NexoyaPortfolioType | 'target-based' | null>>;
  };
  selectedFunnelStep: SelectedFunnelStep;
  predictionChart: PredictionChart;
  budgetChart: BudgetChart;
  performanceChart: PerformanceChart;
  reset: () => void;
  getSummedBudget: () => number;
  providers: Providers;
}

const defaultValue: IPortfolioContext = {
  portfolioInfo: { data: null, loading: true, error: null, updateState: () => {} },
  portfolioType: {
    type: null,
    setType: () => {},
  },
  portfolioV2Info: {
    meta: { data: null, loading: true, error: null, updateState: () => {} },
    funnelSteps: { data: null, loading: true, error: null, updateState: () => {} },
    contentMetrics: { data: null, loading: true, error: null, updateState: () => {} },
  },
  meta: {
    value: {} as FormValues,
    handleChange: () => {},
    handleBudgetChange: () => {},
    handleDateChange: () => {},
  },
  contentSelection: {},
  selectedFunnelStep: {
    selectedFunnelStep: null,
    setSelectedFunnelStep: () => {},
  },
  predictionChart: {
    activePredictionChart: 'time-based',
    setActivePredictionChart: () => {},
  },
  budgetChart: {
    visiblePlannedChart: false,
    setVisiblePlannedChart: () => {},
  },
  performanceChart: {
    showEvents: false,
    setShowEvents: () => {},
  },
  reset: () => {},
  getSummedBudget: () => 0,
  providers: {
    providersFilter: [],
    handleAddProvider: () => {},
    handleRemoveProvider: () => {},
    handleResetProvideFilterState: () => {},
  },
};

const PortfolioContext = React.createContext<IPortfolioContext | null>(defaultValue);

function PortfolioProvider(props: any) {
  const value = usePortfolioController();
  return <PortfolioContext.Provider value={value || defaultValue} {...props} />;
}

function withPortfolioProvider(Component: any) {
  return (props: any) => (
    <PortfolioProvider>
      <Component {...props} />
    </PortfolioProvider>
  );
}

function usePortfolio(): IPortfolioContext {
  const context = React.useContext(PortfolioContext);

  if (context === null) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }

  return context;
}

export { PortfolioProvider, usePortfolio, withPortfolioProvider };
