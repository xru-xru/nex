import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  NexoyaContentRuleFunnelStepMappingInput,
  NexoyaUpdateContentRuleFunnelStepMappingsMutationResponse,
} from '../../types';
import { CONTENT_RULES_QUERY } from './queryContentRules';
import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { useContentFilterStore } from '../../store/content-filter';

const SET_CONTENT_RULE_MAPPING_MUTATION = gql`
  mutation UpdateContentRuleFunnelStepMappings(
    $contentRuleId: Float!
    $funnelStepMappings: [ContentRuleFunnelStepMappingInput!]!
    $portfolioId: Float!
    $teamId: Float!
  ) {
    updateContentRuleFunnelStepMappings(
      contentRuleId: $contentRuleId
      funnelStepMappings: $funnelStepMappings
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      clashingDiscoveredContents {
        discoveredContentId
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
            impactGroupRuleId
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
      contentRule {
        name
        contentRuleId
        appliedDiscoveredContents {
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
  }
`;

type SetContentRuleMappingMutationProps = {
  contentRuleId: number;
  funnelStepMappings: NexoyaContentRuleFunnelStepMappingInput[];
  portfolioId: number;
  teamId: number;
};

export function useUpdateContentRuleMappingMutation({ onCompleted, portfolioId }) {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();

  return useMutation<
    { updateContentRuleFunnelStepMappings: NexoyaUpdateContentRuleFunnelStepMappingsMutationResponse },
    SetContentRuleMappingMutationProps
  >(SET_CONTENT_RULE_MAPPING_MUTATION, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('Error setting content rule mapping:', error);
      toast.error(error.message || 'Failed to set content rule mapping');
    },
    onCompleted,
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: CONTENT_RULES_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
      {
        query: PORTFOLIO_PARENT_CONTENTS_QUERY,
        variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
      },
    ],
  });
}
