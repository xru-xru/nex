import { gql, useMutation } from '@apollo/client';
import { get } from 'lodash';

import { NexoyaMeasurement } from '../../types/types';

import { useGlobalDate } from '../../context/DateProvider';
import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

import { DASHBOARD_KPIS_QUERY } from './queryDashboardKpis';

const ADD_DASHBOARD_KPI = gql`
  mutation addSelectedMeasurement($team_id: Int!, $measurement_id: Int!, $collection_id: Float!) {
    addSelectedMeasurement(team_id: $team_id, measurement_id: $measurement_id, collection_id: $collection_id)
  }
`;

function useAddDashboardKpi(): any {
  const { teamId } = useTeam();
  // TODO: See how we can avoid using the global date here.
  // We probably need to pass it down as "refetchQueriesProps"
  const { dateFrom, dateTo } = useGlobalDate();
  const [mutation, state] = useMutation(ADD_DASHBOARD_KPI, {
    variables: {
      team_id: teamId,
    },
    onCompleted: () => track(EVENT.FAVORITE_KPI),
    refetchQueries: [
      {
        query: DASHBOARD_KPIS_QUERY,
        variables: {
          team_id: teamId,
          dateFrom: dateFrom(),
          dateTo: dateTo(),
        },
      },
    ],
  });

  function thunkMutation(kpi: NexoyaMeasurement) {
    return () =>
      mutation({
        variables: {
          team_id: teamId,
          measurement_id: get(kpi, 'measurement_id', 0),
          collection_id: get(kpi, 'collection.collection_id', 0),
        },
      });
  }

  return [mutation, state, thunkMutation];
}

export { ADD_DASHBOARD_KPI, useAddDashboardKpi };
