import { gql, useMutation } from '@apollo/client';

import { NexoyaShareType } from '../../types/types';
import { ShareItemTypes } from '../../types/types.custom';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

const INVITE_SHARE_USER_MUTATION = gql`
  mutation InviteShareUser(
    $team_id: Int!
    $to_email: String!
    $to_name: String!
    $shareType: ShareType!
    $url: String!
    $sharingObjectName: SharingObjectName!
  ) {
    inviteShareUser(
      team_id: $team_id
      to_email: $to_email
      to_name: $to_name
      shareType: $shareType
      url: $url
      sharingObjectName: $sharingObjectName
    )
  }
`;
// all option items are optional, because we dont pass them all at once
type Options = {
  to_email: string;
  to_name: string;
  shareType: NexoyaShareType;
  url: string;
  sharingObjectName: ShareItemTypes;
};

function useInviteShareUserMutation(): any {
  const { teamId: team_id } = useTeam();
  const [mutation, state] = useMutation(INVITE_SHARE_USER_MUTATION, {
    variables: {
      team_id,
    },
    onCompleted: () => track(EVENT.REPORT_SHARE),
  });

  function extendMutation({ to_email, to_name, shareType, url, sharingObjectName }: Options) {
    return mutation({
      variables: {
        to_email,
        to_name,
        shareType,
        url,
        sharingObjectName,
      },
    });
  }

  return [mutation, state, extendMutation];
}

export { INVITE_SHARE_USER_MUTATION, useInviteShareUserMutation };
