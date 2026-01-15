import { gql } from '@apollo/client';

export const BUDGET_ITEM_FRAGMENT = gql`
  fragment budgetItem on BudgetItem {
    budgetAmount
    budgetItemId
    status
    endDate
    name
    pacing
    startDate
    spendSoFar
  }
`;

export const BUDGET_ITEM_WITH_DAILY_ITEMS_FRAGMENT = gql`
  fragment budgetItemWithDailyItems on BudgetItem {
    budgetAmount
    budgetItemId
    status
    endDate
    name
    pacing
    startDate
    spendSoFar
    budgetDailyItems {
      budgetAmount
      date
    }
  }
`;

export const BUDGET_REALLOCATION_FRAGMENT = gql`
  fragment budgetReallocation on BudgetReallocation {
    pastBudget
    pastSpend
    dates {
      budgetAmount
      date
    }
  }
`;
