import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';
import { NexoyaUpsertImpactGroupInput } from '../../types';

const UPSERT_PORTFOLIO_IMPACT_GROUPS_MUTATION = gql`
  mutation UpsertPortfolioImpactGroups($teamId: Int!, $portfolioId: Int!, $impactGroups: [UpsertImpactGroupInput!]!) {
    upsertPortfolioImpactGroups(teamId: $teamId, portfolioId: $portfolioId, impactGroups: $impactGroups) {
      impactGroupId
      name
      funnelSteps {
        funnel_step_id
      }
    }
  }
`;

function useUpsertPortfolioImpactGroups({
  portfolioId,
  impactGroups,
}: {
  portfolioId: number;
  impactGroups: NexoyaUpsertImpactGroupInput[];
}) {
  const { teamId } = useTeam();
  return useMutation(UPSERT_PORTFOLIO_IMPACT_GROUPS_MUTATION, {
    variables: {
      teamId,
      portfolioId,
      impactGroups,
    },
    notifyOnNetworkStatusChange: true,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: PORTFOLIO_V2_META_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
      },
    ],
  });
}

export { UPSERT_PORTFOLIO_IMPACT_GROUPS_MUTATION, useUpsertPortfolioImpactGroups };
