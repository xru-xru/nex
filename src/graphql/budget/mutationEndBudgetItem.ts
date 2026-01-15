import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';

import { useTeam } from '../../context/TeamProvider';

import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

import { BUDGET_ITEMS_QUERY, BUDGET_ITEMS_WITH_DAILY_ITEMS_QUERY } from './budgetItemQuery';

const END_BUDGET_ITEM_MUTATION = gql`
  mutation EndBudgetItem($budgetItemId: Int!, $portfolioId: Int!, $teamId: Int!) {
    endBudgetItem(budgetItemId: $budgetItemId, portfolioId: $portfolioId, teamId: $teamId) {
      budgetItemId
    }
  }
`;

function useEndBudgetItemMutation({ portfolioId, start, end }) {
  const { teamId } = useTeam();

  const [endBudgetItem, { data, loading, error }] = useMutation(END_BUDGET_ITEM_MUTATION, {
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

  return { endBudgetItem, data, loading, error };
}

export { END_BUDGET_ITEM_MUTATION, useEndBudgetItemMutation };
