import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const DAILY_TARGET_METRICS_QUERY = gql`
  query TargetDailyMetrics($teamId: Int!, $portfolioId: Int!, $start: Date!, $end: Date!, $period: DateRangeInput!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      defaultOptimizationTarget {
        funnelStepId
        title
        type
      }
      performance(period: $period) {
        funnelSteps {
          funnelStep {
            funnelStepId
            title
            type
          }
          dailyMetrics {
            day
            providers {
              providerId
              value {
                value
                adSpend
                costRatio
              }
            }
          }
        }
      }
      budget {
        spent {
          dailySpendings(start: $start, end: $end) {
            day
            providers {
              providerId
              value {
                adSpend
                costRatio
                value
              }
            }
          }
        }
      }
    }
  }
`;

type Options = {
  portfolioId: number;
  start: string;
  end: string;
  skip?: boolean;
};

function useDailyTargetMetricsQuery({ portfolioId, start, end, skip }: Options): any {
  const { teamId } = useTeam();

  return useQuery(DAILY_TARGET_METRICS_QUERY, {
    variables: {
      teamId,
      portfolioId,
      start,
      end,
      period: {
        start,
        end,
      },
    },
    skip,
  });
}

export { DAILY_TARGET_METRICS_QUERY, useDailyTargetMetricsQuery };
