import { gql, useQuery } from '@apollo/client';

export const AVAILABLE_FIELDS_AND_OPERATIONS_QUERY = gql`
  query AvailableFieldsAndOperations($providerId: Float!) {
    availableFieldOperations(providerId: $providerId) {
      fieldName
      operators
      allowed {
        enumOptionsNumber
        enumOptionsString
        fieldType
      }
    }
  }
`;

type Options = {
  providerId: number;
};

export function useAvailableFieldsAndOperationsQuery({ providerId }: Options) {
  return useQuery(AVAILABLE_FIELDS_AND_OPERATIONS_QUERY, {
    variables: { providerId },
    fetchPolicy: 'network-only',
  });
}
