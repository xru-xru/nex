import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

export const OPTIMIZED_METRIC_FRAGMENT = gql`
  fragment Metric on OptimizedMetric {
    baseline
    predicted
    changePercent
  }
`;

export const OPTIMIZED_FUNNEL_STEP_FRAGMENT = gql`
  fragment FunnelStepsFragment on OptimizedFunnelStep {
    lowDataVolume
    funnelStep {
      type
      title
      funnelStepId
      isAttributed
    }
    attribution {
      measured
      attributed
      changePercent
    }
    metric {
      ...Metric
    }
    costPer {
      ...Metric
    }
    roas {
      ...Metric
    }
  }
`;

export const OPTIMIZED_TARGET_FRAGMENT = gql`
  fragment OptimizedTargetFragment on OptimizedTarget {
    changePercent
    lowerIsBetter
    previous
    proposed
  }
`;

export const OPTIMIZATION_PERFORMANCE_QUERY = gql`
  query OptimizationPerformance($teamId: Int!, $portfolioId: Int!, $optimizationId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      optimization(optimizationId: $optimizationId) {
        appliedAt
        description
        end
        optimizationId
        start
        title
        onlyVisibleToSupportUsers
        usedBudgetProposalTargetBiddingApplyMode
        isBaselinePredictionRescaled
        ignoreWeekdays
        performance {
          total {
            budget {
              changePercent
              proposed
              spent
            }
            funnelSteps {
              ...FunnelStepsFragment
            }
            target {
              ...OptimizedTargetFragment
            }
          }
          impactGroups {
            impactGroup {
              funnelSteps {
                funnel_step_id
              }
              impactGroupId
              name
            }
            budget {
              changePercent
              proposed
              spent
            }
            funnelSteps {
              ...FunnelStepsFragment
            }
            target {
              ...OptimizedTargetFragment
            }
          }
          channels {
            channelId
            budget {
              changePercent
              proposed
              spent
            }
            funnelSteps {
              ...FunnelStepsFragment
            }
            target {
              ...OptimizedTargetFragment
            }
          }
          labels {
            label {
              labelId
              name
            }
            budget {
              changePercent
              proposed
              spent
            }
            funnelSteps {
              ...FunnelStepsFragment
            }
            target {
              ...OptimizedTargetFragment
            }
          }
          contents {
            status {
              payload {
                budgetMax
                budgetMin
                budgetRevenueResponseCurve
                impressionShare
                plannedBudget
                saturationTangent
                spentBudget
                appliedBudget
                saturationScore
                saturationPoint
                saturationProfitPerUnit
                funnelStep {
                  title
                  funnelStepId
                }
              }
              reason
              type
            }
            budget {
              spent
              proposed
              changePercent
            }
            budgetProposalData {
              budgetWillBeApplied
              biddingStrategyWillBeApplied
              teamCurrency {
                budgetType
                initialBudget
                initialBudgetDaily
                proposedBudget
                biddingStrategyChangePercent
                budgetType
                initialBiddingStrategy {
                  type
                  value
                }
                proposedBiddingStrategy {
                  type
                  value
                  applicationDelta
                  currentTcpa
                  currentTroas
                  dailyBudgetChange
                  realizedRoas
                  troasDelta
                  realizedCpa
                  tcpaDelta
                }
                lifetimeBudget {
                  providerBudgetMissingDays
                  lifetimeBudgetSegments {
                    endDate
                    initialBudget
                    proposedBudget
                    spend
                    spendUpdatedAt
                    startDate
                  }
                }
              }
              portfolioContentId
              applicationType
            }
            content {
              collection_id
              title
              identifier
              parent_collection {
                title
              }
              collectionType {
                name
              }
              provider {
                provider_id
                name
                logo
              }
            }
            funnelSteps {
              ...FunnelStepsFragment
            }
            impactGroup {
              impactGroupId
              name
              funnelSteps {
                funnel_step_id
              }
            }
            label {
              name
              labelId
            }
          }
        }
      }
    }
  }
  ${OPTIMIZED_TARGET_FRAGMENT}
  ${OPTIMIZED_FUNNEL_STEP_FRAGMENT}
  ${OPTIMIZED_METRIC_FRAGMENT}
`;

type Props = {
  portfolioId: number;
  optimizationId: number;
};

function useOptimizationPerformanceQuery({ portfolioId, optimizationId }: Props) {
  const { teamId } = useTeam();
  return useQuery(OPTIMIZATION_PERFORMANCE_QUERY, {
    notifyOnNetworkStatusChange: false,
    fetchPolicy: 'network-only',
    refetchWritePolicy: 'merge',
    variables: {
      teamId,
      portfolioId,
      optimizationId,
    },
  });
}

export { useOptimizationPerformanceQuery };
