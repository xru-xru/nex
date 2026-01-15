import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import {
  PORTFOLIO_V2_DATES_FRAGMENT,
  PORTFOLIO_V2_META_BUDGET_FRAGMENT,
  PORTFOLIO_V2_META_FRAGMENT,
} from './fragments';

const PORTFOLIO_V2_META_QUERY = gql`
  query PortfolioV2Meta($teamId: Int!, $portfolioId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      ...portfolioV2Meta
      ...portfolioV2Dates
    }
  }
  ${PORTFOLIO_V2_META_FRAGMENT}
  ${PORTFOLIO_V2_DATES_FRAGMENT}
`;

const PORTFOLIO_V2_META_BUDGET_QUERY = gql`
  query PortfolioV2MetaBudget($teamId: Int!, $portfolioId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      ...portfolioV2MetaBudget
    }
  }
  ${PORTFOLIO_V2_META_BUDGET_FRAGMENT}
`;

type Options = {
  portfolioId: number;
  funnelStepId?: number;
  start?: string | Date;
  end?: string | Date;
  teamId?: number;
  onCompleted?: (data: any) => void;
};

function usePortfolioV2MetaQuery({ portfolioId, onCompleted }: Options) {
  const { teamId } = useTeam();

  return useQuery(PORTFOLIO_V2_META_QUERY, {
    variables: { teamId, portfolioId },
    fetchPolicy: 'cache-and-network',
    onCompleted,
    skip: !portfolioId,
    onError: (error) => {
      const portfolioInWrongTeamMessage = `Portfolio ${portfolioId} is not under team ${teamId}`;
      if (error.message === portfolioInWrongTeamMessage) {
        // Redirect to the team's portfolio list
        window.location.replace(`/portfolios`);
      }
    },
  });
}

function usePortfolioV2MetaBudgetQuery({ portfolioId }: Options) {
  const { teamId } = useTeam();

  return useQuery(PORTFOLIO_V2_META_BUDGET_QUERY, {
    skip: !portfolioId,
    variables: { teamId, portfolioId },
    fetchPolicy: 'cache-first',
  });
}

export {
  usePortfolioV2MetaQuery,
  usePortfolioV2MetaBudgetQuery,
  PORTFOLIO_V2_META_BUDGET_QUERY,
  PORTFOLIO_V2_META_QUERY,
};
