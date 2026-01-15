import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { get } from 'lodash';

import { NexoyaMeasurement } from '../../types/types';

import { useGlobalDate } from '../../context/DateProvider';
import { useTeam } from '../../context/TeamProvider';

import { DASHBOARD_KPIS_QUERY } from './queryDashboardKpis';

const REMOVE_DASHBOARD_KPI = gql`
  mutation removeSelectedMeasurement($team_id: Int!, $measurement_id: Int!, $collection_id: Float!) {
    removeSelectedMeasurement(team_id: $team_id, measurement_id: $measurement_id, collection_id: $collection_id)
  }
`;
type Options = {
  measurementId?: number;
  collectionId?: number;
};

function useRemoveDashboardKpi({ measurementId = 0, collectionId = 0 }: Options = {}): any {
  const { teamId } = useTeam();
  // TODO: See how we can avoid using the global date here.
  // We probably need to pass it down as "refetchQueriesProps"
  const { dateFrom, dateTo } = useGlobalDate();
  const [mutation, state] = useMutation(REMOVE_DASHBOARD_KPI, {
    variables: {
      team_id: teamId,
      measurement_id: measurementId,
      collection_id: collectionId,
    },
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

export { REMOVE_DASHBOARD_KPI, useRemoveDashboardKpi };
