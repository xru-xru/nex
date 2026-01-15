import { gql, useQuery } from '@apollo/client';

export const LIST_CUSTOM_METRIC_EXPANSION_VARIABLES = gql`
  query ListCustomMetricExpansionVariables {
    listFunnelStepCustomMetricExpansionVariables
  }
`;

export const useListCustomMetricExpansionVariables = () => {
  return useQuery<{ listFunnelStepCustomMetricExpansionVariables: string[] }>(LIST_CUSTOM_METRIC_EXPANSION_VARIABLES);
};
