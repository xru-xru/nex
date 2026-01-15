import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

const INVITE_USER_MUTATION = gql`
  mutation InviteUser($team_id: Int!, $to_email: String!, $to_name: String!) {
    inviteUser(team_id: $team_id, to_email: $to_email, to_name: $to_name)
  }
`;
// all option items are optional, because we dont pass them all at once
type Options = {
  to_email: string;
  to_name: string;
};

function useInviteUserMutation(): any {
  const { teamId: team_id } = useTeam();
  const [mutation, state] = useMutation(INVITE_USER_MUTATION, {
    variables: {
      team_id,
    },
    onCompleted: () => track(EVENT.SETTINGS_INVITE_MEMBER),
  });

  function extendMutation({ to_email, to_name }: Options) {
    return mutation({
      variables: {
        to_email,
        to_name,
      },
    });
  }

  return [mutation, state, extendMutation];
}

export { INVITE_USER_MUTATION, useInviteUserMutation };
