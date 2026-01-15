import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';

const CREATE_OR_UPDATE_PORTFOLIO_IMPACT_GROUP_MUTATION = gql`
  mutation createPortfolioImpactGroup(
    $teamId: Int!
    $portfolioId: Int!
    $impactGroupId: Int
    $name: String!
    $funnelStepIds: [Int!]!
  ) {
    createOrUpdatePortfolioImpactGroup(
      teamId: $teamId
      portfolioId: $portfolioId
      impactGroupId: $impactGroupId
      name: $name
      funnelStepIds: $funnelStepIds
    ) {
      impactGroupId
      name
      portfolioId
    }
  }
`;

function useCreateOrUpdatePortfolioImpactGroupMutation({ portfolioId, name, funnelStepIds, impactGroupId }) {
  const { teamId } = useTeam();
  return useMutation(CREATE_OR_UPDATE_PORTFOLIO_IMPACT_GROUP_MUTATION, {
    variables: {
      teamId,
      portfolioId,
      impactGroupId,
      name,
      funnelStepIds,
    },
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: PORTFOLIO_V2_META_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });
}

export { CREATE_OR_UPDATE_PORTFOLIO_IMPACT_GROUP_MUTATION, useCreateOrUpdatePortfolioImpactGroupMutation };
