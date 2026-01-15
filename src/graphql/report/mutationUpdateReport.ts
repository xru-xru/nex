import { gql, useMutation } from '@apollo/client';

import { NexoyaReportDateRangeInput } from '../../types/types';
import '../../types/types';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import { format } from '../../utils/dates';

import {
  REPORT_DATERANGE_FRAGMENT,
  REPORT_META_FRAGMENT,
  REPORT_TIMESTAMPS_FRAGMENT,
  REPORT_USER_FRAGMENT,
} from './fragments';
import { REPORT_QUERY } from './queryReport';

const UPDATE_REPORT_MUTATION = gql`
  mutation UpdateReport(
    $report_id: Int!
    $name: String
    $description: String
    $dateRange: ReportDateRangeInput
    $config: String
  ) {
    updateReport(
      report_id: $report_id
      name: $name
      description: $description
      dateRange: $dateRange
      config: $config
    ) {
      ...reportMeta
      ...reportTimestamps
      ...reportDateRange
      ...reportUser
    }
  }
  ${REPORT_DATERANGE_FRAGMENT}
  ${REPORT_META_FRAGMENT}
  ${REPORT_TIMESTAMPS_FRAGMENT}
  ${REPORT_USER_FRAGMENT}
`;
type Options = {
  reportId: number;
  name?: string | null;
  description?: string | null;
  dateRange?: NexoyaReportDateRangeInput | null;
  config?: string | null;
};

function useUpdateReportMutation({ reportId, name, description, dateRange, config }: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(UPDATE_REPORT_MUTATION, {
    variables: {
      report_id: reportId,
      name,
      description,
      // TODO:
      // This will most likely be removed after we have introduced timezones
      // it our date selection. However, for the time being we need to make
      // sure we always get it in the UTC midnights.
      dateRange: dateRange && {
        rangeType: dateRange.rangeType,
        customRange:
          dateRange.rangeType === 'custom' && dateRange.customRange
            ? {
                dateFrom: format(dateRange.customRange.dateFrom, 'utcStartMidnight'),
                dateTo: format(dateRange.customRange.dateTo, 'utcEndMidnight'),
              }
            : null,
      },
      config,
    },
    onCompleted: () => track(EVENT.REPORT_UPDATE),
    refetchQueries: [
      {
        query: REPORT_QUERY,
        variables: {
          team_id: teamId,
          report_id: reportId,
        },
      },
    ],
  });
  return [mutation, state];
}

export { UPDATE_REPORT_MUTATION, useUpdateReportMutation };
