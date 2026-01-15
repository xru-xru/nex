import { gql, useMutation } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_EVENTS_QUERY } from './queryPortfolioEvents';
import { StringParam, useQueryParams } from 'use-query-params';

const CREATE_PORTFOLIO_EVENT_MUTATION = gql`
  mutation CreatePortfolioEvent(
    $category: EventCategory!
    $description: String
    $end: Date!
    $impact: EventImpact!
    $name: String!
    $portfolioId: Float!
    $start: Date!
    $teamId: Float!
  ) {
    createPortfolioEvent(
      category: $category
      description: $description
      end: $end
      impact: $impact
      name: $name
      portfolioId: $portfolioId
      start: $start
      teamId: $teamId
    ) {
      portfolioEvent {
        portfolioEventId
        assetUrl
        name
        description
        impact
        start
        end
        category
        created
      }
    }
  }
`;

type Options = {
  portfolioId: number;
};

function useCreatePortfolioEventMutation({ portfolioId }: Options) {
  const { teamId } = useTeam();

  const [qp] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });

  return useMutation(CREATE_PORTFOLIO_EVENT_MUTATION, {
    notifyOnNetworkStatusChange: true,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: PORTFOLIO_EVENTS_QUERY,
        variables: {
          teamId,
          portfolioId,
          start: qp.dateFrom,
          end: qp.dateTo,
          first: 100,
        },
      },
    ],
  });
}

export { CREATE_PORTFOLIO_EVENT_MUTATION, useCreatePortfolioEventMutation };
