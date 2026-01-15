import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';

import { useTeam } from '../../context/TeamProvider';

import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

import { TARGET_ITEMS_QUERY } from './targetItemQuery';

const EDIT_TARGET_ITEM_MUTATION = gql`
  mutation EditTargetItem(
    $targetItemId: Int!
    $portfolioId: Int!
    $teamId: Int!
    $maxBudget: Float
    $name: String
    $start: Date
    $end: Date
    $value: Float
  ) {
    editPortfolioTargetItem(
      targetItemId: $targetItemId
      portfolioId: $portfolioId
      teamId: $teamId
      name: $name
      start: $start
      end: $end
      value: $value
      maxBudget: $maxBudget
    ) {
      targetItemId
    }
  }
`;

function useEditTargetItemMutation({
  portfolioId,
  start,
  end,
}: {
  portfolioId: number;
  start?: string | Date;
  end?: string | Date;
  setState?: any;
}) {
  const { teamId } = useTeam();

  const [editTargetItem, { data, loading, error }] = useMutation(EDIT_TARGET_ITEM_MUTATION, {
    refetchQueries: [
      {
        query: TARGET_ITEMS_QUERY,
        variables: {
          teamId,
          portfolioId,
          start: dayjs(start).format(GLOBAL_DATE_FORMAT),
          end: dayjs(end).format(GLOBAL_DATE_FORMAT),
        },
        fetchPolicy: 'network-only',
      },
    ],
  });

  return { editTargetItem, data, loading, error };
}

export { EDIT_TARGET_ITEM_MUTATION, useEditTargetItemMutation };
