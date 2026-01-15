import { gql, useMutation } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_EVENTS_QUERY } from './queryPortfolioEvents';
import { StringParam, useQueryParams } from 'use-query-params';

const UPDATE_PORTFOLIO_EVENT_MUTATION = gql`
  mutation UpdatePortfolioEvent(
    $category: EventCategory
    $description: String
    $end: Date
    $impact: EventImpact
    $name: String
    $portfolioId: Float!
    $portfolioEventId: Float!
    $start: Date
    $teamId: Float!
  ) {
    updatePortfolioEvent(
      category: $category
      description: $description
      end: $end
      impact: $impact
      name: $name
      portfolioId: $portfolioId
      portfolioEventId: $portfolioEventId
      start: $start
      teamId: $teamId
    ) {
      updatedPortfolioEvent {
        portfolioEventId
      }
    }
  }
`;

type Options = {
  portfolioId: number;
};

function useUpdatePortfolioEventMutation({ portfolioId }: Options) {
  const { teamId } = useTeam();

  const [qp] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });

  return useMutation(UPDATE_PORTFOLIO_EVENT_MUTATION, {
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

export { UPDATE_PORTFOLIO_EVENT_MUTATION, useUpdatePortfolioEventMutation };
