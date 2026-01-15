import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { OPTIMIZATION_LIST } from './queryOptimizationList';

const CONCLUDE_OPTIMIZATION_BUDGET_PROPOSAL = gql`
  mutation concludeOptimizationBudgetProposal($teamId: Int!, $optimizationId: Int!, $accept: Boolean!) {
    concludeOptimizationBudgetProposal(teamId: $teamId, optimizationId: $optimizationId, accept: $accept) {
      optimizationId
    }
  }
`;

function useConcludeOptimizationBudgetProposal({ optimizationId, portfolioId, accept }) {
  const { teamId } = useTeam();
  return useMutation(CONCLUDE_OPTIMIZATION_BUDGET_PROPOSAL, {
    variables: {
      teamId,
      optimizationId,
      accept,
    },
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: OPTIMIZATION_LIST,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });
}

export { CONCLUDE_OPTIMIZATION_BUDGET_PROPOSAL, useConcludeOptimizationBudgetProposal };
