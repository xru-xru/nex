import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

export const OPTIMIZATION_PORTFOLIO_EVENTS = gql`
  query OptimizationPortfolioEvents($teamId: Int!, $portfolioId: Int!, $optimizationId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      optimization(optimizationId: $optimizationId) {
        optimizationId
        portfolioEvents {
          assetUrl
          name
          start
          end
        }
      }
    }
  }
`;

type Props = {
  portfolioId: number;
  optimizationId: number;
};

function useOptimizationPortfolioEvents({ portfolioId, optimizationId }: Props) {
  const { teamId } = useTeam();
  return useQuery(OPTIMIZATION_PORTFOLIO_EVENTS, {
    variables: {
      teamId,
      portfolioId,
      optimizationId,
    },
  });
}

export { useOptimizationPortfolioEvents };
