import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  NexoyaImpactGroupRuleEditInput,
  NexoyaUpdateImpactGroupRuleAndContentsMutationResponse,
  NexoyaUpdateImpactGroupRuleFiltersContentActionInput,
} from '../../types';
import { useTeam } from '../../context/TeamProvider';
import { IMPACT_GROUP_RULES_QUERY } from './queryImpactGroupRules';
import useTabNewUpdates from '../../hooks/useTabNewUpdates';

const UPDATE_IMPACT_GROUP_RULE_MUTATION = gql`
  mutation UpdateImpactGroupRule(
    $impactGroupRuleEdit: ImpactGroupRuleEditInput!
    $impactGroupRuleId: Float!
    $portfolioId: Float!
    $teamId: Float!
    $contentActions: [UpdateImpactGroupRuleFiltersContentActionInput]
  ) {
    updateImpactGroupRule(
      impactGroupRuleEdit: $impactGroupRuleEdit
      impactGroupRuleId: $impactGroupRuleId
      portfolioId: $portfolioId
      teamId: $teamId
      contentActions: $contentActions
    ) {
      updatedImpactGroupRule {
        name
        matchingDiscoveredContentsCount
        appliedDiscoveredContents {
          discoveredContentId
        }
      }
    }
  }
`;

type UpdateImpactGroupRuleProps = {
  teamId: number;
  portfolioId: number;
  impactGroupRuleId: number;
  impactGroupRuleEdit: NexoyaImpactGroupRuleEditInput;
  contentActions?: NexoyaUpdateImpactGroupRuleFiltersContentActionInput[];
};

export function useUpdateImpactGroupRuleMutation({
  portfolioId,
  onCompleted,
}: {
  portfolioId: number;
  onCompleted?: () => void;
}) {
  const { teamId } = useTeam();
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  return useMutation<
    { updateImpactGroupRule: NexoyaUpdateImpactGroupRuleAndContentsMutationResponse },
    UpdateImpactGroupRuleProps
  >(UPDATE_IMPACT_GROUP_RULE_MUTATION, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.updateImpactGroupRule) {
        const rule = data.updateImpactGroupRule.updatedImpactGroupRule;
        const contentCount = rule?.matchingDiscoveredContentsCount || 0;

        toast.success(`Impact group rule ${rule?.name} updated successfully`, {
          description: `The impact group rule has ${contentCount} matching contents`,
        });
        refreshCountDiscoveredContents();
        onCompleted();
      } else {
        toast.error('Failed to update impact group rule');
      }
    },
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: IMPACT_GROUP_RULES_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });
}
