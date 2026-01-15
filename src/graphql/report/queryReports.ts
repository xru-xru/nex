import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { NexoyaSearchFilter, NexoyaSortBy } from '../../types/types';

import { useTeam } from '../../context/TeamProvider';

import { REPORT_META_FRAGMENT, REPORT_TIMESTAMPS_FRAGMENT, REPORT_USER_FRAGMENT } from './fragments';

const REPORTS_QUERY = gql`
  query Reports($team_id: Int!, $sortBy: SortBy, $where: SearchFilter) {
    reports(team_id: $team_id, sortBy: $sortBy, where: $where) {
      ...reportMeta
      ...reportTimestamps
      ...reportUser
    }
  }
  ${REPORT_USER_FRAGMENT}
  ${REPORT_TIMESTAMPS_FRAGMENT}
  ${REPORT_META_FRAGMENT}
`;
type Options = {
  sortBy?: NexoyaSortBy | null;
  where?: NexoyaSearchFilter | null;
};

function useReportsQuery({ sortBy, where }: Options): any {
  const { teamId } = useTeam();
  const query = useQuery(REPORTS_QUERY, {
    variables: {
      team_id: teamId,
      sortBy,
      where,
    },
  });
  return query;
}

export { REPORTS_QUERY, useReportsQuery };
