import { gql, useQuery } from '@apollo/client';

import { useTeam } from 'context/TeamProvider';

const PORTFOLIO_DASHBOARD_LIMIT = 50;

const PORTFOLIO_DASHBOARD_QUERY = gql`
  query PortfolioDashboard(
    $dateFrom: Date!
    $dateTo: Date!
    $teamId: Int!
    $completed: Boolean
    $search: String
    $limit: Int
  ) {
    portfolioDashboard(
      dateFrom: $dateFrom
      dateTo: $dateTo
      teamId: $teamId
      completed: $completed
      search: $search
      limit: $limit
    ) {
      notifications {
        title
        date
        type
        ... on PortfolioDashboardOptimizationNotification {
          payload {
            optimizationId
            portfolioId
          }
        }
        ... on PortfolioDashboardBudgetProposalNotification {
          payload {
            optimizationId
            portfolioId
            budgetProposalId
          }
        }
      }
      elements {
        portfolioId
        title
        goal
        startDate
        endDate
        adSpend {
          realized
          planned
          percentage
        }
        achieved
        costPer
        roas
      }
    }
  }
`;
type Options = {
  dateFrom?: string;
  dateTo?: string;
  completed?: boolean;
  search?: string;
};

function usePortfolioDashboardQuery({ dateFrom, dateTo, completed, search }: Options = {}): any {
  const { teamId } = useTeam();
  const query = useQuery(PORTFOLIO_DASHBOARD_QUERY, {
    variables: {
      teamId,
      dateFrom,
      dateTo,
      completed,
      search,
      limit: PORTFOLIO_DASHBOARD_LIMIT,
    },
  });
  return query;
}

export { PORTFOLIO_DASHBOARD_QUERY, usePortfolioDashboardQuery };
