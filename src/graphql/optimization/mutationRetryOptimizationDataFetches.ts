import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { ACTIVE_OPTIMIZATION_QUERY } from './queryActiveOptimization';

const RETRY_OPTIMIZATION_DATA_FETCHES_QUERY = gql`
  mutation retryOptimizationDataFetches($teamId: Int!, $optimizationId: Int!) {
    retryOptimizationDataFetches(teamId: $teamId, optimizationId: $optimizationId)
  }
`;

function useRetryOptimizationDataFetches({ portfolioId, optimizationId }) {
  const { teamId } = useTeam();
  return useMutation(RETRY_OPTIMIZATION_DATA_FETCHES_QUERY, {
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

export { RETRY_OPTIMIZATION_DATA_FETCHES_QUERY, useRetryOptimizationDataFetches };
