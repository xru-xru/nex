import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

const CREATE_EVENT_MUTATION = gql`
  mutation createEvent($team_id: Int!, $subject: String!, $description: String, $emoji: String, $timestamp: DateTime!) {
    createEvent(team_id: $team_id, subject: $subject, description: $description, emoji: $emoji, timestamp: $timestamp) {
      event_id
    }
  }
`;
type Options = {
  subject?: string;
  description?: string;
  emoji?: string;
  timestamp?: Date | string;
};

function useCreateEventMutation({ subject, description = null, emoji, timestamp }: Options = {}): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(CREATE_EVENT_MUTATION, {
    variables: {
      team_id: teamId,
      subject,
      description,
      emoji,
      timestamp,
    },
    onCompleted: () => track(EVENT.EVENT_ADD),
  });
  return [mutation, state];
}

export { CREATE_EVENT_MUTATION, useCreateEventMutation };
