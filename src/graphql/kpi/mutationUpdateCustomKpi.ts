import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { NexoyaCkSearch } from '../../types/types';
import '../../types/types';
import { NexoyaCkKpiInput } from '../../types/types';

import { useGlobalDate } from '../../context/DateProvider';
import { useTeam } from '../../context/TeamProvider';

import { SELECTED_KPIS_QUERY } from './querySelectedKpis';

const UPDATE_CUSTOM_KPI_MUTATION = gql`
  mutation UpdateCustomKpi(
    $custom_kpi_id: Int!
    $name: String
    $description: String
    $calc_type: CalcType
    $kpis: [CkKpiInput!]
    $search: CKSearchInput
  ) {
    updateCustomKpi(
      custom_kpi_id: $custom_kpi_id
      name: $name
      description: $description
      calc_type: $calc_type
      kpis: $kpis
      search: $search
    ) {
      custom_kpi_id
    }
  }
`;
type Options = {
  custom_kpi_id: number;
  name?: string;
  description?: string;
  calc_type?: string;
  kpis?: NexoyaCkKpiInput[];
  collectionId?: number;
  measurementId?: number;
  search?: NexoyaCkSearch;
};

function useUpdateCustomKpiMutation({
  custom_kpi_id,
  name,
  description,
  calc_type,
  kpis,
  collectionId,
  measurementId,
  search,
}: Options) {
  const { dateFrom, dateTo } = useGlobalDate();
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(UPDATE_CUSTOM_KPI_MUTATION, {
    variables: {
      custom_kpi_id,
      name,
      description,
      calc_type,
      kpis,
      search,
    },
    refetchQueries: [
      {
        query: SELECTED_KPIS_QUERY,
        variables: {
          team_id: teamId,
          kpisInput: [
            {
              measurement_id: measurementId,
              collection_id: collectionId,
            },
          ],
          first: 10,
          dateFrom: dateFrom(),
          dateTo: dateTo(),
          withCollectionLinks: true,
          withCollectionParent: false,
          withCollectionMeta: true,
          withKpiDataPoints: true,
        },
      },
    ],
  });
  return [mutation, state];
}

export { UPDATE_CUSTOM_KPI_MUTATION, useUpdateCustomKpiMutation };
