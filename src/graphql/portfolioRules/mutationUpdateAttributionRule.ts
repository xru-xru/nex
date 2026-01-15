import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  NexoyaAttributionRuleFiltersInput,
  NexoyaUpdateAttributionRuleFiltersContentActionInput,
  NexoyaUpdateAttributionRuleFiltersMutationResponse,
} from '../../types';
import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { useContentFilterStore } from '../../store/content-filter';
import { ATTRIBUTION_RULES_QUERY } from './queryAttributionRules';

const UPDATE_ATTRIBUTION_RULE_FILTERS_MUTATION = gql`
  mutation UpdateAttributionRuleFilters(
    $filters: AttributionRuleFiltersInput!
    $attributionRuleId: Float!
    $portfolioId: Float!
    $teamId: Float!
    $contentActions: [UpdateAttributionRuleFiltersContentActionInput!]!
  ) {
    updateAttributionRuleFilters(
      filters: $filters
      attributionRuleId: $attributionRuleId
      portfolioId: $portfolioId
      teamId: $teamId
      contentActions: $contentActions
    ) {
      updatedAttributionRule {
        name
        matchingDiscoveredContentsCount
        appliedDiscoveredContents {
          discoveredContentId
        }
      }
    }
  }
`;

type UpdateAttributionRuleProps = {
  teamId: number;
  portfolioId: number;
  attributionRuleId: number;
  filters: NexoyaAttributionRuleFiltersInput;
  contentActions: NexoyaUpdateAttributionRuleFiltersContentActionInput[];
};

export function useUpdateAttributionRuleMutation({
  portfolioId,
  onCompleted,
}: {
  portfolioId: number;
  onCompleted?: (data: { updateAttributionRuleFilters: NexoyaUpdateAttributionRuleFiltersMutationResponse }) => void;
}) {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();

  return useMutation<
    {
      updateAttributionRuleFilters: NexoyaUpdateAttributionRuleFiltersMutationResponse;
    },
    UpdateAttributionRuleProps
  >(UPDATE_ATTRIBUTION_RULE_FILTERS_MUTATION, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.updateAttributionRuleFilters) {
        const rule = data.updateAttributionRuleFilters.updatedAttributionRule;
        const contentCount = rule?.matchingDiscoveredContentsCount || 0;

        toast.success(`Attribution rule ${rule?.name} updated successfully`, {
          description: `The attribution rule has ${contentCount} matching contents`,
        });
      } else {
        toast.error('Failed to update attribution rule');
      }
      onCompleted?.(data);
    },
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: ATTRIBUTION_RULES_QUERY,
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
