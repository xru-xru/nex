import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useTeam } from '../../context/TeamProvider';
import { StringParam, useQueryParams } from 'use-query-params';
import { CONTENT_RULES_QUERY } from './queryContentRules';
import { NexoyaContentRule } from '../../types';

const UPDATE_CONTENT_RULE_NAME_MUTATION = gql`
  mutation UpdateContentRuleName($contentRuleId: Float!, $name: String!, $portfolioId: Float!, $teamId: Float!) {
    updateContentRuleName(contentRuleId: $contentRuleId, name: $name, portfolioId: $portfolioId, teamId: $teamId) {
      contentRuleId
      name
      matchingDiscoveredContentsCount
    }
  }
`;

type UpdateContentRuleNameProps = {
  teamId: number;
  portfolioId: number;
  contentRuleId: number;
  name: string;
};

export function useUpdateContentRuleNameMutation({
  portfolioId,
  onCompleted,
}: {
  portfolioId: number;
  onCompleted?: (data: { updateContentRuleName: NexoyaContentRule }) => void;
}) {
  const { teamId } = useTeam();
  const [qp] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });

  return useMutation<{ updateContentRuleName: NexoyaContentRule }, UpdateContentRuleNameProps>(
    UPDATE_CONTENT_RULE_NAME_MUTATION,
    {
      awaitRefetchQueries: true,
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
      onCompleted: (data) => {
        if (data?.updateContentRuleName) {
          const rule = data.updateContentRuleName;
          const contentCount = rule?.matchingDiscoveredContentsCount || 0;

          toast.success(`Content rule name updated successfully`, {
            description: `The content rule has ${contentCount} matching contents`,
          });
        } else {
          toast.error('Failed to update content rule name');
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
      ],
    },
  );
}
