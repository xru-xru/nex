import { gql, useQuery } from '@apollo/client';

const TARGET_ITEM_QUERY = gql`
  query PortfolioV2($portfolioId: Int!, $targetItemId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      targetItemById(targetItemId: $targetItemId) {
        name
        startDate
        endDate
        value
      }
    }
  }
`;

type Options = {
  teamId?: number;
  portfolioId?: number;
  start?: string;
  end?: string;
};

function useTargetItemQuery({ teamId, portfolioId, start, end }: Options = {}): any {
  const query = useQuery(TARGET_ITEM_QUERY, {
    variables: {
      teamId,
      portfolioId,
      start,
      end,
    },
  });
  return query;
}

export { TARGET_ITEM_QUERY, useTargetItemQuery };
