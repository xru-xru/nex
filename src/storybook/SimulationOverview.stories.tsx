import { Meta, StoryFn } from '@storybook/react';

import { NexoyaScenarioReliabilityLabel } from '../types';

import SimulationOverview, { AxisMetric } from '../routes/portfolio/components/Simulations/charts/SimulationOverview';

export default {
  title: 'Simulation/SimulationOverview',
  component: SimulationOverview,
  argTypes: {
    selectedScenarioId: { control: 'number' },
    axisMetrics: { control: 'array' },
  },
} as Meta;

const Template: StoryFn<{
  selectedScenarioId: number;
  axisMetrics: {
    xAxis: AxisMetric;
    yAxis: AxisMetric;
  }[];
}> = (args) => <SimulationOverview {...args} />;

export const Default = Template.bind({});
Default.args = {
  selectedScenarioId: 1,
  axisMetrics: [
    {
      xAxis: {
        baseScenario: 1000,
        changePercent: 5,
        currentScenario: 1050,
        scenarioId: 1,
        name: 'Metric X',
        isBaseScenario: true,
        label: NexoyaScenarioReliabilityLabel.High,
      },
      yAxis: {
        baseScenario: 2000,
        changePercent: 10,
        currentScenario: 2200,
        scenarioId: 1,
        name: 'Metric Y',
        isBaseScenario: true,
        label: NexoyaScenarioReliabilityLabel.High,
      },
    },
    {
      xAxis: {
        baseScenario: 1050,
        changePercent: 10,
        currentScenario: 1155,
        scenarioId: 2,
        name: 'Metric X',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
      yAxis: {
        baseScenario: 2200,
        changePercent: 15,
        currentScenario: 2530,
        scenarioId: 2,
        name: 'Metric Y',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
    },
    {
      xAxis: {
        baseScenario: 1155,
        changePercent: 15,
        currentScenario: 1328.25,
        scenarioId: 3,
        name: 'Metric X',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
      yAxis: {
        baseScenario: 2530,
        changePercent: 20,
        currentScenario: 3036,
        scenarioId: 3,
        name: 'Metric Y',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
    },
    {
      xAxis: {
        baseScenario: 1328.25,
        changePercent: 20,
        currentScenario: 1593.9,
        scenarioId: 4,
        name: 'Metric X',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
      yAxis: {
        baseScenario: 3036,
        changePercent: 25,
        currentScenario: 3795,
        scenarioId: 4,
        name: 'Metric Y',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
    },
    {
      xAxis: {
        baseScenario: 1593.9,
        changePercent: 25,
        currentScenario: 1992.38,
        scenarioId: 5,
        name: 'Metric X',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
      yAxis: {
        baseScenario: 3795,
        changePercent: 30,
        currentScenario: 4933.5,
        scenarioId: 5,
        name: 'Metric Y',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
    },
    {
      xAxis: {
        baseScenario: 1992.38,
        changePercent: 30,
        currentScenario: 2590.09,
        scenarioId: 6,
        name: 'Metric X',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
      yAxis: {
        baseScenario: 4933.5,
        changePercent: 35,
        currentScenario: 6660.23,
        scenarioId: 6,
        name: 'Metric Y',
        isBaseScenario: false,
        label: NexoyaScenarioReliabilityLabel.High,
      },
    },
  ],
};
