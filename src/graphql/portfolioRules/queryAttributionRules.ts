import { gql, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';
import { NexoyaAttributionRule } from '../../types';

export const ATTRIBUTION_RULES_QUERY = gql`
  query AttributionRules($portfolioId: Int!, $teamId: Int!) {
    portfolioV2(portfolioId: $portfolioId, teamId: $teamId) {
      attributionRules {
        attributionRuleId
        name
        matchingDiscoveredContentsCount
        factors {
          source {
            type
            accountConversionIds
            conversionName
            conversionMetricId
            metricId
          }
          value
          start
        }
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
          attributionRules {
            isApplied
            attributionRule {
              attributionRuleId
              name
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
        filters {
          providerId
          adAccountIds
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

type AttributionRuleQueryVariables = {
  teamId: number;
  portfolioId: number;
};

export function useAttributionRuleQuery({
  portfolioId,
  onCompleted,
  skip,
}: {
  portfolioId: number;
  skip?: boolean;
  onCompleted?: (data: {
    portfolioV2: {
      attributionRules: NexoyaAttributionRule[];
    };
  }) => void;
}) {
  const { teamId } = useTeam();

  const query = useQuery<
    {
      portfolioV2: {
        attributionRules: NexoyaAttributionRule[];
      };
    },
    AttributionRuleQueryVariables
  >(ATTRIBUTION_RULES_QUERY, {
    variables: {
      teamId,
      portfolioId,
    },
    onCompleted,
    skip,
  });

  return query;
}
