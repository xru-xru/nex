import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

import { SIMULATIONS_QUERY } from './simulationsQuery';

const RUN_SIMULATION_MUTATION = gql`
  mutation StartSimulation($simulationId: Float!, $portfolioId: Float!, $teamId: Float!) {
    runSimulation(simulationId: $simulationId, portfolioId: $portfolioId, teamId: $teamId) {
      createdAt
      end
      name
      simulationId
      start
      state
    }
  }
`;

function useRunSimulationMutation({ portfolioId }) {
  const { teamId } = useTeam();

  const [runSimulation, { data, loading, error }] = useMutation(RUN_SIMULATION_MUTATION, {
    refetchQueries: [
      {
        query: SIMULATIONS_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
    onCompleted: () => {
      track(EVENT.SIMULATION_RUN);
    },
  });

  return { runSimulation, data, loading, error };
}

export { RUN_SIMULATION_MUTATION, useRunSimulationMutation };
