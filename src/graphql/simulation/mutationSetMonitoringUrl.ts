import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { SIMULATIONS_QUERY } from './simulationsQuery';
import { SIMULATION_BY_ID_QUERY } from './simulationByIdQuery';

const SET_SIMULATION_MONITOR_URL_QUERY = gql`
  mutation SetMonitoringURL($simulationId: Float!, $portfolioId: Float!, $teamId: Float!, $monitoringUrl: String) {
    setSimulationMonitoringUrl(
      monitoringUrl: $monitoringUrl
      simulationId: $simulationId
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      simulationId
      monitoringUrl
    }
  }
`;

function useSimulationSetMonitorUrlMutation({ portfolioId }) {
  const { teamId } = useTeam();

  const [setMonitorUrl, { data, loading, error }] = useMutation(SET_SIMULATION_MONITOR_URL_QUERY, {
    refetchQueries: (mutationResult) => [
      {
        query: SIMULATIONS_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
      {
        query: SIMULATION_BY_ID_QUERY,
        variables: {
          teamId,
          portfolioId,
          simulationId: mutationResult?.data?.setSimulationMonitoringUrl?.simulationId, // Pass simulationId dynamically
        },
        fetchPolicy: 'network-only',
      },
    ],
  });

  return { setMonitorUrl, data, loading, error };
}

export { SET_SIMULATION_MONITOR_URL_QUERY, useSimulationSetMonitorUrlMutation };
