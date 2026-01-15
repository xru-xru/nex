import { useTeam } from '../../context/TeamProvider';
import { gql, useQuery } from '@apollo/client';

const ATTRIBUTION_PERFORMANCE_QUERY = gql`
  query AttributionPerformance($teamId: Int!, $portfolioId: Int!, $period: DateRangeInput!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      attributionPerformance(period: $period) {
        measuredFunnelStep {
          funnelStepId
          title
        }
        attributedFunnelStep {
          funnelStepId
          title
        }
        attributionRulesMetrics {
          value {
            attributed
            changePercent
            measured
          }
          attributionRule {
            name
            attributionRuleId
          }
        }
      }
    }
  }
`;

type Options = {
  portfolioId: number;
  funnelStepId?: number;
  onCompleted?: (data: any) => void;
  period: { start: string; end: string };
  isAttributed: boolean;
};

export function useAttributionPerformanceQuery({ portfolioId, period, onCompleted, isAttributed }: Options) {
  const { teamId } = useTeam();
  return useQuery(ATTRIBUTION_PERFORMANCE_QUERY, {
    variables: { teamId, portfolioId, period },
    fetchPolicy: 'network-only',
    skip: !teamId || !portfolioId || !isAttributed,
    onCompleted,
  });
}
