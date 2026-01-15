import { gql, QueryResult, useQuery } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaParentContentFilters } from '../../types';

type PortfolioParentContentFiltersQueryResult = {
  portfolioParentContentFilters: NexoyaParentContentFilters;
};

type PortfolioParentContentFiltersQueryVariables = {
  teamId: number;
  portfolioId: number;
};

type Props = {
  portfolioId: number;
  skip?: boolean;
  onCompleted?: (data: PortfolioParentContentFiltersQueryResult) => void;
};

const PORTFOLIO_PARENT_CONTENT_FILTERS_QUERY = gql`
  query PortfolioParentContentFilters($teamId: Int!, $portfolioId: Int!) {
    portfolioParentContentFilters(teamId: $teamId, portfolioId: $portfolioId) {
      providers {
        providerId
      }
    }
  }
`;

function usePortfolioParentContentFiltersQuery({
  portfolioId,
  skip = false,
  onCompleted,
}: Props): QueryResult<PortfolioParentContentFiltersQueryResult, PortfolioParentContentFiltersQueryVariables> {
  const { teamId } = useTeam();

  return useQuery<PortfolioParentContentFiltersQueryResult, PortfolioParentContentFiltersQueryVariables>(
    PORTFOLIO_PARENT_CONTENT_FILTERS_QUERY,
    {
      skip: !teamId || !portfolioId || skip,
      fetchPolicy: 'cache-and-network',
      onCompleted,
      variables: {
        teamId: Number(teamId),
        portfolioId,
      },
    },
  );
}

export { usePortfolioParentContentFiltersQuery, PORTFOLIO_PARENT_CONTENT_FILTERS_QUERY };
