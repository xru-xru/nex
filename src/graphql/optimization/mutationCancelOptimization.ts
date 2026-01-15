import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { ACTIVE_OPTIMIZATION_QUERY } from './queryActiveOptimization';

const CANCEL_OPTIMIZATION = gql`
  mutation cancelOptimization($teamId: Int!, $optimizationId: Int!) {
    cancelOptimization(teamId: $teamId, optimizationId: $optimizationId)
  }
`;

function useCancelOptimization({ optimizationId, portfolioId }) {
  const { teamId } = useTeam();
  return useMutation(CANCEL_OPTIMIZATION, {
    variables: {
      teamId,
      optimizationId,
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

export { CANCEL_OPTIMIZATION, useCancelOptimization };
