import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

import { SIMULATIONS_QUERY } from './simulationsQuery';

const CREATE_SIMULATION_MUTATION = gql`
  mutation SaveSimulationForLater(
    $budgetStepSize: Int!
    $end: Date!
    $name: String!
    $portfolioId: Int!
    $start: Date!
    $teamId: Int!
    $budgetSteps: [SimulationBudgetStepInput!]!
    $ignoreContentBudgetLimits: Boolean!
    $skipNonOptimizedContentBudgets: Boolean!
    $budgetPacing: SimulationBudgetPacing
  ) {
    createSimulation(
      ignoreContentBudgetLimits: $ignoreContentBudgetLimits
      skipNonOptimizedContentBudgets: $skipNonOptimizedContentBudgets
      budgetPacing: $budgetPacing
      budgetStepSize: $budgetStepSize
      budgetSteps: $budgetSteps
      end: $end
      name: $name
      portfolioId: $portfolioId
      start: $start
      teamId: $teamId
    ) {
      createdAt
      end
      name
      simulationId
      start
      state
    }
  }
`;

function useCreateSimulationMutation({ portfolioId }) {
  const { teamId } = useTeam();

  const [createSimulation, { data, loading, error }] = useMutation(CREATE_SIMULATION_MUTATION, {
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

  return { createSimulation, data, loading, error };
}

export { CREATE_SIMULATION_MUTATION, useCreateSimulationMutation };
