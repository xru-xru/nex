import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import removeApolloCacheKeys from '../../utils/removeApolloCacheKeys';

const DELETE_CUSTOM_KPI_MUTATION = gql`
  mutation DeleteCustomKpi($custom_kpi_id: Int!) {
    deleteCustomKpi(custom_kpi_id: $custom_kpi_id)
  }
`;
type Options = {
  custom_kpi_id: number;
};

function useDeleteCustomKpi({ custom_kpi_id }: Options) {
  const [mutation, state] = useMutation(DELETE_CUSTOM_KPI_MUTATION, {
    variables: {
      custom_kpi_id,
    },
    // We need to wipe out the campaign cache to make sure we don't have an old
    // copy of data in the filtered/paginated results. This has been an issue
    // with Apollo for a while. After solved it can be removed
    update: (cache) => removeApolloCacheKeys(cache, 'measurementRangeSearchPg'),
  });
  return [mutation, state];
}

export { DELETE_CUSTOM_KPI_MUTATION, useDeleteCustomKpi };
