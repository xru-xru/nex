import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  NexoyaContentRuleFiltersInput,
  NexoyaUpdateContentRuleAndContentsMutationResponse,
  NexoyaUpdateContentRuleFiltersContentActionInput,
} from '../../types';
import { CONTENT_RULES_QUERY } from './queryContentRules';
import { useTeam } from '../../context/TeamProvider';
import { useContentFilterStore } from '../../store/content-filter';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import useTabNewUpdates from '../../hooks/useTabNewUpdates';

const UPDATE_CONTENT_RULE_AND_CONTENTS_MUTATION = gql`
  mutation UpdateContentRuleFilters(
    $filters: ContentRuleFiltersInput!
    $contentRuleId: Float!
    $portfolioId: Float!
    $teamId: Float!
    $contentActions: [UpdateContentRuleFiltersContentActionInput!]!
  ) {
    updateContentRuleFilters(
      filters: $filters
      contentRuleId: $contentRuleId
      portfolioId: $portfolioId
      teamId: $teamId
      contentActions: $contentActions
    ) {
      updatedContentRule {
        name
        matchingDiscoveredContentsCount
        appliedDiscoveredContents {
          discoveredContentId
        }
      }
    }
  }
`;

type UpdateContentRuleProps = {
  teamId: number;
  portfolioId: number;
  contentRuleId: number;
  filters: NexoyaContentRuleFiltersInput;
  contentActions?: NexoyaUpdateContentRuleFiltersContentActionInput[];
};

export function useUpdateContentRuleFiltersMutation({
  portfolioId,
  onCompleted,
}: {
  portfolioId: number;
  onCompleted?: (data: { updateContentRuleFilters: NexoyaUpdateContentRuleAndContentsMutationResponse }) => void;
}) {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  return useMutation<
    { updateContentRuleFilters: NexoyaUpdateContentRuleAndContentsMutationResponse },
    UpdateContentRuleProps
  >(UPDATE_CONTENT_RULE_AND_CONTENTS_MUTATION, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.updateContentRuleFilters) {
        const rule = data.updateContentRuleFilters.updatedContentRule;
        const contentCount = rule?.matchingDiscoveredContentsCount || 0;

        toast.success(`Content rule ${rule?.name} updated successfully`, {
          description: `The content rule has ${contentCount} matching contents`,
        });
        refreshCountDiscoveredContents();
      } else {
        toast.error('Failed to update content rule');
      }
      onCompleted?.(data);
    },
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
