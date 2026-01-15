import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { SIMULATIONS_QUERY } from './simulationsQuery';

const ARCHIVE_SIMULATION_MUTATION = gql`
  mutation ArchiveSimulation($simulationId: Float!, $portfolioId: Float!, $teamId: Float!, $isArchived: Boolean!) {
    setSimulationIsArchived(
      isArchived: $isArchived
      simulationId: $simulationId
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      simulationId
      isArchived
    }
  }
`;

function useArchiveSimulationMutation({ portfolioId }) {
  const { teamId } = useTeam();

  const [archiveSimulation, { data, loading, error }] = useMutation(ARCHIVE_SIMULATION_MUTATION, {
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
  });

  return { archiveSimulation, data, loading, error };
}

export { ARCHIVE_SIMULATION_MUTATION, useArchiveSimulationMutation };
