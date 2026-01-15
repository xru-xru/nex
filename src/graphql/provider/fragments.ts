import { gql } from '@apollo/client';

const PROVIDER_META_FRAGMENT = gql`
  fragment providerMeta on Provider {
    provider_id
    name
    logo
    hasCollections
    isPortfolioPrimaryChannel
  }
`;
const PROVIDER_CONNECTION_FRAGMENT = gql`
  fragment providerConnection on Provider {
    connected
  }
`;
export { PROVIDER_META_FRAGMENT, PROVIDER_CONNECTION_FRAGMENT };
