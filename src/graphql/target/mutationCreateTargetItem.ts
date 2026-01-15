import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

import { useTeam } from '../../context/TeamProvider';

import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';
import { TARGET_ITEMS_QUERY } from './targetItemQuery';

const CREATE_TARGET_ITEM_MUTATION = gql`
  mutation CreateTargetItem(
    $portfolioId: Int!
    $teamId: Int!
    $name: String!
    $start: Date!
    $end: Date!
    $value: Float!
    $maxBudget: Float!
  ) {
    createPortfolioTargetItem(
      portfolioId: $portfolioId
      teamId: $teamId
      name: $name
      start: $start
      end: $end
      value: $value
      maxBudget: $maxBudget
    ) {
      name
      start
      end
      value
      maxBudget
      targetItemId
    }
  }
`;

function useCreateTargetItemMutation({ portfolioId }) {
  const { teamId } = useTeam();

  const [createTargetItem, { data, loading, error }] = useMutation(CREATE_TARGET_ITEM_MUTATION, {
    onError: (error) => {
      toast.error(error.message);
      throw new Error(error.message);
    },
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

  return { createTargetItem, data, loading, error };
}

export { CREATE_TARGET_ITEM_MUTATION, useCreateTargetItemMutation };
