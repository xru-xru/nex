import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaManualContentFunnelStepMappingInput } from '../../types';

const ADD_MANUAL_CONTENTS_TO_PORTFOLIO_MUTATION = gql`
  mutation AddManualContentsToPortfolio(
    $teamId: Int!
    $portfolioId: Int!
    $collectionIds: [Float!]!
    $funnelStepMappings: [ManualContentFunnelStepMappingInput!]
    $impactGroupId: Int
  ) {
    addManualContentsToPorfolio(
      teamId: $teamId
      portfolioId: $portfolioId
      collectionIds: $collectionIds
      funnelStepMappings: $funnelStepMappings
      impactGroupId: $impactGroupId
    ) {
      portfolioContentId
    }
  }
`;

type AddManualContentsToPortfolioMutationProps = {
  teamId: number;
  portfolioId: number;
  collectionIds: number[];
  funnelStepMappings?: NexoyaManualContentFunnelStepMappingInput[];
  impactGroupId?: number;
};

export function useAddManualContentsToPortfolioMutation({ onCompleted, onError }) {
  return useMutation<{ addManualContentsToPorfolio: any }, AddManualContentsToPortfolioMutationProps>(
    ADD_MANUAL_CONTENTS_TO_PORTFOLIO_MUTATION,
    {
      awaitRefetchQueries: true,
      onError: (error) => {
        console.error('Error adding manual contents to portfolio:', error);
        toast.error(error.message || 'Failed to add manual contents to portfolio');
        onError();
      },
      onCompleted,
    },
  );
}
