import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import removeApolloCacheKeys from '../../utils/removeApolloCacheKeys';

import { REPORTS_QUERY } from './queryReports';

const DELETE_REPORT_MUTATION = gql`
  mutation DeleteReport($team_id: Int!, $report_id: Int!) {
    deleteReport(team_id: $team_id, report_id: $report_id)
  }
`;
type Options = {
  reportId: number;
};

function useDeleteReportMutation({ reportId }: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(DELETE_REPORT_MUTATION, {
    variables: {
      team_id: teamId,
      report_id: reportId,
    },
    refetchQueries: [
      {
        query: REPORTS_QUERY,
        variables: {
          team_id: teamId,
        },
      },
    ],
    update: (cache) => removeApolloCacheKeys(cache, 'reports'),
  });
  return [mutation, state];
}

export { DELETE_REPORT_MUTATION, useDeleteReportMutation };
