import { gql } from '@apollo/client';

export const PERFORMANCE_METRIC_FRAGMENT = gql`
  fragment PerformanceMetric on PerformanceMetric {
    value
    adSpend
    costRatio
    roas
  }
`;

export const DAILY_METRICS_FUNNEL_STEP_FRAGMENT = gql`
  fragment DailyFunnelStepFragment on FunnelStepPerformance {
    funnelStep {
      funnelStepId
      title
      type
    }
    dailyMetrics {
      comparisonDay
      day

      providers @include(if: $withProviders) {
        providerId
        value {
          ...PerformanceMetric
        }
        comparisonChangePercent @include(if: $withComparison) {
          ...PerformanceMetric
        }
        comparisonValue @include(if: $withComparison) {
          ...PerformanceMetric
        }
      }
      labels @include(if: $withLabels) {
        labelId
        value {
          ...PerformanceMetric
        }
        comparisonChangePercent @include(if: $withComparison) {
          ...PerformanceMetric
        }
        comparisonValue @include(if: $withComparison) {
          ...PerformanceMetric
        }
      }
      impactGroups @include(if: $withImpactGroups) {
        impactGroup {
          name
          impactGroupId
        }
        value {
          ...PerformanceMetric
        }
        comparisonValue @include(if: $withComparison) {
          ...PerformanceMetric
        }
        comparisonChangePercent @include(if: $withComparison) {
          ...PerformanceMetric
        }
      }
    }
    dailyOptimizationMetrics {
      day
      providers {
        providerId
        relativeBaseline
        relativeExpected
      }
    }
  }
  ${PERFORMANCE_METRIC_FRAGMENT}
`;

export const DAILY_METRICS_CONTENTS_FUNNEL_STEP_FRAGMENT = gql`
  fragment DailyContentsFunnelStepFragment on FunnelStepPerformance {
    funnelStep {
      funnelStepId
      title
      type
    }
    dailyMetrics {
      comparisonDay
      day

      contents {
        contentId
        title
        isIncludedInOptimization
        providerId
        label {
            name
        }
        impactGroup {
            name
        }
        value {
          ...PerformanceMetric
        }
        comparisonValue {
          ...PerformanceMetric
        }
        comparisonChangePercent {
          ...PerformanceMetric
        }
      }
    }
  }
  ${PERFORMANCE_METRIC_FRAGMENT}
`;

export const FUNNEL_STEP_METRIC_TOTALS_FRAGMENT = gql`
  fragment TotalsFunnelStepFragment on FunnelStepPerformance {
    funnelStep {
      funnelStepId
      title
      type
      isAttributed
    }
    metricTotals {
      providers {
        total {
          ...PerformanceMetric
        }
        comparisonTotal {
          ...PerformanceMetric
        }
        comparisonChangePercent {
          ...PerformanceMetric
        }
        providerId
      }
      labels {
        total {
          ...PerformanceMetric
        }
        comparisonTotal {
          ...PerformanceMetric
        }
        comparisonChangePercent {
          ...PerformanceMetric
        }
        labelId
      }
      impactGroups {
        impactGroup {
          impactGroupId
          name
        }
        total {
          ...PerformanceMetric
        }
        comparisonTotal {
          ...PerformanceMetric
        }
        comparisonChangePercent {
          ...PerformanceMetric
        }
      }
    }
  }
  ${PERFORMANCE_METRIC_FRAGMENT}
`;

export const OPTIMIZATIONS_V2_FRAGMENT = gql`
  fragment OptimizationsV2Fragment on OptimizationV2 {
    title
    optimizationId
    appliedAt
    description
    end
    start
  }
`;

export const CONTENT_METRIC_FRAGMENT = gql`
  fragment ContentMetricFragment on FunnelStepPerformance {
    metricTotals {
      providers {
        total {
          ...PerformanceMetric
        }
        comparisonTotal {
          ...PerformanceMetric
        }
        comparisonChangePercent {
          ...PerformanceMetric
        }
        providerId
        contents {
          content {
            contentId
            title
          }
          total {
            ...PerformanceMetric
          }
          comparisonTotal {
            ...PerformanceMetric
          }

          comparisonChangePercent {
            ...PerformanceMetric
          }
        }
      }
      attributionRules {
        attributionRule {
          attributionRuleId
          name
          filters {
            providerId
          }
        }
        comparisonChangePercent {
          ...PerformanceMetric
        }
        comparisonTotal {
          ...PerformanceMetric
        }
        total {
          ...PerformanceMetric
        }
        contents {
          content {
            contentId
            title
          }
          total {
            ...PerformanceMetric
          }
          comparisonTotal {
            ...PerformanceMetric
          }
          comparisonChangePercent {
            ...PerformanceMetric
          }
        }
      }
    }
  }
  ${PERFORMANCE_METRIC_FRAGMENT}
`;
