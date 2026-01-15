import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaDiscoveredContent, NexoyaDiscoveredContentStatus } from '../../types';
import { DISCOVERED_CONTENTS_QUERY } from './queryDiscoveredContents';
import { useTeam } from '../../context/TeamProvider';
import { COUNT_DISCOVERED_CONTENTS } from './queryCountDiscoveredContents';

const REJECT_DISCOVERED_CONTENTS_MUTATION = gql`
  mutation RejectDiscoveredContents($discoveredContentIds: [Float!]!, $portfolioId: Float!, $teamId: Float!) {
    rejectDiscoveredContents(discoveredContentIds: $discoveredContentIds, portfolioId: $portfolioId, teamId: $teamId) {
      discoveredContentId
      status
      content {
        contentId
        title
      }
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
    }
  }
`;

type RejectDiscoveredContentsProps = {
  discoveredContentIds: number[];
  portfolioId: number;
  teamId: number;
};

export function useRejectDiscoveredContentsMutation({ portfolioId }: { portfolioId: number }) {
  const { teamId } = useTeam();

  return useMutation<{ rejectDiscoveredContents: NexoyaDiscoveredContent[] }, RejectDiscoveredContentsProps>(
    REJECT_DISCOVERED_CONTENTS_MUTATION,
    {
      awaitRefetchQueries: true,
      onError: (error) => {
        console.error('Error rejecting discovered contents:', error);
        toast.error(error.message || 'Failed to reject discovered contents');
      },
      onCompleted: (data) => {
        toast.success(`Rejected ${data.rejectDiscoveredContents.length} contents successfully`);
      },
      refetchQueries: [
        {
          notifyOnNetworkStatusChange: true,
          query: DISCOVERED_CONTENTS_QUERY,
          variables: {
            teamId,
            portfolioId,
            status: NexoyaDiscoveredContentStatus.New,
          },
          fetchPolicy: 'network-only',
        },
        {
          notifyOnNetworkStatusChange: true,
          query: COUNT_DISCOVERED_CONTENTS,
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
