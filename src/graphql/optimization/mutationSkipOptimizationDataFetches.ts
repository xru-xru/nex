import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { ACTIVE_OPTIMIZATION_QUERY } from './queryActiveOptimization';

const SKIP_OPTIMIZATION_DATA_FETCHES_QUERY = gql`
  mutation skipOptimizationDataFetches($teamId: Int!, $optimizationId: Int!) {
    skipOptimizationDataFetches(teamId: $teamId, optimizationId: $optimizationId)
  }
`;

function useSkipOptimizationDataFetches({ portfolioId, optimizationId }) {
  const { teamId } = useTeam();
  return useMutation(SKIP_OPTIMIZATION_DATA_FETCHES_QUERY, {
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

export { SKIP_OPTIMIZATION_DATA_FETCHES_QUERY, useSkipOptimizationDataFetches };
