import { gql, useMutation } from '@apollo/client';

import { NexoyaCalcType, NexoyaCkSearch } from '../../types/types';
import { KpiInput } from '../../types/types.custom';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

// import removeApolloCacheKeys from '../../utils/removeApolloCacheKeys';
const CREATE_CUSTOM_KPI = gql`
  mutation createCustomKpi(
    $team_id: Int!
    $name: String!
    $description: String
    $calc_type: CalcType!
    $kpis: [CkKpiInput!]
    $search: CKSearchInput
  ) {
    createCustomKpi(
      team_id: $team_id
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
  name: string;
  description?: string;
  calc_type: NexoyaCalcType;
  kpis: KpiInput[];
  search?: NexoyaCkSearch;
};

function useCreateCustomKpiMutation({ name, description = null, calc_type, kpis, search }: Options) {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(CREATE_CUSTOM_KPI, {
    variables: {
      team_id: teamId,
      name,
      description,
      calc_type,
      kpis,
      search,
    },
    onCompleted: () => track(EVENT.CUSTOM_KPI_ADD, null),
  });
  return [mutation, state];
}

export { CREATE_CUSTOM_KPI, useCreateCustomKpiMutation };
