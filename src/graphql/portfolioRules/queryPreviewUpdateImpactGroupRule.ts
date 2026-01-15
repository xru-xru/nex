import { gql, useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaImpactGroupRuleEditInput, NexoyaImpactGroupRuleUpdatePreviewMutationResponse } from '../../types';

const IMPACT_GROUP_RULE_UPDATE_PREVIEW_MUTATION = gql`
  query ImpactGroupRuleUpdatePreview(
    $impactGroupRuleEdit: ImpactGroupRuleEditInput!
    $impactGroupRuleId: Float!
    $portfolioId: Float!
    $teamId: Float!
  ) {
    impactGroupRuleUpdatePreview(
      impactGroupRuleEdit: $impactGroupRuleEdit
      impactGroupRuleId: $impactGroupRuleId
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      newMatchingDiscoveredContents {
        discoveredContentId
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

type ImpactGroupRuleUpdatePreviewProps = {
  teamId: number;
  portfolioId: number;
  impactGroupRuleId: number;
  impactGroupRuleEdit: NexoyaImpactGroupRuleEditInput;
};

export function useImpactGroupRuleUpdatePreviewQuery() {
  return useLazyQuery<
    { impactGroupRuleUpdatePreview: NexoyaImpactGroupRuleUpdatePreviewMutationResponse },
    ImpactGroupRuleUpdatePreviewProps
  >(IMPACT_GROUP_RULE_UPDATE_PREVIEW_MUTATION, {
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.impactGroupRuleUpdatePreview) {
        const { newMatchingDiscoveredContents, noLongerMatchingDiscoveredContents } = data.impactGroupRuleUpdatePreview;

        const addedCount = newMatchingDiscoveredContents.length;
        const removedCount = noLongerMatchingDiscoveredContents.length;

        toast.success('Impact group rule preview updated', {
          description: `${addedCount} new matching contents, ${removedCount} no longer matching.`,
        });
      } else {
        toast.error('Failed to preview impact group rule update');
      }
    },
  });
}
