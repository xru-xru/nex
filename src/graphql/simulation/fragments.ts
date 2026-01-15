import { gql } from '@apollo/client';

export const SCENARIO_METRICS = gql`
  fragment ScenarioMetric on ScenarioMetric {
    baseScenario
    changePercent
    currentScenario
    lowerIsBetter
  }
`;

export const SCENARIO_TOTAL_METRICS = gql`
  fragment ScenarioTotalMetric on ScenarioTotalMetric {
    baseScenario
    changePercent
    currentScenario
    lowerIsBetter
    currentScenarioPredictionRange {
      high
      low
      highChangePercent
      lowChangePercent
    }
  }
`;

export const SCENARIO_FUNNEL_STEP = gql`
  fragment ScenarioFunnelStep on ScenarioFunnelStep {
    isTarget
    dailyMetrics {
      day
      costPer {
        ...ScenarioMetric
      }
      roas {
        ...ScenarioMetric
      }
      value {
        ...ScenarioMetric
      }
    }
    funnelStep {
      funnelStepId
      title
      type
    }
    costPer {
      ...ScenarioTotalMetric
    }
    roas {
      ...ScenarioTotalMetric
    }
    total {
      ...ScenarioTotalMetric
    }
  }
  ${SCENARIO_METRICS}
  ${SCENARIO_TOTAL_METRICS}
`;

export const SCENARIO_FRAGMENT = gql`
  fragment ScenarioFragment on SimulationScenario {
    scenarioId
    isApplied
    isBaseScenario
    reliabilityLabel
    appliedAt
    funnelSteps {
      ...ScenarioFunnelStep
    }
    targetFunnelStep {
      ...ScenarioFunnelStep
    }
    budget {
      totals {
        baseScenarioTotal
        changePercentTotal
        currentScenarioTotal
      }
      dailyMetrics {
        baseScenario
        changePercent
        currentScenario
        day
      }
    }
  }
  ${SCENARIO_FUNNEL_STEP}
  ${SCENARIO_METRICS}
  ${SCENARIO_TOTAL_METRICS}
`;
