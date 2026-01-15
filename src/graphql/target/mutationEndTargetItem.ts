import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { TARGET_ITEMS_QUERY } from './targetItemQuery';

const END_TARGET_ITEM_MUTATION = gql`
  mutation EndTargetItem($targetItemId: Int!, $portfolioId: Int!, $teamId: Int!) {
    endPortfolioTargetItem(targetItemId: $targetItemId, portfolioId: $portfolioId, teamId: $teamId) {
      targetItemId
    }
  }
`;

function useEndTargetItemMutation({ portfolioId }) {
  const { teamId } = useTeam();

  const [endTargetItem, { data, loading, error }] = useMutation(END_TARGET_ITEM_MUTATION, {
    refetchQueries: [
      {
        query: TARGET_ITEMS_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });

  return { endTargetItem, data, loading, error };
}

export { END_TARGET_ITEM_MUTATION, useEndTargetItemMutation };
