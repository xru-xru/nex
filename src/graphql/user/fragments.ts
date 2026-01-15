import { gql } from '@apollo/client';

const USER_META_FRAGMENT = gql`
  fragment userMeta on User {
    user_id
    firstname
    lastname
    email
  }
`;

export { USER_META_FRAGMENT };
