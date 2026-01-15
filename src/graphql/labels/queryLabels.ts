import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { PROVIDER_LABELS_FRAGMENT } from './fragments';

const LABELS_QUERY = gql`
  query Labels($teamId: Int!, $portfolioId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      labels {
        ...labels
      }
    }
  }
  ${PROVIDER_LABELS_FRAGMENT}
`;

function useLabelsQuery({ portfolioId, onCompleted }: { portfolioId: number; onCompleted?: (data: any) => void }) {
  const { teamId } = useTeam();
  return useQuery(LABELS_QUERY, {
    skip: !teamId || !portfolioId,
    onCompleted,
    variables: {
      teamId: teamId || null,
      portfolioId: portfolioId || null,
    },
  });
}

export { LABELS_QUERY, useLabelsQuery };
