import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

const DELETE_EVENT_MUTATION = gql`
  mutation deleteEvent($event_id: Int!) {
    deleteEvent(event_id: $event_id)
  }
`;
type Options = {
  event_id: number;
};

function useDeleteEventMutation({ event_id }: Options) {
  const [mutation, state] = useMutation(DELETE_EVENT_MUTATION, {
    notifyOnNetworkStatusChange: true,
    variables: {
      event_id,
    },
  });
  return [mutation, state];
}

export { DELETE_EVENT_MUTATION, useDeleteEventMutation };
