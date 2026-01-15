import { gql } from '@apollo/client';

import { TEAM_META_FRAGMENT } from '../team/fragments';
import { USER_META_FRAGMENT } from '../user/fragments';

const INITIAL_QUERY = gql`
  query InitialData {
    user {
      state
      ...userMeta
      teams {
        members {
          role {
            name
          }
          user_id
        }
        ...teamMeta
      }
    }
  }
  ${USER_META_FRAGMENT}
  ${TEAM_META_FRAGMENT}
`;
export { INITIAL_QUERY };
