import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import {
  PORTFOLIO_2_CONTENT,
  PORTFOLIO_2_DATES_FRAGMENT,
  PORTFOLIO_2_DEFAULT_OPTIMIZATION_TARGET,
  PORTFOLIO_2_META_FRAGMENT,
  PORTFOLIO_FUNNEL_STEP,
} from './fragments';
import dayjs from 'dayjs';

const PORTFOLIO_QUERY = gql`
  query Portfolio($portfolioId: Int!, $teamId: Int!, $withBudget: Boolean!, $dateFrom: DateTime, $dateTo: DateTime) {
    portfolio(portfolioId: $portfolioId, teamId: $teamId, dateFrom: $dateFrom, dateTo: $dateTo) {
      ...portfolioMeta
      ...portfolioDates
      ...portfolioContent
      ...portfolioFunnelStep
      budget @include(if: $withBudget) {
        budgetDetails {
          providerId
          totalAllocatedValue
          weeklyBudgets {
            providerId
            startDate
            endDate
            allocatedValue
            realizedValue
          }
        }
        budgetTotals {
          startDate
          endDate
          allocatedValue
        }
        allocatedValue
        realizedValue
      }
      ...portfolioDefaultOptimizationTarget
      optimizationRiskLevel
      optimizationType
    }
  }
  ${PORTFOLIO_2_META_FRAGMENT}
  ${PORTFOLIO_2_DATES_FRAGMENT}
  ${PORTFOLIO_2_CONTENT}
  ${PORTFOLIO_FUNNEL_STEP}
  ${PORTFOLIO_2_DEFAULT_OPTIMIZATION_TARGET}
`;
type Options = {
  portfolioId: number;
  withBudget?: boolean;
  skip?: boolean;
  dateFrom?: Date;
  dateTo?: Date | string;
};

function usePortfolioQuery({ portfolioId, withBudget = false, dateFrom, dateTo }: Options) {
  const { teamId } = useTeam();

  const query = useQuery(PORTFOLIO_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
      withBudget,
      dateFrom: dayjs(dateFrom)?.utc().toDate(),
      dateTo: dayjs(dateTo)?.utc().toDate(),
    },
    skip: !portfolioId,
  });
  return query;
}

export { usePortfolioQuery };
