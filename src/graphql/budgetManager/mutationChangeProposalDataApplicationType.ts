import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

import { NexoyaBudgetProposal, NexoyaBudgetProposalDataApplicationType } from 'types';

import { useTeam } from 'context/TeamProvider';

const CHANGE_PROPOSAL_DATA_APPLICATION_TYPE_MUTATION = gql`
  mutation ChangeProposalDataApplicationType(
    $teamId: Int!
    $optimizationId: Int!
    $portfolioContentId: Float!
    $newApplicationType: BudgetProposalDataApplicationType!
    $portfolioId: Int!
  ) {
    changeProposalDataApplicationType(
      teamId: $teamId
      optimizationId: $optimizationId
      portfolioContentId: $portfolioContentId
      newApplicationType: $newApplicationType
      portfolioId: $portfolioId
    ) {
      optimizationId
      timestampCreated
      timestampApplied
      status
      budgetProposalData {
        portfolioContentId
        applicationType
      }
    }
  }
`;

type Props = {
  optimizationId: number;
};
export function useChangeProposalDataApplicationTypeMutation({ optimizationId }: Props) {
  const { teamId } = useTeam();

  return useMutation<
    NexoyaBudgetProposal,
    {
      optimizationId?: number;
      teamId?: number;
      portfolioContentId?: number;
      newApplicationType?: NexoyaBudgetProposalDataApplicationType;
    }
  >(CHANGE_PROPOSAL_DATA_APPLICATION_TYPE_MUTATION, {
    awaitRefetchQueries: true,
    variables: {
      teamId,
      optimizationId,
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });
}
