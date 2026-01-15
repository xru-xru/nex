import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaDiscoveredContent, NexoyaDiscoveredContentStatus } from '../../types';
import { DISCOVERED_CONTENTS_QUERY } from './queryDiscoveredContents';
import { COUNT_DISCOVERED_CONTENTS } from './queryCountDiscoveredContents';
import { useTeam } from '../../context/TeamProvider';

const ACCEPT_DISCOVERED_CONTENTS_MUTATION = gql`
  mutation AcceptDiscoveredContents($discoveredContentIds: [Float!]!, $portfolioId: Float!, $teamId: Float!) {
    acceptDiscoveredContents(discoveredContentIds: $discoveredContentIds, portfolioId: $portfolioId, teamId: $teamId) {
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

type AcceptDiscoveredContentsProps = {
  discoveredContentIds: number[];
  portfolioId: number;
  teamId: number;
};

export function useAcceptDiscoveredContentsMutation({ portfolioId }) {
  const { teamId } = useTeam();
  return useMutation<{ acceptDiscoveredContents: NexoyaDiscoveredContent[] }, AcceptDiscoveredContentsProps>(
    ACCEPT_DISCOVERED_CONTENTS_MUTATION,
    {
      awaitRefetchQueries: true,
      onError: (error) => {
        console.error('Error accepting discovered contents:', error);
        toast.error(error.message || 'Failed to accept discovered contents');
      },
      onCompleted: (data) => {
        toast.success(`Accepted ${data.acceptDiscoveredContents.length} contents successfully`);
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
