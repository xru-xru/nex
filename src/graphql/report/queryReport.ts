import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import {
  REPORT_DATERANGE_FRAGMENT,
  REPORT_KPIS_FRAGMENT,
  REPORT_META_FRAGMENT,
  REPORT_TIMESTAMPS_FRAGMENT,
  REPORT_USER_FRAGMENT,
} from './fragments';

const REPORT_QUERY = gql`
  query Report($team_id: Int!, $report_id: Int!) {
    report(team_id: $team_id, report_id: $report_id) {
      ...reportMeta
      ...reportTimestamps
      ...reportDateRange
      ...reportUser
      ...reportKpis
    }
  }
  ${REPORT_DATERANGE_FRAGMENT}
  ${REPORT_META_FRAGMENT}
  ${REPORT_TIMESTAMPS_FRAGMENT}
  ${REPORT_USER_FRAGMENT}
  ${REPORT_KPIS_FRAGMENT}
`;
type Options = {
  reportId: number;
};

function useReportQuery({ reportId }: Options) {
  const { teamId } = useTeam();
  const query = useQuery(REPORT_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      team_id: teamId,
      report_id: reportId,
    },
  });
  const { networkStatus, loading, ...restQuery } = query;
  return {
    ...restQuery,
    networkStatus,
    loading: networkStatus !== 4 && loading,
    refetching: networkStatus === 4,
  };
}

export { REPORT_QUERY, useReportQuery };
