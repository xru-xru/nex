import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaAttributionRule, NexoyaAttributionRuleFactorInput } from '../../types';
import { useTeam } from '../../context/TeamProvider';
import { useContentFilterStore } from '../../store/content-filter';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { ATTRIBUTION_RULES_QUERY } from './queryAttributionRules';

const UPDATE_ATTRIBUTION_RULE_FUNNEL_STEP_MAPPINGS_MUTATION = gql`
  mutation UpdateAttributionRuleFactors(
    $attributionRuleId: Float!
    $factors: [AttributionRuleFactorInput!]!
    $portfolioId: Float!
    $teamId: Float!
  ) {
    updateAttributionRuleFactors(
      attributionRuleId: $attributionRuleId
      factors: $factors
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      name
      attributionRuleId
      matchingDiscoveredContentsCount
      appliedDiscoveredContents {
        content {
          title
        }
      }
      factors {
        start
        value
        source {
          type
          metricId
          conversionName
          accountConversionIds
          conversionMetricId
        }
      }
    }
  }
`;

type UpdateAttributionRuleProps = {
  teamId: number;
  portfolioId: number;
  attributionRuleId: number;
  factors: NexoyaAttributionRuleFactorInput[];
};

export function useUpdateAttributionRuleFactorsMutation({
  portfolioId,
  onCompleted,
}: {
  portfolioId: number;
  onCompleted?: (data: { updateAttributionRuleFactors: NexoyaAttributionRule }) => void;
}) {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();

  return useMutation<
    {
      updateAttributionRuleFactors: NexoyaAttributionRule;
    },
    UpdateAttributionRuleProps
  >(UPDATE_ATTRIBUTION_RULE_FUNNEL_STEP_MAPPINGS_MUTATION, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.updateAttributionRuleFactors) {
        const rule = data.updateAttributionRuleFactors;
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
