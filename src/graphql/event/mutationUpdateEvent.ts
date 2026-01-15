import { gql, useMutation } from '@apollo/client';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

const UPDATE_EVENT_MUTATION = gql`
  mutation updateEvent($event_id: Int!, $subject: String, $description: String, $emoji: String, $timestamp: DateTime) {
    updateEvent(
      event_id: $event_id
      subject: $subject
      description: $description
      emoji: $emoji
      timestamp: $timestamp
    ) {
      event_id
    }
  }
`;
type Options = {
  event_id: number;
  subject?: string;
  description?: string;
  emoji?: string;
  timestamp?: Date;
};

function useUpdateEventMutation({ event_id, subject, description, emoji, timestamp }: Options) {
  const [mutation, state] = useMutation(UPDATE_EVENT_MUTATION, {
    notifyOnNetworkStatusChange: true,
    variables: {
      event_id,
      subject,
      description,
      emoji,
      timestamp,
    },
    onCompleted: () => track(EVENT.EVENT_UPDATE),
  });
  return [mutation, state];
}

export { UPDATE_EVENT_MUTATION, useUpdateEventMutation };
