import { gql, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';
import { NexoyaContentRule } from '../../types';

export const CONTENT_RULES_QUERY = gql`
  query ContentRules($portfolioId: Int!, $teamId: Int!) {
    portfolioV2(portfolioId: $portfolioId, teamId: $teamId) {
      contentRules {
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
            analyticsPropertyId

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
  }
`;
type ContentRuleQueryVariables = {
  teamId: number;
  portfolioId: number;
};

export function useContentRuleQuery({
  portfolioId,
  onCompleted,
  skip,
}: {
  portfolioId: number;
  skip?: boolean;
  onCompleted?: (data: {
    portfolioV2: {
      contentRules: NexoyaContentRule[];
    };
  }) => void;
}) {
  const { teamId } = useTeam();

  const query = useQuery<
    {
      portfolioV2: {
        contentRules: NexoyaContentRule[];
      };
    },
    ContentRuleQueryVariables
  >(CONTENT_RULES_QUERY, {
    variables: {
      teamId,
      portfolioId,
    },
    onCompleted,
    skip,
  });

  return query;
}
