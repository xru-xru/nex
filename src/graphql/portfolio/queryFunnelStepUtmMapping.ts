import { gql, useQuery } from '@apollo/client';

const FUNNEL_STEP_UTM_MAPPING_QUERY = gql`
  query FunnelStepUtmMappingParams {
    listFunnelStepUtmMappingParams {
      name
      type
    }
  }
`;

function useFunnelStepUtmMapping() {
  return useQuery(FUNNEL_STEP_UTM_MAPPING_QUERY, { fetchPolicy: 'cache-first' });
}

export { useFunnelStepUtmMapping, FUNNEL_STEP_UTM_MAPPING_QUERY };
