import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';
import { TARGET_ITEMS_QUERY } from './targetItemQuery';

const DELETE_TARGET_ITEM_MUTATION = gql`
  mutation DeleteTargetItem($targetItemId: Int!, $teamId: Int!, $portfolioId: Int!) {
    removePortfolioTargetItem(targetItemId: $targetItemId, teamId: $teamId, portfolioId: $portfolioId)
  }
`;

function useDeleteTargetItemMutation({ portfolioId }) {
  const { teamId } = useTeam();

  const [deleteTargetItem, { data, loading, error }] = useMutation(DELETE_TARGET_ITEM_MUTATION, {
    refetchQueries: [
      {
        query: TARGET_ITEMS_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
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
  return { deleteTargetItem, data, loading, error };
}

export { DELETE_TARGET_ITEM_MUTATION, useDeleteTargetItemMutation };
