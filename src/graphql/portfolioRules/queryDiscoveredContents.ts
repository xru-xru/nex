import { gql, useQuery } from '@apollo/client';
import { NexoyaDiscoveredContent, NexoyaDiscoveredContentStatus } from '../../types';
import { useTeam } from 'context/TeamProvider';

export const DISCOVERED_CONTENTS_QUERY = gql`
  query DiscoveredContents($status: DiscoveredContentStatus!, $portfolioId: Int!, $teamId: Int!) {
    portfolioV2(portfolioId: $portfolioId, teamId: $teamId) {
      discoveredContents(status: $status) {
        content {
          avgSpendLast7Days
          biddingStrategy {
            type
            value
          }
          budget {
            value
            type
            shared
          }
          contentId
          contentType {
            name
            collection_type_id
          }
          endDatetime
          latestMeasurementDataDate
          parent {
            contentId
            title
          }
          provider {
            name
            provider_id
          }
          startDatetime
          status
          teamId
          title
        }
        contentRules {
          contentRule {
            filters {
              providerId
              adAccountIds
              contentFilters {
                value {
                  number
                }
                fieldName
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
                analyticsPropertyId
                metricId
                utmParams {
                  values
                  type
                }
              }
            }
            contentRuleId
            name
          }
          isApplied
        }
        discoveredContentId
        impactGroupRules {
          impactGroupRule {
            impactGroupId
            impactGroupRuleId
            name
          }
          isApplied
        }
        attributionRules {
          attributionRule {
            attributionRuleId
            name
            factors {
              start
              value
              source {
                type
                accountConversionIds
                conversionName
                conversionMetricId
                metricId
              }
            }
            filters {
              providerId
              adAccountIds
              contentFilters {
                value {
                  number
                }
                fieldName
              }
            }
          }
          isApplied
        }
        status
      }
    }
  }
`;

type DiscoveredContentsQueryVariables = {
  status: NexoyaDiscoveredContentStatus;
  teamId: number;
  portfolioId: number;
};

export function useDiscoveredContentsQuery({
  portfolioId,
  status,
  onCompleted,
  onError,
}: {
  portfolioId: number;
  status: NexoyaDiscoveredContentStatus;
  onCompleted?: (data: { portfolioV2: { discoveredContents: NexoyaDiscoveredContent[] } }) => void;
  onError?: (error: Error) => void;
}) {
  const { teamId } = useTeam();

  const query = useQuery<
    {
      portfolioV2: {
        discoveredContents: NexoyaDiscoveredContent[];
      };
    },
    DiscoveredContentsQueryVariables
  >(DISCOVERED_CONTENTS_QUERY, {
    skip: !teamId || !portfolioId || !status,
    fetchPolicy: 'network-only',
    variables: {
      status,
      teamId,
      portfolioId,
    },
    onCompleted,
    onError,
  });

  return query;
}
