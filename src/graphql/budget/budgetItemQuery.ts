import { gql, useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import { useTeam } from '../../context/TeamProvider';

import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

import { BUDGET_ITEM_FRAGMENT, BUDGET_ITEM_WITH_DAILY_ITEMS_FRAGMENT, BUDGET_REALLOCATION_FRAGMENT } from './fragments';

export const BUDGET_ITEMS_WITH_DAILY_ITEMS_QUERY = gql`
  query BudgetItemsForChart($teamId: Int!, $portfolioId: Int!, $start: Date!, $end: Date!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      budget {
        spent {
          totalSpent
          dailySpendings(start: $start, end: $end) {
            day
            providers {
              value {
                adSpend
              }
              providerId
            }
          }
        }
        budgetReallocation {
          ...budgetReallocation
        }
        budgetItems(start: $start, end: $end) {
          ...budgetItemWithDailyItems
        }
      }
    }
  }
  ${BUDGET_REALLOCATION_FRAGMENT}
  ${BUDGET_ITEM_WITH_DAILY_ITEMS_FRAGMENT}
`;

const BUDGET_ITEMS_QUERY = gql`
  query BudgetItemsTable($teamId: Int!, $portfolioId: Int!, $start: Date!, $end: Date!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      budget {
        budgetItems(start: $start, end: $end) {
          ...budgetItem
        }
      }
    }
  }
  ${BUDGET_ITEM_FRAGMENT}
`;

type Options = {
  portfolioId: number;
  start: string | Date;
  end: string | Date;
};

function useBudgetItemQuery({ portfolioId, start, end }: Options): any {
  const { teamId } = useTeam();

  const query = useQuery(BUDGET_ITEMS_QUERY, {
    skip: !teamId || !portfolioId || !start || !end,
    variables: {
      teamId,
      portfolioId,
      start: dayjs(start).format(GLOBAL_DATE_FORMAT),
      end: dayjs(end).format(GLOBAL_DATE_FORMAT),
    },
  });
  return query;
}

function useBudgetItemWithDailyItemsQuery({ portfolioId, start, end }: Options): any {
  const { teamId } = useTeam();

  const query = useQuery(BUDGET_ITEMS_WITH_DAILY_ITEMS_QUERY, {
    skip: !teamId || !portfolioId || !start || !end,
    variables: {
      teamId,
      portfolioId,
      start: dayjs(start).format(GLOBAL_DATE_FORMAT),
      end: dayjs(end).format(GLOBAL_DATE_FORMAT),
    },
  });
  return query;
}

export { BUDGET_ITEMS_QUERY, useBudgetItemQuery, useBudgetItemWithDailyItemsQuery };
