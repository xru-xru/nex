import { gql, QueryResult, useQuery } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { FUNNEL_STEP_METRIC_TOTALS_FRAGMENT, OPTIMIZATIONS_V2_FRAGMENT } from './fragments';
import { NexoyaFunnelStepPerformance, NexoyaOptimizationV2 } from '../../types';

type DateRangeInput = {
  start: string;
  end: string;
};

interface PerformanceQueryVariables {
  teamId: number;
  portfolioId: number;
  period: DateRangeInput;
  comparisonPeriod?: DateRangeInput;
}

interface PerformanceQueryResult {
  portfolioV2: {
    performance: {
      funnelSteps: NexoyaFunnelStepPerformance[];
      funnelStep?: NexoyaFunnelStepPerformance;
      optimizations: NexoyaOptimizationV2[];
    };
  };
}

const PERFORMANCE_TOTALS_QUERY = gql`
  query PerformanceTotals(
    $teamId: Int!
    $portfolioId: Int!
    $period: DateRangeInput!
    $comparisonPeriod: DateRangeInput
  ) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      performance(period: $period, comparisonPeriod: $comparisonPeriod) {
        funnelSteps {
          ...TotalsFunnelStepFragment
        }
        optimizations {
          ...OptimizationsV2Fragment
        }
      }
    }
  }
  ${FUNNEL_STEP_METRIC_TOTALS_FRAGMENT}
  ${OPTIMIZATIONS_V2_FRAGMENT}
`;

type Options = {
  portfolioId: number;
  funnelStepId?: number;
  teamId?: number;
  period: { start: string; end: string };
  comparisonPeriod?: { start: string; end: string };
};

type usePerformanceQueryType = (options: Options) => QueryResult<PerformanceQueryResult, PerformanceQueryVariables>;

const usePerformanceTotalsQuery: usePerformanceQueryType = ({ portfolioId, period, comparisonPeriod }) => {
  const { teamId } = useTeam();

  return useQuery<PerformanceQueryResult, PerformanceQueryVariables>(PERFORMANCE_TOTALS_QUERY, {
    variables: {
      teamId,
      portfolioId,
      period,
      comparisonPeriod,
    },
    skip: !teamId || !portfolioId,
    fetchPolicy: 'cache-first',
  });
};

export { usePerformanceTotalsQuery, PERFORMANCE_TOTALS_QUERY };
