import { Meta, StoryFn } from '@storybook/react';

import { NexoyaScenarioDailyBudget, NexoyaScenarioDailyMetric } from 'types/types';

import { MetricOverview, NumberType } from '../routes/portfolio/components/Simulations/charts/MetricOverview';
import { mock_decorators } from '../../.storybook/preview.jsx';

export default {
  title: 'Simulation/MetricOverview',
  component: MetricOverview,
  decorators: mock_decorators(),
  argTypes: {
    dailyMetrics: { control: 'array' },
    isBaseScenarioSelected: { control: 'boolean' },
    title: { control: 'text' },
    numberType: {
      control: { type: 'select', options: ['currency', 'percentage', 'number'] },
    },
    metricSwitch: {
      control: { type: 'select', options: ['costPer', 'value'] },
    },
  },
} as Meta;

const Template: StoryFn<{
  dailyMetrics: NexoyaScenarioDailyBudget[] | NexoyaScenarioDailyMetric[];
  isBaseScenarioSelected: boolean;
  title: string;
  numberType: NumberType;
  metricSwitch: 'costPer' | 'value';
}> = (args) => <MetricOverview {...args} />;

export const Default = Template.bind({});
Default.args = {
  dailyMetrics: [
    {
      day: '2024-01-01',
      baseScenario: 1000,
      currentScenario: 1100,
      __typename: 'ScenarioDailyBudget',
    },
    {
      day: '2024-01-02',
      baseScenario: 1200,
      currentScenario: 1150,
      __typename: 'ScenarioDailyBudget',
    },
    {
      day: '2024-01-03',
      baseScenario: 1300,
      currentScenario: 1250,
      __typename: 'ScenarioDailyBudget',
    },
    {
      day: '2024-01-04',
      baseScenario: 1400,
      currentScenario: 1350,
      __typename: 'ScenarioDailyBudget',
    },
    {
      day: '2024-01-05',
      baseScenario: 1500,
      currentScenario: 1450,
      __typename: 'ScenarioDailyBudget',
    },
    {
      day: '2024-01-06',
      baseScenario: 1600,
      currentScenario: 1550,
      __typename: 'ScenarioDailyBudget',
    },
    {
      day: '2024-01-07',
      baseScenario: 1700,
      currentScenario: 1650,
      __typename: 'ScenarioDailyBudget',
    },
    {
      day: '2024-01-08',
      baseScenario: 1800,
      currentScenario: 1750,
      __typename: 'ScenarioDailyBudget',
    },
    {
      day: '2024-01-09',
      baseScenario: 1900,
      currentScenario: 1850,
      __typename: 'ScenarioDailyBudget',
    },
    {
      day: '2024-01-10',
      baseScenario: 2000,
      currentScenario: 1950,
      __typename: 'ScenarioDailyBudget',
    },
  ] as NexoyaScenarioDailyBudget[],
  isBaseScenarioSelected: true,
  title: 'Daily Budget',
  numberType: 'currency',
  metricSwitch: 'value',
};
