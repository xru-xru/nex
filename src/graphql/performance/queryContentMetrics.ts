import { useTeam } from '../../context/TeamProvider';
import { gql, useQuery } from '@apollo/client';
import { CONTENT_METRIC_FRAGMENT } from './fragments';

const PORTFOLIO_V2_CONTENT_METRICS_QUERY = gql`
  ${CONTENT_METRIC_FRAGMENT}
  query PortfolioV2ContentMetrics(
    $teamId: Int!
    $portfolioId: Int!
    $period: DateRangeInput!
    $comparisonPeriod: DateRangeInput
  ) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      performance(period: $period, comparisonPeriod: $comparisonPeriod) {
        funnelSteps {
          funnelStep {
            funnelStepId
            title
            type
            isMeasured
            isAttributed
          }
          ...ContentMetricFragment
        }
      }
    }
  }
`;

type Options = {
  portfolioId: number;
  funnelStepId?: number;
  period: { start: string; end: string };
  comparisonPeriod?: { start: string; end: string };
};

export function usePortfolioV2ContentMetricsQuery({ portfolioId, period, comparisonPeriod }: Options) {
  const { teamId } = useTeam();
  return useQuery(PORTFOLIO_V2_CONTENT_METRICS_QUERY, {
    variables: { teamId, portfolioId, period, comparisonPeriod },
    fetchPolicy: 'network-only',
    skip: !teamId || !portfolioId,
  });
}
