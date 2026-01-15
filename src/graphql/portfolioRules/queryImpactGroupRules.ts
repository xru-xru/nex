import { gql, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';
import { NexoyaImpactGroupRule } from '../../types';

export const IMPACT_GROUP_RULES_QUERY = gql`
  query ImpactGroupRules($portfolioId: Int!, $teamId: Int!) {
    portfolioV2(portfolioId: $portfolioId, teamId: $teamId) {
      impactGroupRules {
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
  }
`;
type ImpactGroupRuleQueryVariables = {
  teamId: number;
  portfolioId: number;
};

export function useImpactGroupRuleQuery({
  portfolioId,
  skip,
  onCompleted,
}: {
  portfolioId: number;
  skip?: boolean;
  onCompleted?: any;
}) {
  const { teamId } = useTeam();

  const query = useQuery<
    {
      portfolioV2: {
        impactGroupRules: NexoyaImpactGroupRule[];
      };
    },
    ImpactGroupRuleQueryVariables
  >(IMPACT_GROUP_RULES_QUERY, {
    onCompleted,
    skip: !portfolioId || skip,
    variables: {
      teamId,
      portfolioId,
    },
  });

  return query;
}
