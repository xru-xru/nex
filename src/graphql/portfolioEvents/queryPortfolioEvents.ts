import { gql, useQuery } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaPortfolioEventConnection } from '../../types';

const PORTFOLIO_EVENTS_QUERY = gql`
  query PortfolioEvents($teamId: Int!, $portfolioId: Int!, $after: String, $end: Date, $first: Int, $start: Date) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      portfolioEvents(after: $after, end: $end, first: $first, start: $start) {
        totalPages
        pageInfo {
          startCursor
          hasNextPage
          hasPreviousPage
          endCursor
        }
        edges {
          cursor
          node {
            portfolioEventId
            name
            category
            created
            description
            start
            end
            impact
            includesAllContents
            assetUrl
            contentRules {
              name
              contentRuleId
              matchingDiscoveredContentsCount
            }
            assignedContents {
              contentId
              title
              provider {
                provider_id
                name
              }
            }
          }
        }
      }
    }
  }
`;

type PortfolioEventsResponse = {
  portfolioV2: {
    portfolioEvents: NexoyaPortfolioEventConnection;
  };
};

type Options = {
  portfolioId: number;
  onCompleted?: (data: PortfolioEventsResponse) => void;
  first?: number;
  after?: number;
  start?: string;
  end?: string;
  skip?: boolean;
};

function usePortfolioEventsQuery({ portfolioId, onCompleted, after, first, start, end, skip }: Options) {
  const { teamId } = useTeam();

  return useQuery<PortfolioEventsResponse>(PORTFOLIO_EVENTS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    skip: !teamId || !portfolioId || skip,
    onCompleted,
    variables: {
      teamId,
      portfolioId,
      first,
      after,
      start,
      end,
    },
  });
}

export { PORTFOLIO_EVENTS_QUERY, usePortfolioEventsQuery };
