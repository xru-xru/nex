import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { TEAM_QUERY } from './queryTeam';

const UPDATE_TEAM_MEMBER_ROLE_MUTATION = gql`
  mutation UpdateTeamMemberRole($team_id: Int!, $user_id: Int!, $new_role_def: String!) {
    updateTeamMemberRole(team_id: $team_id, user_id: $user_id, new_role_def: $new_role_def)
  }
`;

type Options = {
  team_id: number;
  user_id: number;
  new_role_def: string;
};
function useUpdateTeamMemberRoleMutation({ team_id, user_id, new_role_def }: Options): any {
  const [mutation, state] = useMutation(UPDATE_TEAM_MEMBER_ROLE_MUTATION, {
    variables: {
      team_id,
      user_id,
      new_role_def,
    },
    refetchQueries: [
      {
        query: TEAM_QUERY,
        variables: {
          team_id,
          withMembers: true,
          withOrg: false,
        },
      },
    ],
  });

  return [mutation, state];
}

export { UPDATE_TEAM_MEMBER_ROLE_MUTATION, useUpdateTeamMemberRoleMutation };
