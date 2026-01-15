import { gql, QueryResult, useQuery } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { DAILY_METRICS_CONTENTS_FUNNEL_STEP_FRAGMENT, DAILY_METRICS_FUNNEL_STEP_FRAGMENT } from './fragments';
import { NexoyaFunnelStepPerformance } from '../../types';

type DateRangeInput = {
  start: string;
  end: string;
};

const PERFORMANCE_FUNNEL_STEP_QUERY = gql`
  query FunnelStepPerformance(
    $teamId: Int!
    $portfolioId: Int!
    $period: DateRangeInput!
    $comparisonPeriod: DateRangeInput
    $funnelStepId: Float!
    $withProviders: Boolean = true
    $withImpactGroups: Boolean = false
    $withLabels: Boolean = false
    $withComparison: Boolean = false
  ) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      performance(period: $period, comparisonPeriod: $comparisonPeriod) {
        funnelStep(funnelStepId: $funnelStepId) {
          ...DailyFunnelStepFragment
        }
      }
    }
  }
  ${DAILY_METRICS_FUNNEL_STEP_FRAGMENT}
`;

const PERFORMANCE_FUNNEL_STEP_WITH_DAILY_CONTENTS_QUERY = gql`
  query FunnelStepPerformance(
    $teamId: Int!
    $portfolioId: Int!
    $period: DateRangeInput!
    $comparisonPeriod: DateRangeInput
    $funnelStepId: Float!
  ) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      performance(period: $period, comparisonPeriod: $comparisonPeriod) {
        funnelStep(funnelStepId: $funnelStepId) {
          ...DailyContentsFunnelStepFragment
        }
      }
    }
  }
  ${DAILY_METRICS_CONTENTS_FUNNEL_STEP_FRAGMENT}
`;

type FunnelStepQueryVariables = {
  teamId: number;
  portfolioId: number;
  period: DateRangeInput;
  comparisonPeriod?: DateRangeInput;
  funnelStepId: number;
  withProviders?: boolean;
  withLabels?: boolean;
  withImpactGroups?: boolean;
  withComparison?: boolean;
};

type FunnelStepQueryResult = {
  portfolioV2: {
    performance: {
      funnelStep: NexoyaFunnelStepPerformance;
    };
  };
};

type UseFunnelStepQueryOptions = {
  portfolioId: number;
  period: DateRangeInput;
  comparisonPeriod?: DateRangeInput;
  funnelStepId: number;
  skip?: boolean;
  withProviders?: boolean;
  withLabels?: boolean;
  withImpactGroups?: boolean;
  withComparison?: boolean;
};

type UseFunnelStepQueryType = (
  options: UseFunnelStepQueryOptions,
) => QueryResult<FunnelStepQueryResult, FunnelStepQueryVariables>;

const usePerformanceFunnelStepQuery: UseFunnelStepQueryType = ({
  portfolioId,
  period,
  comparisonPeriod,
  funnelStepId,
  skip,
  withProviders,
  withLabels,
  withImpactGroups,
  withComparison,
}) => {
  const { teamId } = useTeam();

  return useQuery<FunnelStepQueryResult, FunnelStepQueryVariables>(PERFORMANCE_FUNNEL_STEP_QUERY, {
    variables: {
      teamId,
      portfolioId,
      period,
      comparisonPeriod,
      funnelStepId,
      withProviders,
      withLabels,
      withImpactGroups,
      withComparison,
    },
    skip: skip ?? (!teamId || !portfolioId || !funnelStepId || funnelStepId < 0),
  });
};

export {
  usePerformanceFunnelStepQuery,
  PERFORMANCE_FUNNEL_STEP_QUERY,
  PERFORMANCE_FUNNEL_STEP_WITH_DAILY_CONTENTS_QUERY,
};
