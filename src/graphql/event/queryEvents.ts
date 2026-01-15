import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { separateLoading } from '../../utils/graphql';

// events(team_id: Int!, dateFrom: Date, dateTo: Date, offset: Int, first: Int, where: EventFilter): [Event]
const EVENTS_QUERY = gql`
  query Events(
    $dateFrom: DateTime
    $dateTo: DateTime
    $offset: Float
    $first: Float
    $where: EventFilter
    $team_id: Int!
  ) {
    events: events(
      dateFrom: $dateFrom
      dateTo: $dateTo
      offset: $offset
      first: $first
      where: $where
      team_id: $team_id
    ) {
      event_id
      subject
      description
      emoji
      timestamp
    }
  }
`;
type Options = {
  dateFrom?: Date | string | null;
  dateTo?: Date | string | null;
  offset?: number | null;
};

function useEventsQuery({ dateFrom = null, dateTo = null, offset = null }: Options = {}): any {
  const { teamId } = useTeam();
  const query = useQuery(EVENTS_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      team_id: teamId,
      dateFrom,
      dateTo,
      offset,
    },
  });
  return { ...separateLoading(query) };
}

export { EVENTS_QUERY, useEventsQuery };
