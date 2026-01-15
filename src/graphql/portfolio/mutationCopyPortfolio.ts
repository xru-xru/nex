import { gql, useMutation } from '@apollo/client';

import { useTeam } from 'context/TeamProvider';

import removeApolloCacheKeys from '../../utils/removeApolloCacheKeys';

const COPY_PORTFOLIO_MUTATION = gql`
  mutation CopyPortfolio($teamId: Int!, $portfolioId: Int!) {
    copyPortfolio(teamId: $teamId, portfolioId: $portfolioId) {
      portfolioId
    }
  }
`;
type Options = {
  portfolioId: number;
};

function useCopyPortfolioMutation({ portfolioId }: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(COPY_PORTFOLIO_MUTATION, {
    variables: {
      teamId,
      portfolioId,
    },
    update: (cache) => removeApolloCacheKeys(cache, 'portfolio'),
  });
  return [mutation, state];
}

export { COPY_PORTFOLIO_MUTATION, useCopyPortfolioMutation };
