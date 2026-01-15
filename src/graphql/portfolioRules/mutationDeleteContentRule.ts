import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { CONTENT_RULES_QUERY } from './queryContentRules';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaDeleteContentRuleContentActionInput } from '../../types';
import useTabNewUpdates from '../../hooks/useTabNewUpdates';

const DELETE_CONTENT_RULE_MUTATION = gql`
  mutation DeleteContentRuleAndUnapplyFromContents(
    $contentRuleId: Float!
    $portfolioId: Float!
    $teamId: Float!
    $contentActions: [DeleteContentRuleContentActionInput!]!
  ) {
    deleteContentRule(
      contentRuleId: $contentRuleId
      portfolioId: $portfolioId
      teamId: $teamId
      contentActions: $contentActions
    )
  }
`;

type DeleteContentRuleProps = {
  teamId: number;
  portfolioId: number;
  contentRuleId: number;
  contentActions: NexoyaDeleteContentRuleContentActionInput[];
};

export function useDeleteContentRuleMutation({ portfolioId }: { portfolioId: number }) {
  const { teamId } = useTeam();
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  return useMutation<{ deleteContentRuleAndUnapplyFromContents: boolean }, DeleteContentRuleProps>(
    DELETE_CONTENT_RULE_MUTATION,
    {
      awaitRefetchQueries: true,
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
      onCompleted: () => {
        toast.success('Content rule deleted and unapplied successfully');
        refreshCountDiscoveredContents();
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
      ],
    },
  );
}
