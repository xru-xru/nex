import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const TARGET_ITEMS_QUERY = gql`
  query TargetItems($teamId: Int!, $portfolioId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      targetItems {
        targetItemId
        maxBudget
        name
        start
        end
        value
        achieved
        status
      }
    }
  }
`;

type Options = {
  portfolioId: number;
};

function useTargetItemQuery({ portfolioId }: Options): any {
  const { teamId } = useTeam();

  return useQuery(TARGET_ITEMS_QUERY, {
    variables: {
      teamId,
      portfolioId,
    },
  });
}

export { TARGET_ITEMS_QUERY, useTargetItemQuery };
