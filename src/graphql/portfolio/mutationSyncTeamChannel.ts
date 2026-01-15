import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';

import { useTeam } from 'context/TeamProvider';

const SYNC_TEAM_CHANNEL_MUTATION = gql`
  mutation SyncTeamChannel($teamId: Int!, $providerId: Int!, $from: Date, $to: Date) {
    syncTeamChannel(teamId: $teamId, providerId: $providerId, from: $from, to: $to)
  }
`;

type Props = {
  providerId: number;
  from?: Date;
  to?: Date;
};
const useSyncTeamChannelMutation = (props: Props) => {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(SYNC_TEAM_CHANNEL_MUTATION, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      providerId: props.providerId,
      from: props.from ? dayjs(props.from).format('YYYY-MM-DD') : undefined,
      to: props.to ? dayjs(props.to).format('YYYY-MM-DD') : undefined,
    },
  });

  return { syncTeamChannel: mutation, ...state };
};

export { SYNC_TEAM_CHANNEL_MUTATION, useSyncTeamChannelMutation };
