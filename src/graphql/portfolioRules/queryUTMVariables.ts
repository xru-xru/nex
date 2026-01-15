import { gql, useQuery } from '@apollo/client';

export const LIST_FUNNEL_STEP_UTM_VARIABLES = gql`
  query ListFunnelStepUtmVariables {
    listFunnelStepUtmExpansionVariables
  }
`;

export const useListFunnelStepUtmVariables = () => {
  return useQuery<{ listFunnelStepUtmExpansionVariables: string[] }>(LIST_FUNNEL_STEP_UTM_VARIABLES);
};
