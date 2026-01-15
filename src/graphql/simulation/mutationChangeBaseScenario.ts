import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { SIMULATION_BY_ID_QUERY } from './simulationByIdQuery';

const CHANGE_BASE_SCENARIO_MUTATION = gql`
  mutation ChangeBaseScenario(
    $simulationId: Float!
    $newBaseScenarioId: Float!
    $portfolioId: Float!
    $teamId: Float!
  ) {
    changeBaseScenario(
      simulationId: $simulationId
      newBaseScenarioId: $newBaseScenarioId
      portfolioId: $portfolioId
      teamId: $teamId
    )
  }
`;

function useChangeBaseScenarioMutation({ portfolioId, simulationId, scenarioId }) {
  const { teamId } = useTeam();

  const [changeBaseScenario, { data, loading, error }] = useMutation(CHANGE_BASE_SCENARIO_MUTATION, {
    awaitRefetchQueries: true,
    variables: {
      teamId,
      portfolioId,
      simulationId,
      newBaseScenarioId: scenarioId,
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
    ],
  });

  return { changeBaseScenario, data, loading, error };
}

export { CHANGE_BASE_SCENARIO_MUTATION, useChangeBaseScenarioMutation };
