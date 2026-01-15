import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';

import { useTeam } from '../../context/TeamProvider';

import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

import { BUDGET_ITEMS_QUERY, BUDGET_ITEMS_WITH_DAILY_ITEMS_QUERY } from './budgetItemQuery';

const DELETE_BUDGET_ITEM_MUTATION = gql`
  mutation DeleteBudgetItem($budgetItemId: Int!, $teamId: Int!, $portfolioId: Int!) {
    deleteBudgetItem(budgetItemId: $budgetItemId, teamId: $teamId, portfolioId: $portfolioId)
  }
`;

function useDeleteBudgetItemMutation({ portfolioId, start, end }) {
  const { teamId } = useTeam();

  const [deleteBudgetItem, { data, loading, error }] = useMutation(DELETE_BUDGET_ITEM_MUTATION, {
    refetchQueries: [
      {
        query: BUDGET_ITEMS_QUERY,
        variables: {
          teamId,
          portfolioId,
          start: dayjs(start).format(GLOBAL_DATE_FORMAT),
          end: dayjs(end).format(GLOBAL_DATE_FORMAT),
        },
        fetchPolicy: 'network-only',
      },
      {
        query: BUDGET_ITEMS_WITH_DAILY_ITEMS_QUERY,
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
  return { deleteBudgetItem, data, loading, error };
}

export { DELETE_BUDGET_ITEM_MUTATION, useDeleteBudgetItemMutation };
