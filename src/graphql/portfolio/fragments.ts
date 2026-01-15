import { gql } from '@apollo/client';

const PORTFOLIO_FUNNEL_STEP = gql`
  fragment portfolioFunnelStep on Portfolio {
    funnelSteps {
      funnel_step_id
      title
      optimizationTargetType
    }
  }
`;
const PORTFOLIO_FUNNEL_STEP_WITHOUT_REALIZED_METRIC_DATA_PAST = gql`
  fragment portfolioFunnelStepWithoutRealizedMetricDataPast on FunnelStep {
    funnel_step_id
    title
    optimizationTargetType
  }
`;
const PORTFOLIO_2_META_FRAGMENT = gql`
  fragment portfolioMeta on Portfolio {
    portfolioId
    title
    description
    createdByUserId
    moneyAllocatedTotal
  }
`;
const PORTFOLIO_2_DATES_FRAGMENT = gql`
  fragment portfolioDates on Portfolio {
    startDate
    endDate
  }
`;

const PORTFOLIO_V2_META_FRAGMENT = gql`
  fragment portfolioV2Meta on PortfolioV2 {
    portfolioId
    title
    description
    optimizationRiskLevel
    optimizationType
    budgetDeltaHandlingPolicy
    budgetProposalTargetBiddingApplyMode
    skipTrainingDays
    type
    teamId
    syncStatus
    lastSyncedAt
    isAttributed
    activeTargetItem {
      maxBudget
      achieved
      value
    }
    latestAchievedTargetItem {
      achieved
      value
    }
    impactGroups {
      impactGroupId
      name
      funnelSteps {
        funnel_step_id
      }
    }
    labels {
      labelId
      name
    }
    portfolioDashboardUrls {
      name
      url
    }
    featureFlags {
      name
      status
    }

    defaultOptimizationTarget {
      funnelStepId
      title
      type
    }
  }
`;

const PORTFOLIO_V2_META_BUDGET_FRAGMENT = gql`
  fragment portfolioV2MetaBudget on PortfolioV2 {
    budget {
      total
      spent {
        totalSpent
      }
    }
  }
`;
const PORTFOLIO_V2_DATES_FRAGMENT = gql`
  fragment portfolioV2Dates on PortfolioV2 {
    start
    end
  }
`;
const PORTFOLIO_2_CONTENT_SIMPLE = gql`
  fragment portfolioSimpleContent on Portfolio {
    content {
      contentDetails {
        contentId
        portfolioContentId
        costs
        isIncludedInOptimization
        metadata {
          biddingStrategy
        }
        content {
          collection_id
          title
          provider {
            provider_id
          }
        }
        childContent {
          contentId
        }
      }
    }
  }
`;

const PORTFOLIO_2_CONTENT = gql`
  fragment portfolioContent on Portfolio {
    content {
      contentDetails {
        contentId
        portfolioContentId
        impactGroup {
          name
          impactGroupId
          portfolioId
          funnelSteps {
            funnel_step_id
          }
        }
        budget {
          max
          min
        }
        costs
        isIncludedInOptimization
        metadata {
          biddingStrategy
        }
        discoveredContent {
          status
          discoveredContentId
          contentRules {
            isApplied
            contentRule {
              name
              contentRuleId
            }
          }
          impactGroupRules {
            isApplied
            impactGroupRule {
              name
              impactGroupRuleId
            }
          }
          attributionRules {
            isApplied
            attributionRule {
              name
              attributionRuleId
            }
          }
        }
        content {
          collection_id
          collectionType {
            collection_type_id
            name
          }
          title
          provider {
            provider_id
          }
        }
        label {
          labelId
          name
        }
        metrics {
          isOptimizationTarget
          funnelStep {
            ...portfolioFunnelStepWithoutRealizedMetricDataPast
          }
          metricTypeId
          coreMetricValues {
            metricTypeName
            helpcenterLink
            valueTotal
            costPer
          }
          otherFunnelStepMetrics {
            activeFunnelStepMetricId
            funnelStepTypeName
            providerId
            otherMetrics {
              metric_type_id
              metric_type_name
            }
          }
        }
        childContent {
          contentId
          portfolioContentId
          content {
            collection_id
            collectionType {
              collection_type_id
              name
            }
            title
            provider {
              provider_id
            }
          }
          label {
            name
          }
          metrics {
            isOptimizationTarget
            funnelStep {
              ...portfolioFunnelStepWithoutRealizedMetricDataPast
            }
            metricTypeId
            coreMetricValues {
              valueTotal
              metricTypeName
              helpcenterLink
            }
            otherFunnelStepMetrics {
              activeFunnelStepMetricId
              funnelStepTypeName
              providerId
              otherMetrics {
                metric_type_id
                metric_type_name
              }
            }
          }
        }
      }
    }
  }
  ${PORTFOLIO_FUNNEL_STEP_WITHOUT_REALIZED_METRIC_DATA_PAST}
`;

const PORTFOLIO_2_DEFAULT_OPTIMIZATION_TARGET = gql`
  fragment portfolioDefaultOptimizationTarget on Portfolio {
    defaultOptimizationTarget {
      ...portfolioFunnelStepWithoutRealizedMetricDataPast
    }
  }
  ${PORTFOLIO_FUNNEL_STEP_WITHOUT_REALIZED_METRIC_DATA_PAST}
`;
export {
  PORTFOLIO_2_DATES_FRAGMENT,
  PORTFOLIO_2_META_FRAGMENT,
  PORTFOLIO_V2_META_FRAGMENT,
  PORTFOLIO_V2_META_BUDGET_FRAGMENT,
  PORTFOLIO_V2_DATES_FRAGMENT,
  PORTFOLIO_2_CONTENT,
  PORTFOLIO_2_CONTENT_SIMPLE,
  PORTFOLIO_FUNNEL_STEP,
  PORTFOLIO_2_DEFAULT_OPTIMIZATION_TARGET,
};
