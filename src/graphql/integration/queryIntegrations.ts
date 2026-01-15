import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { separateLoading } from '../../utils/graphql';
import { maybe } from '../../utils/object';

import { USER_META_FRAGMENT } from '../user/fragments';
import { INTEGRATION_META_FRAGMENT } from './fragments';

const INTEGRATIONS_QUERY = gql`
  query integrations(
    $team_id: Int!
    $withUser: Boolean!
    $withConnection: Boolean!
    $withFilters: Boolean!
    $type: String
  ) {
    integrations(team_id: $team_id, filter: { type: $type }) {
      ...integrationMeta
      connectionUrl @include(if: $withConnection)
      connected @include(if: $withConnection)
      status @include(if: $withConnection)
      lastSyncAt @include(if: $withConnection)
      type @include(if: $withConnection)
      hasFilter @include(if: $withConnection)
      fields @include(if: $withConnection)
      filterOptions @include(if: $withFilters) {
        filterName
        filterList {
          id
          itemInfo
          selected
        }
      }
      provider {
        provider_id
        logo
        name
        description
        category
        showInToplist
      }
      user @include(if: $withUser) {
        ...userMeta
      }
    }
  }
  ${USER_META_FRAGMENT}
  ${INTEGRATION_META_FRAGMENT}
`;
type Options = {
  withUser?: boolean;
  withConnection?: boolean;
  withFilters?: boolean;
  type?: 'auto' | 'manual';
};

function useIntegrationsQuery(
  { withUser = false, withConnection = false, withFilters = false, type = null }: Options = {},
): any {
  const { teamId } = useTeam();
  const query = useQuery(INTEGRATIONS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    variables: {
      team_id: teamId,
      withUser,
      withConnection,
      withFilters,
      ...maybe('type', type),
    },
  });
  return { ...separateLoading(query) };
}

export { INTEGRATIONS_QUERY, useIntegrationsQuery };
