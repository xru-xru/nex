import { gql, useQuery } from '@apollo/client';

export const LIST_CUSTOM_IMPORT_EXPANSION_VARIABLES = gql`
  query ListCustomImportExpansionVariables {
    listFunnelStepCustomImportExpansionVariables
  }
`;

export const useListCustomImportExpansionVariables = () => {
  return useQuery<{ listFunnelStepCustomImportExpansionVariables: string[] }>(LIST_CUSTOM_IMPORT_EXPANSION_VARIABLES);
};
