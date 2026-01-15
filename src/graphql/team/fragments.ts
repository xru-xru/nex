import { gql } from '@apollo/client';

const TEAM_META_FRAGMENT = gql`
  fragment teamMeta on Team {
    team_id
    name
    logo
    currency
    number_format
  }
`;
export { TEAM_META_FRAGMENT };
