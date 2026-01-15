import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';
import { ACTIVE_OPTIMIZATION_QUERY } from './queryActiveOptimization';

const MAKE_OPTIMIZATION_VISIBLE_TO_ALL_USERS = gql`
  mutation MakeOptimizationVisibleToAllUsers($optimizationId: Int!, $portfolioId: Int!, $teamId: Int!) {
    makeOptimizationVisibleToAllUsers(optimizationId: $optimizationId, portfolioId: $portfolioId, teamId: $teamId) {
      optimizationId
    }
  }
`;

function useMakeOptimizationVisibleToAllUsers({ optimizationId, portfolioId, accept }) {
  const { teamId } = useTeam();
  return useMutation(MAKE_OPTIMIZATION_VISIBLE_TO_ALL_USERS, {
    variables: {
      teamId,
      optimizationId,
      accept,
    },
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: ACTIVE_OPTIMIZATION_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });
}

export { MAKE_OPTIMIZATION_VISIBLE_TO_ALL_USERS, useMakeOptimizationVisibleToAllUsers };
