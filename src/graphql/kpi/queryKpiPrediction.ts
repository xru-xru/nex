import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { KpiInput } from '../../types/types.custom';

import { useTeam } from '../../context/TeamProvider';

import client from '../../apollo';

const KPI_PREDICTION_QUERY = gql`
  query prediction($collectionId: Float!, $measurementId: Int!, $periods: Int, $teamId: Int!) {
    predict(collectionId: $collectionId, measurementId: $measurementId, periods: $periods, teamId: $teamId) {
      data {
        value
        timestamp
        valueLower
        valueUpper
      }
      valueSumUp {
        timestamp
        value
        valueLower
        valueUpper
      }
    }
  }
`;
type Options = {
  kpiInput?: KpiInput;
  distance?: number;
  skip?: boolean;
};

function useKpiPredictionQuery({ kpiInput, distance = 6, skip = false }: Options = {}): any {
  const { teamId } = useTeam();
  const query = useQuery(KPI_PREDICTION_QUERY, {
    variables: {
      teamId,
      collectionId: kpiInput.collection_id,
      measurementId: kpiInput.measurement_id,
      periods: distance,
    },
    skip,
    client,
  });
  return query;
}

export { KPI_PREDICTION_QUERY, useKpiPredictionQuery };
