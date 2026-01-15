import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { ExtendedNexoyaSimulationScenario, NexoyaScenarioReliabilityLabel } from '../types';

import { ScenarioMetricsPanel } from '../routes/portfolio/components/Simulations/ScenarioMetricsPanel';
import { mock_decorators } from '../../.storybook/preview.jsx';

export default {
  title: 'Simulation/ScenarioMetricsPanel',
  component: ScenarioMetricsPanel,
  decorators: mock_decorators(),
  argTypes: {
    scenario: { control: 'object' },
    start: { control: 'date' },
    end: { control: 'date' },
    portfolioId: { control: 'number' },
    simulationId: { control: 'number' },
  },
} as Meta;

const Template: StoryFn = (args: {
  scenario: ExtendedNexoyaSimulationScenario;
  start: Date;
  end: Date;
  portfolioId: number;
  simulationId: number;
}) => <ScenarioMetricsPanel {...args} />;

export const Default = Template.bind({});
Default.args = {
  scenario: {
    idx: 1,
    isBaseScenario: false,
    budget: {
      totals: {
        currentScenarioTotal: 1000000,
        changePercentTotal: 5,
      },
    },
    targetFunnelStep: {
      roas: {
        currentScenario: 1.5,
        changePercent: 10,
        currentScenarioPredictionRange: {
          highChangePercent: 15,
          lowChangePercent: 5,
          high: 1.75,
          low: 1.25,
        },
      },
      funnelStep: {
        funnelStepId: 'step1',
      },
    },
    funnelSteps: [
      {
        funnelStep: {
          funnelStepId: 'step1',
          title: 'Step 1',
          type: 'conversion',
        },
        total: {
          currentScenario: 5000,
          changePercent: 2,
          currentScenarioPredictionRange: {
            highChangePercent: 3,
            lowChangePercent: 1,
            high: 5200,
            low: 4800,
          },
        },
        costPer: {
          currentScenario: 200,
          changePercent: -1,
          lowerIsBetter: true,
          currentScenarioPredictionRange: {
            highChangePercent: 0,
            lowChangePercent: -2,
            high: 200,
            low: 180,
          },
        },
        isTarget: true,
      },
      {
        funnelStep: {
          funnelStepId: 'step2',
          title: 'Step 2',
          type: 'click',
        },
        total: {
          currentScenario: 10000,
          changePercent: 5,
          currentScenarioPredictionRange: {
            highChangePercent: 7,
            lowChangePercent: 3,
            high: 10700,
            low: 9700,
          },
        },
        costPer: {
          currentScenario: 100,
          changePercent: -2,
          lowerIsBetter: true,
          currentScenarioPredictionRange: {
            highChangePercent: -1,
            lowChangePercent: -3,
            high: 99,
            low: 97,
          },
        },
        isTarget: false,
      },
    ],
    reliabilityLabel: NexoyaScenarioReliabilityLabel.High,
    scenarioId: 1,
  } as unknown as Partial<ExtendedNexoyaSimulationScenario>,
  start: new Date('2023-01-01'),
  end: new Date('2023-12-31'),
  simulationId: 1,
  portfolioId: 1,
};
