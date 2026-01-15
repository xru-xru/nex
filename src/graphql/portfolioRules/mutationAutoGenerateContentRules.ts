import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useTeam } from '../../context/TeamProvider';
import { CONTENT_RULES_QUERY } from './queryContentRules';
import useTabNewUpdates from '../../hooks/useTabNewUpdates';

const AUTO_GENERATE_CONTENT_RULES_MUTATION = gql`
  mutation AutoGenerateContentRules($portfolioId: Float!, $teamId: Float!) {
    autoGenerateContentRules(portfolioId: $portfolioId, teamId: $teamId) {
      contentRuleId
      name
      matchingDiscoveredContentsCount
      appliedDiscoveredContents {
        discoveredContentId
        contentRules {
          isApplied
          contentRule {
            name
            contentRuleId
          }
        }
        impactGroupRules {
          isApplied
          impactGroupRule {
            impactGroupId
            name
            impactGroupRuleId
          }
        }
        content {
          contentId
          title
          parent {
            title
          }
          contentType {
            name
            collection_type_id
          }
          provider {
            provider_id
            name
          }
        }
      }
      funnelStepMappings {
        funnelStepId
        mapping {
          conversions {
            accountConversionIds
            conversionName
            metricId
          }
          type
          metricId
          searchTitle

          utmParams {
            type
            values
          }
        }
      }
      filters {
        adAccountIds
        providerId
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

export function useAutoGenerateContentRulesMutation({
  portfolioId,
  onCompleted,
}: {
  portfolioId: number;
  onCompleted?: (data: { autoGenerateContentRules: any }) => void;
}) {
  const { teamId } = useTeam();
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  return useMutation(AUTO_GENERATE_CONTENT_RULES_MUTATION, {
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.autoGenerateContentRules) {
        const result = data.autoGenerateContentRules;
        toast.success(`Auto-generated ${result?.length} content rules successfully`);
        refreshCountDiscoveredContents();
        onCompleted?.(data);
      }
    },
    refetchQueries: [
      {
        query: CONTENT_RULES_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });
}
