import { Meta, StoryFn } from '@storybook/react';
import React, { useEffect } from 'react';

import { NumericArrayParam, useQueryParam } from 'use-query-params';

import { ExtendedNexoyaSimulationScenario, NexoyaFunnelStepType, NexoyaScenarioReliabilityLabel } from '../types';

import { CompareScenariosTable } from '../routes/portfolio/components/Simulations/table/CompareScenariosTable';
import { mock_decorators } from '../../.storybook/preview.jsx';

export default {
  title: 'Simulation/CompareScenariosTable',
  component: CompareScenariosTable,
  decorators: mock_decorators(),
} as Meta;
const Template: StoryFn = ({ scenarios }: { scenarios: ExtendedNexoyaSimulationScenario[] }) => {
  const [, setComparisonIds] = useQueryParam('comparisonIds', NumericArrayParam);

  useEffect(() => {
    setComparisonIds([]);
  }, []);
  return <CompareScenariosTable scenarios={scenarios} />;
};

export const Default = Template.bind({});
Default.args = {
  scenarios: [
    {
      idx: 1,
      isBaseScenario: true,
      budget: {
        totals: {
          currentScenarioTotal: 1000000,
          changePercentTotal: 5,
        },
      },
      reliabilityLabel: NexoyaScenarioReliabilityLabel.High,
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
            type: 'conversion' as NexoyaFunnelStepType,
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
            type: 'click' as NexoyaFunnelStepType,
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
      scenarioId: 1,
    },
    {
      idx: 2,
      isBaseScenario: false,
      budget: {
        totals: {
          currentScenarioTotal: 1100000,
          changePercentTotal: 10,
        },
      },
      targetFunnelStep: {
        roas: {
          currentScenario: 1.65,
          changePercent: 15,
          currentScenarioPredictionRange: {
            highChangePercent: 18,
            lowChangePercent: 12,
            high: 1.95,
            low: 1.35,
          },
        },
        funnelStep: {
          funnelStepId: 'step1',
        },
      },
      reliabilityLabel: NexoyaScenarioReliabilityLabel.Medium,
      funnelSteps: [
        {
          funnelStep: {
            funnelStepId: 'step1',
            title: 'Step 1',
            type: 'conversion' as NexoyaFunnelStepType,
          },
          total: {
            currentScenario: 5500,
            changePercent: 3,
            currentScenarioPredictionRange: {
              highChangePercent: 4,
              lowChangePercent: 2,
              high: 5720,
              low: 5100,
            },
          },
          costPer: {
            currentScenario: 180,
            changePercent: -2,
            lowerIsBetter: true,
            currentScenarioPredictionRange: {
              highChangePercent: -1,
              lowChangePercent: -3,
              high: 185,
              low: 175,
            },
          },
          isTarget: true,
        },
        {
          funnelStep: {
            funnelStepId: 'step2',
            title: 'Step 2',
            type: 'click' as NexoyaFunnelStepType,
          },
          total: {
            currentScenario: 10500,
            changePercent: 6,
            currentScenarioPredictionRange: {
              highChangePercent: 8,
              lowChangePercent: 4,
              high: 11300,
              low: 9900,
            },
          },
          costPer: {
            currentScenario: 95,
            changePercent: -3,
            lowerIsBetter: true,
            currentScenarioPredictionRange: {
              highChangePercent: -2,
              lowChangePercent: -4,
              high: 97,
              low: 91,
            },
          },
          isTarget: false,
        },
      ],
      scenarioId: 2,
    },
    {
      idx: 3,
      isBaseScenario: false,
      budget: {
        totals: {
          currentScenarioTotal: 1200000,
          changePercentTotal: 15,
        },
      },
      targetFunnelStep: {
        roas: {
          currentScenario: 1.8,
          changePercent: 20,
          currentScenarioPredictionRange: {
            highChangePercent: 22,
            lowChangePercent: 18,
            high: 2.2,
            low: 1.4,
          },
        },
        funnelStep: {
          funnelStepId: 'step1',
        },
      },
      reliabilityLabel: NexoyaScenarioReliabilityLabel.Low,
      funnelSteps: [
        {
          funnelStep: {
            funnelStepId: 'step1',
            title: 'Step 1',
            type: 'conversion' as NexoyaFunnelStepType,
          },
          total: {
            currentScenario: 6000,
            changePercent: 4,
            currentScenarioPredictionRange: {
              highChangePercent: 5,
              lowChangePercent: 3,
              high: 6200,
              low: 5800,
            },
          },
          costPer: {
            currentScenario: 160,
            changePercent: -3,
            lowerIsBetter: true,
            currentScenarioPredictionRange: {
              highChangePercent: -2,
              lowChangePercent: -4,
              high: 165,
              low: 155,
            },
          },
          isTarget: true,
        },
        {
          funnelStep: {
            funnelStepId: 'step2',
            title: 'Step 2',
            type: 'click' as NexoyaFunnelStepType,
          },
          total: {
            currentScenario: 11000,
            changePercent: 7,
            currentScenarioPredictionRange: {
              highChangePercent: 9,
              lowChangePercent: 5,
              high: 11800,
              low: 10400,
            },
          },
          costPer: {
            currentScenario: 90,
            changePercent: -4,
            lowerIsBetter: true,
            currentScenarioPredictionRange: {
              highChangePercent: -3,
              lowChangePercent: -5,
              high: 92,
              low: 88,
            },
          },
          isTarget: false,
        },
      ],
      scenarioId: 3,
    },
    {
      idx: 4,
      isBaseScenario: false,
      budget: {
        totals: {
          currentScenarioTotal: 1300000,
          changePercentTotal: 20,
        },
      },
      targetFunnelStep: {
        roas: {
          currentScenario: 1.95,
          changePercent: 25,
          currentScenarioPredictionRange: {
            highChangePercent: 28,
            lowChangePercent: 22,
            high: 2.5,
            low: 1.8,
          },
        },
        funnelStep: {
          funnelStepId: 'step1',
        },
      },
      reliabilityLabel: NexoyaScenarioReliabilityLabel.Medium,
      funnelSteps: [
        {
          funnelStep: {
            funnelStepId: 'step1',
            title: 'Step 1',
            type: 'conversion' as NexoyaFunnelStepType,
          },
          total: {
            currentScenario: 6500,
            changePercent: 5,
            currentScenarioPredictionRange: {
              highChangePercent: 6,
              lowChangePercent: 4,
              high: 6700,
              low: 6300,
            },
          },
          costPer: {
            currentScenario: 150,
            changePercent: -4,
            lowerIsBetter: true,
            currentScenarioPredictionRange: {
              highChangePercent: -3,
              lowChangePercent: -5,
              high: 155,
              low: 145,
            },
          },
          isTarget: true,
        },
        {
          funnelStep: {
            funnelStepId: 'step2',
            title: 'Step 2',
            type: 'click' as NexoyaFunnelStepType,
          },
          total: {
            currentScenario: 11500,
            changePercent: 8,
            currentScenarioPredictionRange: {
              highChangePercent: 10,
              lowChangePercent: 6,
              high: 12300,
              low: 10700,
            },
          },
          costPer: {
            currentScenario: 85,
            changePercent: -5,
            lowerIsBetter: true,
            currentScenarioPredictionRange: {
              highChangePercent: -4,
              lowChangePercent: -6,
              high: 88,
              low: 82,
            },
          },
          isTarget: false,
        },
      ],
      scenarioId: 4,
    },
    {
      idx: 5,
      isBaseScenario: false,
      budget: {
        totals: {
          currentScenarioTotal: 1400000,
          changePercentTotal: 25,
        },
      },
      targetFunnelStep: {
        roas: {
          currentScenario: 2.1,
          changePercent: 30,
          currentScenarioPredictionRange: {
            highChangePercent: 33,
            lowChangePercent: 27,
            high: 2.8,
            low: 2.0,
          },
        },
        funnelStep: {
          funnelStepId: 'step1',
        },
      },
      reliabilityLabel: NexoyaScenarioReliabilityLabel.High,
      funnelSteps: [
        {
          funnelStep: {
            funnelStepId: 'step1',
            title: 'Step 1',
            type: 'conversion' as NexoyaFunnelStepType,
          },
          total: {
            currentScenario: 7000,
            changePercent: 6,
            currentScenarioPredictionRange: {
              highChangePercent: 7,
              lowChangePercent: 5,
              high: 7200,
              low: 6800,
            },
          },
          costPer: {
            currentScenario: 140,
            changePercent: -5,
            lowerIsBetter: true,
            currentScenarioPredictionRange: {
              highChangePercent: -4,
              lowChangePercent: -6,
              high: 145,
              low: 135,
            },
          },
          isTarget: true,
        },
        {
          funnelStep: {
            funnelStepId: 'step2',
            title: 'Step 2',
            type: 'click' as NexoyaFunnelStepType,
          },
          total: {
            currentScenario: 12000,
            changePercent: 9,
            currentScenarioPredictionRange: {
              highChangePercent: 11,
              lowChangePercent: 7,
              high: 12800,
              low: 11200,
            },
          },
          costPer: {
            currentScenario: 80,
            changePercent: -6,
            lowerIsBetter: true,
            currentScenarioPredictionRange: {
              highChangePercent: -5,
              lowChangePercent: -7,
              high: 84,
              low: 78,
            },
          },
          isTarget: false,
        },
      ],
      scenarioId: 5,
    },
  ] as unknown as Partial<ExtendedNexoyaSimulationScenario>[],
};
