import { gql, useMutation } from '@apollo/client';

import { NexoyaSearchFilter, NexoyaSortBy, NexoyaSortField, NexoyaSortOrder } from '../../types/types';
import { ChannelInput, CollectionInput, KpiInput } from '../../types/types.custom';
import '../../types/types.custom';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import { format } from '../../utils/dates';

import { REPORTS_QUERY } from './queryReports';

const CREATE_REPORT_MUTATION = gql`
  mutation createReport(
    $team_id: Int!
    $name: String!
    $description: String
    $dateRange: ReportDateRangeInput!
    $kpis: [KpiInputOptMetric]
    $report_type: String
  ) {
    createReport(
      team_id: $team_id
      name: $name
      description: $description
      dateRange: $dateRange
      kpis: $kpis
      report_type: $report_type
    ) {
      report_id
      name
      description
      updatedBy {
        user_id
        email
        firstname
        lastname
      }
    }
  }
`;
type Options = {
  name?: string;
  description?: string;
  dateRange?: {
    rangeType: string;
    customRange?: {
      dateFrom: Date | string;
      // string because we already stringify the date
      dateTo: Date | string; // string because we already stringify the date
    };
  };
  kpis?: KpiInput[] | CollectionInput[] | ChannelInput[] | null;
  reportType?: 'KPI' | 'CHANNEL';
  sortBy?: NexoyaSortBy | null;
  where?: NexoyaSearchFilter | null;
};

function useCreateReportMutation({
  name,
  description = null,
  dateRange,
  kpis = null,
  reportType = 'KPI',
  sortBy = {
    field: NexoyaSortField.Name,
    order: NexoyaSortOrder.Asc,
  },
  where,
}: Options = {}): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(CREATE_REPORT_MUTATION, {
    variables: {
      team_id: teamId,
      name,
      description,
      kpis,
      report_type: reportType,
      // TODO:
      // This will most likely be removed after we have introduced timezones
      // it our date selection. However, for the time being we need to make
      // sure we always get it in the UTC midnights.
      dateRange: {
        rangeType: dateRange.rangeType,
        customRange:
          dateRange.rangeType === 'custom' && dateRange.customRange
            ? {
                dateFrom: format(dateRange.customRange.dateFrom, 'utcStartMidnight'),
                dateTo: format(dateRange.customRange.dateTo, 'utcEndMidnight'),
              }
            : null,
      },
    },
    onCompleted: () => track(EVENT[`REPORT_CREATE_${reportType}_REPORT`]),
    refetchQueries: [
      {
        query: REPORTS_QUERY,
        variables: {
          team_id: teamId,
          sortBy,
          where,
        },
      },
    ], // update: cache => removeApolloCacheKeys(cache, 'reports'),
  });
  return [mutation, state];
}

export { CREATE_REPORT_MUTATION, useCreateReportMutation };
