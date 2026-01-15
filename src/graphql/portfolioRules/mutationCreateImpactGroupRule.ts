import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaContentFilterInput, NexoyaCreateImpactGroupRuleMutationResponse } from '../../types';
import { IMPACT_GROUP_RULES_QUERY } from './queryImpactGroupRules';
import { useTeam } from '../../context/TeamProvider';
import useTabNewUpdates from '../../hooks/useTabNewUpdates';

const CREATE_IMPACT_GROUP_RULE_MUTATION = gql`
  mutation CreateImpactGroupRule(
    $filters: ImpactGroupRuleFiltersInput!
    $name: String!
    $portfolioId: Float!
    $teamId: Float!
    $impactGroupId: Float!
  ) {
    createImpactGroupRule(
      filters: $filters
      name: $name
      portfolioId: $portfolioId
      teamId: $teamId
      impactGroupId: $impactGroupId
    ) {
      mappedContentsCount
      impactGroupRule {
        impactGroupId
        name
      }
      clashingDiscoveredContents {
        contentRules {
          isApplied
          contentRule {
            contentRuleId
            name
          }
        }
        impactGroupRules {
          isApplied
          impactGroupRule {
            impactGroupId
            impactGroupRuleId
            name
          }
        }
        content {
          contentId
          title
        }
        discoveredContentId
        status
        contentRules {
          isApplied
          contentRule {
            contentRuleId
            name
          }
        }
      }
    }
  }
`;

type CreateImpactGroupRuleProps = {
  name: string;
  teamId: number;
  portfolioId: number;
  providerId: number;
  adAccountId?: number;
  impactGroupId: number;
  filters: NexoyaContentFilterInput[];
};

export function useCreateImpactGroupRuleMutation({
  portfolioId,
  onCompleted,
}: {
  portfolioId: number;
  onCompleted?: (data: { createImpactGroupRule: NexoyaCreateImpactGroupRuleMutationResponse }) => void;
}) {
  const { teamId } = useTeam();
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  return useMutation<
    { createImpactGroupRule: NexoyaCreateImpactGroupRuleMutationResponse },
    CreateImpactGroupRuleProps
  >(CREATE_IMPACT_GROUP_RULE_MUTATION, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      toast.success(`Impact group created with ${data.createImpactGroupRule.mappedContentsCount} mapped contents`);
      onCompleted?.(data);
      refreshCountDiscoveredContents();
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
