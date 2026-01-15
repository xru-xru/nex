import { gql, useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaAttributionRuleFiltersInput, NexoyaAttributionRuleUpdateFiltersPreviewQueryResponse } from '../../types';

const ATTRIBUTION_RULE_UPDATE_FILTERS_PREVIEW_MUTATION = gql`
  query AttributionRuleUpdateFiltersPreview(
    $attributionRuleId: Float!
    $filters: AttributionRuleFiltersInput!
    $portfolioId: Float!
    $teamId: Float!
  ) {
    attributionRuleUpdateFiltersPreview(
      attributionRuleId: $attributionRuleId
      filters: $filters
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      newMatchingDiscoveredContents {
        discoveredContentId
        impactGroupRules {
          isApplied
          impactGroupRule {
            impactGroupRuleId
            name
          }
        }
        contentRules {
          isApplied
          contentRule {
            contentRuleId
            name
            filters {
              providerId
              adAccountIds
              contentFilters {
                fieldName
                value {
                  number
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
                analyticsPropertyId
                metricId
                utmParams {
                  values
                  type
                }
              }
            }
          }
        }
        content {
          portfolioContentId(portfolioId: $portfolioId)
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
      }
      noLongerMatchingDiscoveredContents {
        discoveredContentId
        impactGroupRules {
          isApplied
          impactGroupRule {
            impactGroupRuleId
            name
          }
        }
        contentRules {
          isApplied
          contentRule {
            filters {
              contentFilters {
                fieldName
                value {
                  number
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
                metricId
                analyticsPropertyId
                utmParams {
                  values
                  type
                }
              }
            }
            contentRuleId
            name
          }
        }
        content {
          portfolioContentId(portfolioId: $portfolioId)
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
      }
    }
  }
`;

type AttributionRuleUpdatePreviewProps = {
  teamId: number;
  portfolioId: number;
  attributionRuleId: number;
  filters: NexoyaAttributionRuleFiltersInput;
};

export function useAttributionRuleUpdatePreviewQuery() {
  return useLazyQuery<
    {
      attributionRuleUpdateFiltersPreview: NexoyaAttributionRuleUpdateFiltersPreviewQueryResponse;
    },
    AttributionRuleUpdatePreviewProps
  >(ATTRIBUTION_RULE_UPDATE_FILTERS_PREVIEW_MUTATION, {
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.attributionRuleUpdateFiltersPreview) {
        const { newMatchingDiscoveredContents, noLongerMatchingDiscoveredContents } =
          data.attributionRuleUpdateFiltersPreview;

        const addedCount = newMatchingDiscoveredContents.length;
        const removedCount = noLongerMatchingDiscoveredContents.length;

        toast.success('Attribution rule preview', {
          description: `${addedCount} new matching contents, ${removedCount} no longer matching`,
        });
      } else {
        toast.error('Failed to preview attribution rule update');
      }
    },
  });
}
