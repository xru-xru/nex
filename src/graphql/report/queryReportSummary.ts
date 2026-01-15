import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

// TODO: https://gitlab.com/nexoya/core-graphql/issues/176#note_225446413
// We can not use fragments or aliasing otherwise the gql breaks.
const REPORT_SUMMARY_QUERY = gql`
  query ReportSummary($team_id: Int!, $report_id: Int!) {
    reportSummary(team_id: $team_id, report_id: $report_id) {
      data {
        report_id
        name
        description
        report_type
        updated_at
        dateRange {
          rangeType
          customRange {
            dateFrom
            dateTo
          }
        }
        updatedBy {
          user_id
          firstname
          lastname
          email
        }
        kpis {
          collection {
            collection_id
            title
            parent_collection_id
            parent_collection {
              collection_id
              parent_collection_id
              title
            }
          }
          measurement_id
          description
          name
          provider_id
          lowerIsBetter
          detail {
            value
            valueChangePercentage
            valueSumUptoEndDate
            valueSum
            data {
              timestamp
              value
            }
          }
          datatype {
            label
            suffix
            symbol
          }
          provider {
            provider_id
            name
            logo
          }
        }
        contents {
          provider {
            provider_id
            name
            logo
          }
          kpis {
            measurement_id
            name
            detail {
              value
              valueChangePercentage
            }
          }
        }
      }
    }
  }
`;
type Options = {
  reportId: number;
};

function useReportSummaryQuery({ reportId }: Options) {
  const { teamId } = useTeam();
  const query = useQuery(REPORT_SUMMARY_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      team_id: teamId,
      report_id: reportId,
      groupBy: 'measurement',
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

export { REPORT_SUMMARY_QUERY, useReportSummaryQuery };
