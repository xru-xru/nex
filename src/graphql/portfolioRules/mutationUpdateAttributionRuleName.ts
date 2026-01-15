import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaAttributionRule } from '../../types';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { useContentFilterStore } from '../../store/content-filter';
import { ATTRIBUTION_RULES_QUERY } from './queryAttributionRules';

const UPDATE_ATTRIBUTION_RULE_NAME_MUTATION = gql`
  mutation UpdateAttributionRuleName(
    $attributionRuleId: Float!
    $name: String!
    $portfolioId: Float!
    $teamId: Float!
  ) {
    updateAttributionRuleName(
      attributionRuleId: $attributionRuleId
      name: $name
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      name
      matchingDiscoveredContentsCount
      appliedDiscoveredContents {
        discoveredContentId
      }
    }
  }
`;

type UpdateAttributionRuleNameProps = {
  teamId: number;
  portfolioId: number;
  attributionRuleId: number;
  name: string;
};

export function useUpdateAttributionRuleNameMutation({
  portfolioId,
  onCompleted,
}: {
  portfolioId: number;
  onCompleted?: (data: { updateAttributionRuleName: NexoyaAttributionRule }) => void;
}) {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();

  return useMutation<{ updateAttributionRuleName: NexoyaAttributionRule }, UpdateAttributionRuleNameProps>(
    UPDATE_ATTRIBUTION_RULE_NAME_MUTATION,
    {
      awaitRefetchQueries: true,
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
      onCompleted: (data) => {
        if (data?.updateAttributionRuleName) {
          const rule = data.updateAttributionRuleName;
          const contentCount = rule?.matchingDiscoveredContentsCount || 0;

          toast.success(`Attribution rule name updated successfully`, {
            description: `The attribution rule has ${contentCount} matching contents`,
          });
        } else {
          toast.error('Failed to update attribution rule name');
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
    },
  );
}
