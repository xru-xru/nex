import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

import { SIMULATIONS_QUERY } from './simulationsQuery';

const EDIT_SIMULATION_MUTATION = gql`
  mutation EditSimulation(
    $end: Date
    $name: String
    $start: Date
    $budgetStepSize: Int
    $budgetSteps: [SimulationBudgetStepInput!]
    $teamId: Float!
    $simulationId: Float!
    $portfolioId: Float!
    $ignoreContentBudgetLimits: Boolean
    $skipNonOptimizedContentBudgets: Boolean
    $budgetPacing: SimulationBudgetPacing
  ) {
    editSimulation(
      ignoreContentBudgetLimits: $ignoreContentBudgetLimits
      skipNonOptimizedContentBudgets: $skipNonOptimizedContentBudgets
      budgetPacing: $budgetPacing
      simulationId: $simulationId
      budgetStepSize: $budgetStepSize
      budgetSteps: $budgetSteps
      end: $end
      name: $name
      portfolioId: $portfolioId
      start: $start
      teamId: $teamId
    ) {
      simulationId
    }
  }
`;

function useEditSimulationMutation({ portfolioId }) {
  const { teamId } = useTeam();

  const [editSimulation, { data, loading, error }] = useMutation(EDIT_SIMULATION_MUTATION, {
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
      track(EVENT.SIMULATION_CREATE);
    },
  });

  return { editSimulation, data, loading, error };
}

export { EDIT_SIMULATION_MUTATION, useEditSimulationMutation };
