import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const IMPACT_GROUPS_QUERY = gql`
  query ImpactGroups($teamId: Int!, $portfolioId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      impactGroups {
        name
        impactGroupId
      }
    }
  }
`;

function useImpactGroupsQuery({ portfolioId, onCompleted }: { portfolioId: number; onCompleted?: (response) => void }) {
  const { teamId } = useTeam();
  return useQuery(IMPACT_GROUPS_QUERY, {
    onCompleted,
    skip: !teamId || !portfolioId,
    variables: {
      teamId: teamId || null,
      portfolioId: portfolioId || null,
    },
  });
}

export { IMPACT_GROUPS_QUERY, useImpactGroupsQuery };
