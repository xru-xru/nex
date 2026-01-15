import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';
import useTabNewUpdates from '../../hooks/useTabNewUpdates';

const DELETE_PORTFOLIO_IMPACT_GROUP_MUTATION = gql`
  mutation DeletePortfolioImpactGroup($teamId: Int!, $portfolioId: Int!, $impactGroupId: Int!) {
    deletePortfolioImpactGroup(teamId: $teamId, portfolioId: $portfolioId, impactGroupId: $impactGroupId)
  }
`;

function useDeletePortfolioImpactGroupMutation({ portfolioId, impactGroupId }) {
  const { teamId } = useTeam();
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  return useMutation(DELETE_PORTFOLIO_IMPACT_GROUP_MUTATION, {
    variables: {
      teamId,
      portfolioId,
      impactGroupId,
    },
    onCompleted: () => {
      refreshCountDiscoveredContents();
    },
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: PORTFOLIO_V2_META_QUERY,
        fetchPolicy: 'network-only',
        variables: {
          teamId,
          portfolioId,
        },
      },
    ],
  });
}

export { DELETE_PORTFOLIO_IMPACT_GROUP_MUTATION, useDeletePortfolioImpactGroupMutation };
