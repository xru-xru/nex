import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import removeApolloCacheKeys from '../../utils/removeApolloCacheKeys';

import { REPORTS_QUERY } from './queryReports';

const COPY_REPORT_MUTATION = gql`
  mutation CopyReport($report_id: Int!) {
    copyReport(report_id: $report_id) {
      report_id
    }
  }
`;
type Options = {
  reportId: number;
};

function useCopyReportMutation({ reportId }: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(COPY_REPORT_MUTATION, {
    variables: {
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

export { COPY_REPORT_MUTATION, useCopyReportMutation };
