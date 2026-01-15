import { gql, useMutation } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_EVENTS_QUERY } from './queryPortfolioEvents';
import { StringParam, useQueryParams } from 'use-query-params';

const DELETE_PORTFOLIO_EVENT_MUTATION = gql`
  mutation DeletePortfolioEvent($portfolioId: Float!, $portfolioEventId: Float!, $teamId: Float!) {
    deletePortfolioEvent(portfolioId: $portfolioId, portfolioEventId: $portfolioEventId, teamId: $teamId)
  }
`;

type Options = {
  portfolioId: number;
};

function useDeletePortfolioEventMutation({ portfolioId }: Options) {
  const { teamId } = useTeam();

  const [qp] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });

  return useMutation(DELETE_PORTFOLIO_EVENT_MUTATION, {
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
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

export { DELETE_PORTFOLIO_EVENT_MUTATION, useDeletePortfolioEventMutation };
