import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { SIMULATION_BY_ID_QUERY } from './simulationByIdQuery';
import { SIMULATIONS_QUERY } from './simulationsQuery';

const APPLY_SCENARIO_MUTATION = gql`
  mutation ApplyScenario($simulationId: Float!, $scenarioId: Float!, $portfolioId: Float!, $teamId: Float!) {
    applySimulation(scenarioId: $scenarioId, simulationId: $simulationId, portfolioId: $portfolioId, teamId: $teamId) {
      simulationId
    }
  }
`;

function useApplyScenarioMutation({ portfolioId, simulationId, scenarioId }) {
  const { teamId } = useTeam();

  const [applyScenario, { data, loading, error }] = useMutation(APPLY_SCENARIO_MUTATION, {
    awaitRefetchQueries: true,
    variables: {
      teamId,
      portfolioId,
      simulationId,
      scenarioId,
    },
    refetchQueries: [
      {
        query: SIMULATION_BY_ID_QUERY,
        variables: {
          teamId,
          portfolioId,
          simulationId,
        },
        fetchPolicy: 'network-only',
      },
      {
        query: SIMULATIONS_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });

  return { applyScenario, data, loading, error };
}

export { APPLY_SCENARIO_MUTATION, useApplyScenarioMutation };
