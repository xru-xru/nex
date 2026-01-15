import { gql } from '@apollo/client';

const MEASUREMENT_META_FRAGMENT = gql`
  fragment measurementMetaFragment on Measurement {
    description
    measurement_id
    name
    provider_id
  }
`;
export { MEASUREMENT_META_FRAGMENT };
