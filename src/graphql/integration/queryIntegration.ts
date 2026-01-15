import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { separateLoading } from '../../utils/graphql';

import { USER_META_FRAGMENT } from '../user/fragments';
import { INTEGRATION_CONNECTION_FRAGMENT, INTEGRATION_FILTERS_FRAGMENT, INTEGRATION_META_FRAGMENT } from './fragments';

const INTEGRATION_QUERY = gql`
  query Integration(
    $team_id: Int!
    $integration_id: Int!
    $withUser: Boolean!
    $withConnection: Boolean!
    $withFilters: Boolean!
    $withMeta: Boolean!
  ) {
    integration(team_id: $team_id, integration_id: $integration_id) {
      ...integrationMeta @include(if: $withMeta)
      ...integrationConnection @include(if: $withConnection)
      ...integrationFilters @include(if: $withFilters)
      user @include(if: $withUser) {
        ...userMeta
      }
    }
  }
  ${USER_META_FRAGMENT}
  ${INTEGRATION_META_FRAGMENT}
  ${INTEGRATION_CONNECTION_FRAGMENT}
  ${INTEGRATION_FILTERS_FRAGMENT}
`;
type Options = {
  integrationId: number;
  withUser?: boolean;
  withConnection?: boolean;
  withFilters?: boolean;
  withMeta?: boolean;
  skip?: boolean;
  fetchPolicy?: 'network-only' | 'cache-first';
};

function useIntegrationQuery({
  integrationId,
  withUser = false,
  withConnection = false,
  withFilters = false,
  skip = false,
  withMeta = true,
  fetchPolicy = 'cache-first',
}: Options): any {
  const { teamId } = useTeam();
  const query = useQuery(INTEGRATION_QUERY, {
    notifyOnNetworkStatusChange: true,
    skip,
    fetchPolicy,
    variables: {
      team_id: teamId,
      integration_id: integrationId,
      withUser,
      withConnection,
      withFilters,
      withMeta,
    },
  });
  return { ...separateLoading(query) };
}

export { INTEGRATION_QUERY, useIntegrationQuery };
