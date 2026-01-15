import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { IMPACT_GROUP_RULES_QUERY } from './queryImpactGroupRules';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaDeleteAttributionRuleContentActionInput } from '../../types';

const DELETE_IMPACT_GROUP_RULE_MUTATION = gql`
  mutation DeleteImpactGroupRuleAndUnapplyFromContents(
    $impactGroupRuleId: Float!
    $portfolioId: Float!
    $teamId: Float!
    $contentActions: [DeleteImpactGroupRuleContentActionInput!]!
  ) {
    deleteImpactGroupRule(
      impactGroupRuleId: $impactGroupRuleId
      portfolioId: $portfolioId
      teamId: $teamId
      contentActions: $contentActions
    )
  }
`;

type DeleteImpactGroupRuleProps = {
  teamId: number;
  portfolioId: number;
  impactGroupRuleId: number;
  contentActions: NexoyaDeleteAttributionRuleContentActionInput[];
};

export function useDeleteImpactGroupRuleMutation({ portfolioId }: { portfolioId: number }) {
  const { teamId } = useTeam();

  return useMutation<{ deleteImpactGroupRuleAndUnapplyFromContents: boolean }, DeleteImpactGroupRuleProps>(
    DELETE_IMPACT_GROUP_RULE_MUTATION,
    {
      awaitRefetchQueries: true,
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
      onCompleted: () => {
        toast.success('Impact group rule deleted and unapplied successfully');
      },
      refetchQueries: [
        {
          notifyOnNetworkStatusChange: true,
          query: IMPACT_GROUP_RULES_QUERY,
          variables: { teamId, portfolioId },
          fetchPolicy: 'network-only',
        },
      ],
    },
  );
}
