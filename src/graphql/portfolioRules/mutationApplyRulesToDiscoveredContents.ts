import { gql, InternalRefetchQueryDescriptor, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  NexoyaApplyRulesToDiscoveredContentsMutationResponse,
  NexoyaApplyRulesToDiscoveredContentsRulesMapInput,
  NexoyaDiscoveredContentStatus,
} from '../../types';
import { useTeam } from '../../context/TeamProvider';
import { DISCOVERED_CONTENTS_QUERY } from './queryDiscoveredContents';

const APPLY_RULES_TO_DISCOVERED_CONTENTS_MUTATION = gql`
  mutation ApplyRulesToDiscoveredContents(
    $discoveredContentsWithRulesToApply: [ApplyRulesToDiscoveredContentsRulesMapInput!]!
    $portfolioId: Float!
    $teamId: Float!
  ) {
    applyRulesToDiscoveredContents(
      discoveredContentsWithRulesToApply: $discoveredContentsWithRulesToApply
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      appliedContentRules
      appliedImpactGroupRules
      appliedAttributionRules
    }
  }
`;

type ApplyRulesToDiscoveredContentsProps = {
  discoveredContentsWithRulesToApply: NexoyaApplyRulesToDiscoveredContentsRulesMapInput[];
  portfolioId: number;
  teamId: number;
};

type ApplyRulesToDiscoveredContentsResponse = {
  applyRulesToDiscoveredContents: NexoyaApplyRulesToDiscoveredContentsMutationResponse;
};

export function useApplyRulesToDiscoveredContentsMutation({
  portfolioId,
  status,
  refetchQueries = [],
}: {
  portfolioId: number;
  status: NexoyaDiscoveredContentStatus;
  refetchQueries?: InternalRefetchQueryDescriptor[];
}) {
  const { teamId } = useTeam();

  return useMutation<ApplyRulesToDiscoveredContentsResponse, ApplyRulesToDiscoveredContentsProps>(
    APPLY_RULES_TO_DISCOVERED_CONTENTS_MUTATION,
    {
      awaitRefetchQueries: true,
      onError: (error) => {
        console.error('Error applying rules to discovered contents:', error);
        toast.error(error.message || 'Failed to apply rules to discovered contents');
      },
      onCompleted: (data) => {
        const { appliedContentRules, appliedImpactGroupRules, appliedAttributionRules } =
          data.applyRulesToDiscoveredContents;

        let message = `${appliedContentRules} content rules applied successfully`;

        if (appliedImpactGroupRules) {
          message = `${appliedContentRules} content rules and ${appliedImpactGroupRules} impact group rules applied successfully`;
        } else if (appliedAttributionRules) {
          message = `${appliedContentRules} content rules and ${appliedAttributionRules} attribution rules applied successfully`;
        }

        toast.success(message);
      },
      refetchQueries: [
        {
          notifyOnNetworkStatusChange: true,
          query: DISCOVERED_CONTENTS_QUERY,
          variables: {
            status,
            teamId,
            portfolioId,
          },
          fetchPolicy: 'network-only',
        },
        ...refetchQueries,
      ],
    },
  );
}
