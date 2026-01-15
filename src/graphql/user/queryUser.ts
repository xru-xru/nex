import { FetchPolicy, gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import client from '../../apollo';
import { ORGANIZATION_META_FRAGMENT } from '../organization/fragments';
import { TEAM_META_FRAGMENT } from '../team/fragments';
import { USER_META_FRAGMENT } from './fragments';

const USER_QUERY = gql`
  query User($withTeams: Boolean!, $withOrg: Boolean!, $team_id: Int!) {
    user {
      state
      activeRole(team_id: $team_id) {
        name
        description
      }
      ...userMeta
      teams @include(if: $withTeams) {
        ...teamMeta
        organization @include(if: $withOrg) {
          ...organizationMeta
        }
      }
    }
  }
  ${USER_META_FRAGMENT}
  ${TEAM_META_FRAGMENT}
  ${ORGANIZATION_META_FRAGMENT}
`;
type Options = {
  withTeams?: boolean;
  withOrg?: boolean;
  fetchPolicy?: FetchPolicy;
};

function useUserQuery({ withTeams = true, withOrg = true, fetchPolicy = 'cache-first' }: Options = {}) {
  const { teamId } = useTeam();
  const query = useQuery(USER_QUERY, {
    client,
    variables: {
      withTeams,
      withOrg,
      team_id: teamId,
    },
    fetchPolicy,
  });
  return query;
}

export { USER_QUERY, useUserQuery };
