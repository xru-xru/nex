import { gql } from '@apollo/client';

const PAGE_INFO_FRAGMENT = gql`
  fragment pageInfo on PageInfo {
    hasNextPage
    endCursor
  }
`;
const DATA_EVENT_FRAGMENT = gql`
  fragment dataEvent on DataEvent {
    data_event_id
    timestamp
    content
  }
`;
export { PAGE_INFO_FRAGMENT, DATA_EVENT_FRAGMENT };
