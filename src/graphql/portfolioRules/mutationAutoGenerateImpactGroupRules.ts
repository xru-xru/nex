import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useTeam } from '../../context/TeamProvider';
import { IMPACT_GROUP_RULES_QUERY } from './queryImpactGroupRules';
import useTabNewUpdates from '../../hooks/useTabNewUpdates';

const AUTO_GENERATE_IMPACT_GROUP_RULES_MUTATION = gql`
  mutation AutoGenerateImpactGroupRules($portfolioId: Float!, $teamId: Float!) {
    autoGenerateImpactGroupRules(portfolioId: $portfolioId, teamId: $teamId) {
      impactGroupRuleId
      name
      impactGroupId
      matchingDiscoveredContentsCount
      appliedDiscoveredContents {
        discoveredContentId
        content {
          contentId
          title
          provider {
            provider_id
            name
          }
          contentType {
            name
          }
          parent {
            title
          }
        }
        impactGroupRules {
          impactGroupRule {
            impactGroupId
            impactGroupRuleId
            name
          }
        }
      }
      filters {
        providers {
          adAccountIds
          providerId
        }
        contentFilters {
          fieldName
          operator
          value {
            date
            number
            numberArr
            string
            stringArr
          }
        }
      }
    }
  }
`;

export function useAutoGenerateImpactGroupRulesMutation({
  portfolioId,
  onCompleted,
}: {
  portfolioId: number;
  onCompleted?: (data: { autoGenerateImpactGroupRules: any }) => void;
}) {
  const { teamId } = useTeam();
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  return useMutation(AUTO_GENERATE_IMPACT_GROUP_RULES_MUTATION, {
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.autoGenerateImpactGroupRules) {
        const result = data.autoGenerateImpactGroupRules;
        toast.success(`Auto-generated ${result?.length} impact group rules successfully`);
        refreshCountDiscoveredContents();
        onCompleted?.(data);
      }
    },
    refetchQueries: [
      {
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
