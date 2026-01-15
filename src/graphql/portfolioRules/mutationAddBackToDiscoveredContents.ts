import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

const RESTORE_REMOVED_DISCOVERED_CONTENTS_MUTATION = gql`
  mutation RestoreRemovedDiscoveredContents($contentIds: [Float!]!, $portfolioId: Float!, $teamId: Float!) {
    restoreRemovedDiscoveredContents(contentIds: $contentIds, portfolioId: $portfolioId, teamId: $teamId)
  }
`;

type RestoreRemovedDiscoveredContentsProps = {
  contentIds: number[];
  portfolioId: number;
  teamId: number;
};

export function useRestoreRemovedDiscoveredContentsMutation() {
  return useMutation<boolean, RestoreRemovedDiscoveredContentsProps>(RESTORE_REMOVED_DISCOVERED_CONTENTS_MUTATION, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('Error restoring removed discovered contents:', error);
      toast.error(error.message || 'Failed to restore contents');
    },
    onCompleted: () => {
      toast.success('Contents added back successfully');
    },
  });
}

export { RESTORE_REMOVED_DISCOVERED_CONTENTS_MUTATION };
