import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import removeApolloCacheKeys from '../../utils/removeApolloCacheKeys';

import { PORTFOLIOS_QUERY } from './queryPortfolios';

const DEACTIVATE_PORTFOLIO_MUTATION = gql`
  mutation deactivatePortfolio($teamId: Int!, $portfolioId: Int!) {
    deactivatePortfolio(teamId: $teamId, portfolioId: $portfolioId)
  }
`;
type Options = {
  portfolioId: number;
};

function useDeactivatePortfolioMutation({ portfolioId }: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(DEACTIVATE_PORTFOLIO_MUTATION, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
    },
    refetchQueries: [
      {
        query: PORTFOLIOS_QUERY,
        variables: {
          teamId: teamId,
        },
      },
    ],
    update: (cache) => removeApolloCacheKeys(cache, 'portfolios'),
  });
  return [mutation, state];
}

export { DEACTIVATE_PORTFOLIO_MUTATION, useDeactivatePortfolioMutation };
