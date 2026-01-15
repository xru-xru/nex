import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';

import { useTeam } from '../../context/TeamProvider';

import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

import { SIMULATIONS_QUERY } from './simulationsQuery';

const SAVE_SIMULATION_FOR_LATER_MUTATION = gql`
  mutation EndSimulation($simulationId: Int!, $portfolioId: Int!, $teamId: Int!) {
    saveForLater(simulationId: $simulationId, portfolioId: $portfolioId, teamId: $teamId) {
      simulationId
    }
  }
`;

function useEndSimulationMutation({ portfolioId, start, end }) {
  const { teamId } = useTeam();

  const [saveForLater, { data, loading, error }] = useMutation(SAVE_SIMULATION_FOR_LATER_MUTATION, {
    refetchQueries: [
      {
        query: SIMULATIONS_QUERY,
        variables: {
          teamId,
          portfolioId,
          start: dayjs(start).format(GLOBAL_DATE_FORMAT),
          end: dayjs(end).format(GLOBAL_DATE_FORMAT),
        },
        fetchPolicy: 'network-only',
      },
    ],
  });

  return { saveForLater, data, loading, error };
}

export { SAVE_SIMULATION_FOR_LATER_MUTATION, useEndSimulationMutation };
