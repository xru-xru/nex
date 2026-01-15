import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaPortfolioV2 } from '../../types';

const ACTIVATE_ATTRIBUTION_RULE_MUTATION = gql`
  mutation ActivateAttribution(
    $attributedFunnelStepTitle: String!
    $createCopy: Boolean!
    $measuredFunnelStepId: Int!
    $portfolioId: Int!
    $teamId: Int!
  ) {
    activateAttribution(
      attributedFunnelStepTitle: $attributedFunnelStepTitle
      createCopy: $createCopy
      measuredFunnelStepId: $measuredFunnelStepId
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      portfolioId
    }
  }
`;

type ActivateAttributionProps = {
  attributedFunnelStepTitle: string;
  createCopy: boolean;
  measuredFunnelStepId: number;
  portfolioId: number;
  teamId: number;
};

export function useActivateAttributionMutation() {
  return useMutation<
    {
      activateAttribution: NexoyaPortfolioV2;
    },
    ActivateAttributionProps
  >(ACTIVATE_ATTRIBUTION_RULE_MUTATION, {
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: () => {
      toast.success(`Attribution has been successfully activated for this portfolio`);
    },
  });
}
