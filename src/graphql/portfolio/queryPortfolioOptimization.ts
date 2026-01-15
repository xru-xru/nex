import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { PORTFOLIO_2_CONTENT_SIMPLE } from './fragments';

type Options = {
  portfolioId: number;
  withBudget?: boolean;
  withOptimization?: boolean;
  skip?: boolean;
  dateFrom?: Date;
  dateTo?: Date | string;
};
const PORTFOLIO_OPTIMIZATION_LIST_QUERY = gql`
  query OptimizationList($portfolioId: Int!, $teamId: Int!, $dateFrom: DateTime, $dateTo: DateTime) {
    portfolio(portfolioId: $portfolioId, teamId: $teamId, dateFrom: $dateFrom, dateTo: $dateTo) {
      portfolioId
      optimization {
        optimizationId
        title
        description
        dateCreated
        dateApplied
        dateArchived
        startDate
        endDate
        isActive
        optimizationTarget {
          funnelStepId
          title
          type
        }
      }
    }
  }
`;

const PORTFOLIO_CONTENT_DETAILS_QUERY = gql`
  query PortfolioSimpleContent($portfolioId: Int!, $teamId: Int!, $dateFrom: DateTime, $dateTo: DateTime) {
    portfolio(portfolioId: $portfolioId, teamId: $teamId, dateFrom: $dateFrom, dateTo: $dateTo) {
      portfolioId
      ...portfolioSimpleContent
    }
  }
  ${PORTFOLIO_2_CONTENT_SIMPLE}
`;

const OPTIMIZATION_CHANNEL_QUERY = gql`
  query OptimizationChannel($optimizationId: Int!, $portfolioId: Int!, $teamId: Int!) {
    optimization(optimizationId: $optimizationId, portfolioId: $portfolioId, teamId: $teamId) {
      optimizationId
      title
      description
      dateCreated
      dateApplied
      dateArchived
      startDate
      endDate
      isActive
      optimizationTarget {
        funnelStepId
        title
        type
      }

      optimizationChannels {
        optimizationChannel {
          providerId
          proposedAllocation {
            proposedDailyBudget
            dailyBudgetChange
            dailyBudgetPercentageChange
            dailyOverview {
              value
              timestamp
            }
          }
          expectedPerformance {
            expectedPerformancePerGoal {
              title
              funnelStepId
              costPerGoal
              totalPerformance
              totalPerformanceGain
              totalPerformancePercentageGain
              type
            }
            isPerforming
          }
        }
        channelTotals {
          proposedAllocation {
            proposedDailyBudget
            dailyBudgetChange
            dailyBudgetPercentageChange
            dailyOverview {
              value
              timestamp
            }
          }
          expectedPerformance {
            expectedPerformancePerGoal {
              funnelStepId
              title
              costPerGoal
              totalPerformance
              totalPerformanceGain
              totalPerformancePercentageGain
              type
            }
            isPerforming
          }
        }
      }
    }
  }
`;

const OPTIMIZATION_CONTENT_QUERY = gql`
  query DetailedOptimizationContent($optimizationId: Int!, $portfolioId: Int!, $teamId: Int!) {
    optimization(optimizationId: $optimizationId, portfolioId: $portfolioId, teamId: $teamId) {
      optimizationId
      title
      description
      dateCreated
      dateApplied
      dateArchived
      startDate
      endDate
      isActive
      contentStatus {
        portfolioContentId
        status
        description
      }
      optimizationFunnelPerformance {
        funnelStep {
          title
          optimizationTargetType
          funnel_step_id
        }
        potentialValue
        potentialPercentage
        totalPerformance
      }
      optimizationChannels {
        optimizationChannel {
          providerId
          proposedAllocation {
            proposedDailyBudget
            dailyBudgetChange
            dailyBudgetPercentageChange
            dailyOverview {
              value
              timestamp
            }
          }
        }
        channelTotals {
          proposedAllocation {
            proposedDailyBudget
            dailyBudgetChange
            dailyBudgetPercentageChange
            dailyOverview {
              value
              timestamp
            }
          }
          expectedPerformance {
            expectedPerformancePerGoal {
              funnelStepId
              title
              costPerGoal
              totalPerformance
              totalPerformanceGain
              totalPerformancePercentageGain
              type
            }
            isPerforming
          }
        }
      }
      expectedPerformanceTotals {
        expectedPerformancePerGoal {
          title
          funnelStepId
          costPerGoal
          totalPerformance
          totalPerformanceGain
          type
        }
      }

      optimizationContent {
        description
        contentDetail {
          contentId
          impactGroup {
            name
            impactGroupId
            portfolioId
            funnelSteps {
              funnel_step_id
            }
          }
          metadata {
            biddingStrategy
          }
          content {
            parent_collection {
              title
            }
            collectionType {
              name
            }
            collection_id
            title
            provider {
              provider_id
              name
            }
          }
        }
        proposedAllocation {
          proposedDailyBudget
          previousDailyBudget
          dailyBudgetPercentageChange
          dailyOverview {
            value
            timestamp
          }
        }

        expectedPerformance {
          expectedPerformancePerGoal {
            funnelStepId
            title
            costPerGoal
            totalPerformance
            totalPerformanceGain
            type
          }
          isPerforming
          expectedPerformancePerGoal {
            funnelStepId
            title
            costPerGoal
            totalPerformance
            totalPerformanceGain
            totalPerformancePercentageGain
            type
          }
        }
      }
    }
  }
`;

function usePortfolioOptimizationList({ portfolioId, dateFrom, dateTo }: Options) {
  const { teamId } = useTeam();
  const query = useQuery(PORTFOLIO_OPTIMIZATION_LIST_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
      dateFrom,
      dateTo,
    },
  });
  return query;
}

function usePortfolioContentDetails({ portfolioId, dateFrom, dateTo }: Options) {
  const { teamId } = useTeam();
  const query = useQuery(PORTFOLIO_CONTENT_DETAILS_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
      dateFrom,
      dateTo,
    },
  });
  return query;
}

function usePortfolioOptimizationChannels({ portfolioId, optimizationId }) {
  const { teamId } = useTeam();
  const query = useQuery(OPTIMIZATION_CHANNEL_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
      optimizationId,
    },
  });
  return query;
}

function usePortfolioOptimizationContent({ portfolioId, optimizationId }) {
  const { teamId } = useTeam();
  const query = useQuery(OPTIMIZATION_CONTENT_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
      optimizationId,
    },
  });
  return query;
}

export {
  usePortfolioOptimizationList,
  usePortfolioOptimizationChannels,
  usePortfolioOptimizationContent,
  usePortfolioContentDetails,
};
