import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const UPDATE_BUDGET_DETAIL_MUTATION = gql`
  mutation updateBudgetDetail($teamId: Int!, $portfolioId: Int!, $budgetDetail: BudgetDetailInput!) {
    updateBudgetDetail(teamId: $teamId, portfolioId: $portfolioId, budgetDetail: $budgetDetail) {
      providerId
    }
  }
`;
type Options = {
  portfolioId: number;
};
type ExtendedOptions = {
  providerId: number;
  startDate: Date;
  endDate: Date;
  allocatedValue: number;
};

function useUpdateBudgetDetailMutation({ portfolioId }: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(UPDATE_BUDGET_DETAIL_MUTATION, {
    notifyOnNetworkStatusChange: true,
    awaitRefetchQueries: true,
    variables: {
      teamId,
      portfolioId,
    },
  });

  function extendMutation(budgetDetail: ExtendedOptions) {
    return mutation({
      variables: {
        teamId,
        portfolioId,
        budgetDetail: budgetDetail,
      },
    });
  }

  return [mutation, state, extendMutation];
}

export { UPDATE_BUDGET_DETAIL_MUTATION, useUpdateBudgetDetailMutation };
