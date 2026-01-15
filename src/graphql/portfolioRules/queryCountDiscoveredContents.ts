import { gql, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';

export const COUNT_DISCOVERED_CONTENTS = gql`
  query CountDiscoveredContents($portfolioId: Float!, $teamId: Float!) {
    countDiscoveredContents(portfolioId: $portfolioId, teamId: $teamId) {
      ACCEPTED_BUT_HAS_UNAPPLIED_RULES
      NEW
    }
  }
`;

export type DiscoveredContentsCount = {
  NEW: number;
  ACCEPTED_BUT_HAS_UNAPPLIED_RULES: number;
};

export function useCountDiscoveredContents({
  portfolioId,
  onCompleted,
  skip,
}: {
  portfolioId: number;
  onCompleted?: (data: { countDiscoveredContents: DiscoveredContentsCount }) => void;
  skip?: boolean;
}) {
  const { teamId } = useTeam();

  return useQuery<{ countDiscoveredContents: DiscoveredContentsCount }>(COUNT_DISCOVERED_CONTENTS, {
    skip: !teamId || !portfolioId || skip,
    variables: {
      portfolioId,
      teamId,
    },
    onCompleted,
  });
}
