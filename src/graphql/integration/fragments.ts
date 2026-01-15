import { gql } from '@apollo/client';

const INTEGRATION_META_FRAGMENT = gql`
  fragment integrationMeta on Integration {
    integration_id
    provider_id
    name
    title
  }
`;
const INTEGRATION_CONNECTION_FRAGMENT = gql`
  fragment integrationConnection on Integration {
    connectionUrl
    connected
    type
    hasFilter
    fields
  }
`;
const INTEGRATION_FILTERS_FRAGMENT = gql`
  fragment integrationFilters on Integration {
    filterOptions {
      filterName
      filterList {
        id
        itemInfo
        selected
      }
    }
  }
`;
export { INTEGRATION_META_FRAGMENT, INTEGRATION_CONNECTION_FRAGMENT, INTEGRATION_FILTERS_FRAGMENT };
