import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';

import { useTeam } from '../../context/TeamProvider';

import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

import { BUDGET_ITEMS_QUERY, BUDGET_ITEMS_WITH_DAILY_ITEMS_QUERY } from './budgetItemQuery';

const CREATE_BUDGET_ITEM_MUTATION = gql`
  mutation CreateBudgetItem(
    $portfolioId: Int!
    $teamId: Int!
    $name: String!
    $startDate: Date!
    $endDate: Date!
    $budgetAmount: Float!
    $pacing: PacingType!
  ) {
    createBudgetItem(
      portfolioId: $portfolioId
      teamId: $teamId
      name: $name
      startDate: $startDate
      endDate: $endDate
      budgetAmount: $budgetAmount
      pacing: $pacing
    ) {
      name
      startDate
      endDate
      budgetAmount
      pacing
    }
  }
`;

function useCreateBudgetItemMutation({ portfolioId, start, end }) {
  const { teamId } = useTeam();

  const [createBudgetItem, { data, loading, error }] = useMutation(CREATE_BUDGET_ITEM_MUTATION, {
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

  return { createBudgetItem, data, loading, error };
}

export { CREATE_BUDGET_ITEM_MUTATION, useCreateBudgetItemMutation };
