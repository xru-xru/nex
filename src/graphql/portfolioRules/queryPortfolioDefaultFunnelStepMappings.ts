import { gql, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';

export type FunnelStepDefaultMapping = {
  funnelStepId: number;
  metricId: number | null;
};

export const PORTFOLIO_DEFAULT_FUNNEL_STEP_MAPPINGS_QUERY = gql`
  query PortfolioDefaultFunnelStepMappings($portfolioId: Float!, $providerId: Int!, $teamId: Float!) {
    listPortfolioDefaultFunnelStepMappings(portfolioId: $portfolioId, providerId: $providerId, teamId: $teamId) {
      funnelStepId
      metricId
    }
  }
`;

type QueryVariables = {
  portfolioId: number;
  providerId: number;
  teamId: number;
};

export function usePortfolioDefaultFunnelStepMappingsQuery({
  portfolioId,
  providerId,
  onCompleted,
  skip,
}: {
  portfolioId: number;
  providerId: number;
  onCompleted?: (data: { listPortfolioDefaultFunnelStepMappings: FunnelStepDefaultMapping[] }) => void;
  skip?: boolean;
}) {
  const { teamId } = useTeam();

  const query = useQuery<
    {
      listPortfolioDefaultFunnelStepMappings: FunnelStepDefaultMapping[];
    },
    QueryVariables
  >(PORTFOLIO_DEFAULT_FUNNEL_STEP_MAPPINGS_QUERY, {
    skip: skip || !teamId || !portfolioId || !providerId,
    variables: {
      teamId,
      portfolioId,
      providerId,
    },
    onCompleted,
  });

  return query;
}
