import { gql, useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaContentRuleEditInput, NexoyaContentRuleUpdateFiltersPreviewMutationResponse } from '../../types';

const CONTENT_RULE_UPDATE_PREVIEW_MUTATION = gql`
  query ContentRuleUpdatePreview(
    $filters: ContentRuleFiltersInput!
    $contentRuleId: Float!
    $portfolioId: Float!
    $teamId: Float!
  ) {
    contentRuleUpdateFiltersPreview(
      filters: $filters
      contentRuleId: $contentRuleId
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

type ContentRuleUpdatePreviewProps = {
  teamId: number;
  portfolioId: number;
  contentRuleId: number;
  filters: NexoyaContentRuleEditInput;
};

export function useContentRuleUpdatePreviewQuery() {
  return useLazyQuery<
    { contentRuleUpdateFiltersPreview: NexoyaContentRuleUpdateFiltersPreviewMutationResponse },
    ContentRuleUpdatePreviewProps
  >(CONTENT_RULE_UPDATE_PREVIEW_MUTATION, {
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.contentRuleUpdateFiltersPreview) {
        const { newMatchingDiscoveredContents, noLongerMatchingDiscoveredContents } =
          data.contentRuleUpdateFiltersPreview;

        const addedCount = newMatchingDiscoveredContents.length;
        const removedCount = noLongerMatchingDiscoveredContents.length;

        toast.success('Content rule preview', {
          description: `${addedCount} new matching contents, ${removedCount} no longer matching`,
        });
      } else {
        toast.error('Failed to preview content rule update');
      }
    },
  });
}
