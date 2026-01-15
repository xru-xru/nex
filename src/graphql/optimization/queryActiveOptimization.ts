import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { ACTIVE_OPTIMIZATION_FRAGMENT } from './fragments';

const ACTIVE_OPTIMIZATION_QUERY = gql`
  query ActiveOptimization($portfolioId: Int!, $teamId: Int!) {
    portfolioV2(portfolioId: $portfolioId, teamId: $teamId) {
      portfolioId
      activeOptimization {
        ...ActiveOptimization
      }
    }
  }
  ${ACTIVE_OPTIMIZATION_FRAGMENT}
`;

type Options = {
  portfolioId: number;
};

function useActiveOptimization({ portfolioId }: Options) {
  const { teamId } = useTeam();
  return useQuery(ACTIVE_OPTIMIZATION_QUERY, {
    notifyOnNetworkStatusChange: true,
    skip: !teamId || !portfolioId,
    variables: {
      teamId,
      portfolioId,
    },
  });
}

export { ACTIVE_OPTIMIZATION_QUERY, useActiveOptimization };
