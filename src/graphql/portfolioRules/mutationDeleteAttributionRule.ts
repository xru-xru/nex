import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaDeleteAttributionRuleContentActionInput } from '../../types';
import { ATTRIBUTION_RULES_QUERY } from './queryAttributionRules';
import useTabNewUpdates from '../../hooks/useTabNewUpdates';

const DELETE_ATTRIBUTION_RULE_MUTATION = gql`
  mutation DeleteAttributionRule(
    $attributionRuleId: Float!
    $portfolioId: Float!
    $teamId: Float!
    $contentActions: [DeleteAttributionRuleContentActionInput!]!
  ) {
    deleteAttributionRule(
      attributionRuleId: $attributionRuleId
      portfolioId: $portfolioId
      teamId: $teamId
      contentActions: $contentActions
    )
  }
`;

type DeleteAttributionRuleProps = {
  teamId: number;
  portfolioId: number;
  attributionRuleId: number;
  contentActions: NexoyaDeleteAttributionRuleContentActionInput[];
};

export function useDeleteAttributionRuleMutation({ portfolioId }: { portfolioId: number }) {
  const { teamId } = useTeam();
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  return useMutation<{ deleteAttributionRule: boolean }, DeleteAttributionRuleProps>(DELETE_ATTRIBUTION_RULE_MUTATION, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: () => {
      toast.success('Attribution rule deleted successfully');
      refreshCountDiscoveredContents();
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
    ],
  });
}
