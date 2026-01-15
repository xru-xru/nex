import { toNumber } from 'lodash';

import {
  NexoyaFunnelStepType,
  NexoyaScenarioFunnelStep,
  NexoyaScenarioReliabilityLabel,
  NexoyaSimulationBudgetPreview,
  NexoyaSimulationScenario,
  NexoyaSimulationState,
} from '../../../types';

import { ScenarioCreationBudget } from '../../../controllers/SimulationController';
import { NumberType } from '../components/Simulations/charts/MetricOverview';

import { nexyColors } from '../../../theme';

export const AXIS_COST_PER_KEYWORD = '_cost';
export const AXIS_BUDGET_KEYWORD = 'budget';
export const AXIS_ROAS_KEYWORD = 'portfolio roas';

export const getAccuracyColorByLabel = (label: NexoyaScenarioReliabilityLabel) => {
  switch (label) {
    case NexoyaScenarioReliabilityLabel.High:
      return '#88E7B7';
    case NexoyaScenarioReliabilityLabel.Medium:
      return '#FAE580';
    case NexoyaScenarioReliabilityLabel.Low:
      return '#F490A9';
    default:
      return '#C7C8D1';
  }
};

export const getFormattedState = (state: NexoyaSimulationState): { color: string; label: string } => {
  switch (state) {
    case NexoyaSimulationState.Completed:
      return {
        color: '#88E7B7',
        label: 'Ready to explore',
      };
    case NexoyaSimulationState.Applied:
      return {
        color: nexyColors.lightBlue200,
        label: 'Scenario applied',
      };
    case NexoyaSimulationState.Pending:
      return {
        color: '#829EF3',
        label: 'Ready to simulate',
      };
    case NexoyaSimulationState.Running:
      return {
        color: '#FAE580',
        label: 'Simulating',
      };
    default:
      return {
        color: nexyColors.frenchGray,
        label: 'Unknown state',
      };
  }
};

export const createAxisOptions = ({ funnelSteps }: { funnelSteps: NexoyaScenarioFunnelStep[] }) => {
  return [
    {
      title: 'Budget',
      id: 'budget',
    },
  ].concat(
    funnelSteps?.flatMap((step) => ({
      title: step.funnelStep.title,
      id: step.funnelStep.funnelStepId?.toString(),
    })),
    funnelSteps?.flatMap((step) => ({
      title: `Cost-per ${step.funnelStep.title}`,
      id: step.funnelStep.funnelStepId?.toString() + AXIS_COST_PER_KEYWORD,
    })),
  );
};

export const getValueBasedOnAxis = ({
  scenario,
  axis,
}: {
  scenario: NexoyaSimulationScenario;
  axis: string;
}): {
  baseScenario: number;
  currentScenario: number;
  changePercent: number;
  reliabilityLabel?: NexoyaScenarioReliabilityLabel;
  name: string;
} => {
  if (axis === AXIS_BUDGET_KEYWORD) {
    return {
      baseScenario: scenario.budget?.totals?.baseScenarioTotal,
      currentScenario: scenario.budget?.totals?.currentScenarioTotal,
      changePercent: scenario.budget?.totals?.changePercentTotal,
      name: 'Budget',
    };
  }

  const accessorBasedOnSelectedFunnelStepAxis = axis?.includes(AXIS_COST_PER_KEYWORD) ? 'costPer' : 'total';

  const scenarioFunnelStep = scenario?.funnelSteps?.find(
    (step) => step?.funnelStep?.funnelStepId?.toString() === axis?.replace(AXIS_COST_PER_KEYWORD, ''),
  );

  return {
    baseScenario: scenarioFunnelStep?.[accessorBasedOnSelectedFunnelStepAxis]?.baseScenario,
    currentScenario: scenarioFunnelStep?.[accessorBasedOnSelectedFunnelStepAxis]?.currentScenario,
    changePercent: scenarioFunnelStep?.[accessorBasedOnSelectedFunnelStepAxis]?.changePercent,
    reliabilityLabel: scenario?.reliabilityLabel,
    name: `${accessorBasedOnSelectedFunnelStepAxis === 'costPer' ? 'Cost per' : ''} ${scenarioFunnelStep?.funnelStep?.title}`,
  };
};

export const getSelectedMetric = (scenario: NexoyaSimulationScenario, scenarioSelectedMetric: string) => {
  switch (scenarioSelectedMetric) {
    case AXIS_ROAS_KEYWORD:
      return scenario?.targetFunnelStep?.dailyMetrics?.map((dailyMetric) => ({
        ...dailyMetric,
        value: dailyMetric?.roas,
      }));
    case AXIS_BUDGET_KEYWORD:
      return scenario?.budget?.dailyMetrics;
    default:
      return scenario?.funnelSteps?.find(
        (funnelStep) => funnelStep?.funnelStep?.title?.toLowerCase() === scenarioSelectedMetric?.toLowerCase(),
      )?.dailyMetrics;
  }
};

export const getNumberType = (metric: string): NumberType => {
  switch (metric) {
    case AXIS_ROAS_KEYWORD:
      return 'percentage';
    case 'Budget':
      return 'currency';
    default:
      return 'number';
  }
};

export const isEditSimulationDisabled = (state: NexoyaSimulationState) => {
  if (!state) {
    return false;
  }

  if (state !== NexoyaSimulationState.Pending) {
    return true;
  }
};

export const getMetricTitle = (scenarioMetricSwitch, scenarioSelectedMetric) => {
  const metricLower = scenarioSelectedMetric.toLowerCase();
  if (scenarioMetricSwitch === 'cost-per') {
    return metricLower === AXIS_BUDGET_KEYWORD || metricLower === AXIS_ROAS_KEYWORD
      ? scenarioSelectedMetric
      : `Cost-per ${scenarioSelectedMetric}`;
  }
  return scenarioSelectedMetric;
};

export const getCostPerTitleBasedOnType = (type: NexoyaFunnelStepType) => {
  switch (type) {
    case NexoyaFunnelStepType.Awareness:
      return 'CPM ';
    case NexoyaFunnelStepType.ConversionValue:
      return 'Ratio-per ';
    default:
      return 'Cost-per ';
  }
};

export const findAppliedScenario = (scenarios: NexoyaSimulationScenario[]) => {
  return scenarios?.find((scenario) => scenario.isApplied);
};

export const hasCustomScenarioDuplicates = (
  customScenario: ScenarioCreationBudget,
  selectedSimulationSteps: NexoyaSimulationBudgetPreview,
  currentIndex: number,
  scenarios: ScenarioCreationBudget[],
) => {
  return (
    selectedSimulationSteps?.budgets?.some(
      (s, index) =>
        s?.budget === toNumber(customScenario?.value) && !customScenario?.isPersisted && index !== currentIndex,
    ) || scenarios?.some((s, index) => s.value === customScenario.value && index !== currentIndex)
  );
};
