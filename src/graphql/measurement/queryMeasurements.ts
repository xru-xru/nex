import { gql, useQuery } from '@apollo/client';

const MEASUREMENTS_QUERY = gql`
  query Measurements($providerId: Int!) {
    measurements(provider_id: $providerId) {
      measurement_id
      optimization_target_type
      name
      provider_id
    }
  }
`;
type Options = {
  providerId: number;
  skip?: boolean;
};

function useMeasurementsQuery({ providerId, skip }: Options): any {
  const query = useQuery<{ measurements: { measurement_id: number; name: string }[] }, { providerId: number }>(
    MEASUREMENTS_QUERY,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        providerId,
      },
      skip: !providerId || skip,
    },
  );
  return query;
}

export { MEASUREMENTS_QUERY, useMeasurementsQuery };
