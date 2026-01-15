import { gql, InternalRefetchQueryDescriptor, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  NexoyaApplyRulesToDiscoveredContentsMutationResponse,
  NexoyaApplyRulesToDiscoveredContentsRulesMapInput,
  NexoyaDiscoveredContentStatus,
} from '../../types';
import { useTeam } from '../../context/TeamProvider';
import { DISCOVERED_CONTENTS_QUERY } from './queryDiscoveredContents';

const SWITCH_MANUAL_CONTENTS_TO_RULE_BASED_MUTATION = gql`
  mutation SwitchManualContentsToRuleBased(
    $teamId: Float!
    $portfolioId: Float!
    $discoveredContentsWithRulesToApply: [ApplyRulesToDiscoveredContentsRulesMapInput!]!
  ) {
    switchManualContentsToRuleBased(
      teamId: $teamId
      portfolioId: $portfolioId
      discoveredContentsWithRulesToApply: $discoveredContentsWithRulesToApply
    ) {
      appliedContentRules
      appliedImpactGroupRules
      appliedAttributionRules
    }
  }
`;

type SwitchManualContentsToRuleBasedProps = {
  discoveredContentsWithRulesToApply: NexoyaApplyRulesToDiscoveredContentsRulesMapInput[];
  portfolioId: number;
  teamId: number;
};

type SwitchManualContentsToRuleBasedResponse = {
  switchManualContentsToRuleBased: NexoyaApplyRulesToDiscoveredContentsMutationResponse;
};

export function useSwitchManualContentsToRuleBasedMutation({
  portfolioId,
  status,
  refetchQueries = [],
}: {
  portfolioId: number;
  status: NexoyaDiscoveredContentStatus;
  refetchQueries?: InternalRefetchQueryDescriptor[];
}) {
  const { teamId } = useTeam();

  return useMutation<SwitchManualContentsToRuleBasedResponse, SwitchManualContentsToRuleBasedProps>(
    SWITCH_MANUAL_CONTENTS_TO_RULE_BASED_MUTATION,
    {
      awaitRefetchQueries: true,
      onError: (error) => {
        console.error('Error switching manual contents to rule based:', error);
        toast.error(error.message || 'Failed to switch manual contents to rule based');
      },
      onCompleted: (data) => {
        const { appliedContentRules, appliedImpactGroupRules, appliedAttributionRules } =
          data.switchManualContentsToRuleBased;

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
