import { gql, useQuery } from '@apollo/client';

import { NexoyaSearchFilter, NexoyaSortBy } from 'types';

import { useTeam } from '../../context/TeamProvider';

import { separateLoading } from '../../utils/graphql';

import { PAGE_INFO_FRAGMENT } from '../fragments';
import { PORTFOLIO_2_DATES_FRAGMENT, PORTFOLIO_2_META_FRAGMENT } from './fragments';

const PORTFOLIOS_QUERY = gql`
  query Portfolios($teamId: Int!, $offset: Int, $first: Int, $after: String, $where: SearchFilter, $sortBy: SortBy) {
    portfolios(teamId: $teamId, offset: $offset, first: $first, after: $after, where: $where, sortBy: $sortBy) {
      edges {
        node {
          createdByUserId
          ...portfolioDates
          ...portfolioMeta
        }
        cursor
      }
      pageInfo {
        ...pageInfo
      }
    }
  }
  ${PORTFOLIO_2_DATES_FRAGMENT}
  ${PORTFOLIO_2_META_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;
// teamId: Int!, offset: Int, first: Int, after: String, where: SearchFilter, sortBy: SortBy
type Options = {
  offset?: number | null;
  first?: number | null;
  after?: string | null;
  where?: NexoyaSearchFilter | null;
  sortBy?: NexoyaSortBy | null; // TODO: add correct type
  onCompleted?: (data: any) => void;
};

function usePortfoliosQuery({
  offset = null,
  first = 50,
  after = null,
  where = null,
  sortBy = null,
  onCompleted,
}: Options = {}): any {
  const { teamId } = useTeam();
  const query = useQuery(PORTFOLIOS_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      offset,
      first,
      after,
      where,
      sortBy,
    },
    onCompleted,
  });
  return { ...separateLoading(query) };
}

export { PORTFOLIOS_QUERY, usePortfoliosQuery };
