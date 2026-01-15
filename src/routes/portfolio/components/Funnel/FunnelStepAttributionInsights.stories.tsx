import { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';
import { FunnelStepAttributionInsights } from './FunnelStepAttributionInsights';
import { mock_decorators } from '../../../../../.storybook/preview.jsx';
import {
  NexoyaDailyMetric,
  NexoyaDailyOptimizationMetric,
  NexoyaFunnelStepPerformance,
  NexoyaFunnelStepType,
  NexoyaFunnelStepV2,
  NexoyaMetricTotal,
} from '../../../../types';

export default {
  title: 'Portfolio/Funnel/Attribution Insights',
  component: FunnelStepAttributionInsights,
  decorators: mock_decorators,
  parameters: {
    docs: {
      description: {
        component:
          'Attribution Insights dialog showing Media Mix Modelling attribution per content type with measured vs attributed leads comparison.',
      },
    },
    controls: {
      sort: 'requiredFirst',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
      description: 'Controls whether the dialog is open',
      defaultValue: true,
    },
    onClose: {
      action: 'onClose',
      description: 'Callback function called when dialog is closed',
    },
    performanceFunnelSteps: {
      control: 'object',
      description: 'Array of funnel step performance data (currently not used, component uses mocked data)',
    },
  },
} as Meta;

// Mock data that matches the NexoyaFunnelStepPerformance type
const mockFunnelStepV2: NexoyaFunnelStepV2 = {
  __typename: 'FunnelStepV2',
  funnelStepId: 1,
  isAttributed: true,
  title: 'Leads',
  type: NexoyaFunnelStepType.Lead,
};

const mockDailyMetrics: NexoyaDailyMetric[] = [
  {
    __typename: 'DailyMetric',
    cost: 1500.0,
    date: '2024-01-01',
    impressions: 50000,
    value: 250,
  },
];

const mockDailyOptimizationMetrics: NexoyaDailyOptimizationMetric[] = [
  {
    __typename: 'DailyOptimizationMetric',
    cost: 1500.0,
    date: '2024-01-01',
    impressions: 50000,
    value: 250,
  },
];

const mockMetricTotals: NexoyaMetricTotal = {
  __typename: 'MetricTotal',
  cost: 45000.0,
  impressions: 1500000,
  value: 7500,
};

const mockPerformanceFunnelSteps: NexoyaFunnelStepPerformance[] = [
  {
    __typename: 'FunnelStepPerformance',
    funnelStep: mockFunnelStepV2,
    dailyMetrics: mockDailyMetrics,
    dailyOptimizationMetrics: mockDailyOptimizationMetrics,
    metricTotals: mockMetricTotals,
    optimizationMetricTotals: null,
  },
];

const Template: StoryFn<typeof FunnelStepAttributionInsights> = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  const handleClose = () => {
    setIsOpen(false);
    args.onClose?.();
  };

  const handleReopen = () => {
    setIsOpen(true);
  };

  return (
    <div className="p-4">
      {!isOpen && (
        <button onClick={handleReopen} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Open Attribution Insights
        </button>
      )}
      <FunnelStepAttributionInsights {...args} isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  performanceFunnelSteps: mockPerformanceFunnelSteps,
};

export const ClosedDialog = Template.bind({});
ClosedDialog.args = {
  isOpen: false,
  performanceFunnelSteps: mockPerformanceFunnelSteps,
};

export const WithoutPerformanceData = Template.bind({});
WithoutPerformanceData.args = {
  isOpen: true,
  performanceFunnelSteps: undefined,
};
