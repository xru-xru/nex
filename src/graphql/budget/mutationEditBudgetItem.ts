import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';

import { useTeam } from '../../context/TeamProvider';

import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

import { BUDGET_ITEMS_QUERY, BUDGET_ITEMS_WITH_DAILY_ITEMS_QUERY } from './budgetItemQuery';
import { usePortfolio } from '../../context/PortfolioProvider';

const EDIT_BUDGET_ITEM_MUTATION = gql`
  mutation EditBudgetItem(
    $budgetItemId: Int!
    $portfolioId: Int!
    $teamId: Int!
    $name: String
    $startDate: Date
    $endDate: Date
    $budgetAmount: Float
  ) {
    editBudgetItem(
      budgetItemId: $budgetItemId
      portfolioId: $portfolioId
      teamId: $teamId
      name: $name
      startDate: $startDate
      endDate: $endDate
      budgetAmount: $budgetAmount
    ) {
      budgetItemId
      name
      startDate
      endDate
      budgetAmount
      pacing
    }
  }
`;

function useEditBudgetItemMutation({
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

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const portfolioStart = portfolioMeta?.start;
  const portfolioEnd = portfolioMeta?.end;

  const [editBudgetItem, { data, loading, error }] = useMutation(EDIT_BUDGET_ITEM_MUTATION, {
    refetchQueries: [
      {
        query: BUDGET_ITEMS_QUERY,
        variables: {
          teamId,
          portfolioId,
          start: dayjs(portfolioStart).format(GLOBAL_DATE_FORMAT),
          end: dayjs(portfolioEnd).format(GLOBAL_DATE_FORMAT),
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

  return { editBudgetItem, data, loading, error };
}

export { EDIT_BUDGET_ITEM_MUTATION, useEditBudgetItemMutation };
