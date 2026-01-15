import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { SIMULATIONS_QUERY } from './simulationsQuery';
import { SIMULATION_BY_ID_QUERY } from './simulationByIdQuery';

const MAKE_SIMULATION_VISIBLE_TO_ALL_USERS = gql`
  mutation MakeSimulationVisibleToAllUsers($simulationId: Float!, $portfolioId: Float!, $teamId: Float!) {
    makeSimulationVisibleToAllUsers(simulationId: $simulationId, portfolioId: $portfolioId, teamId: $teamId) {
      simulationId
    }
  }
`;

function useMakeSimulationVisibleToAllUsers({ portfolioId }) {
  const { teamId } = useTeam();

  const [changeSimulationVisibility, { data, loading, error }] = useMutation(MAKE_SIMULATION_VISIBLE_TO_ALL_USERS, {
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
          simulationId: mutationResult?.data?.makeSimulationVisibleToAllUsers?.simulationId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });

  return { changeSimulationVisibility, data, loading, error };
}

export { MAKE_SIMULATION_VISIBLE_TO_ALL_USERS, useMakeSimulationVisibleToAllUsers };
