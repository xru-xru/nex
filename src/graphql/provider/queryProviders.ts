import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import auth from '../../Auth/Auth';
import { PROVIDER_CONNECTION_FRAGMENT, PROVIDER_META_FRAGMENT } from './fragments';

const PROVIDERS_QUERY = gql`
  query Providers($team_id: Int) {
    providers(team_id: $team_id) {
      ...providerMeta
      ...providerConnection
    }
  }
  ${PROVIDER_META_FRAGMENT}
  ${PROVIDER_CONNECTION_FRAGMENT}
`;

function useProvidersQuery() {
  const { teamId } = useTeam();
  const token = auth.getAccessToken();
  const query = useQuery(PROVIDERS_QUERY, {
    variables: {
      team_id: teamId || null,
    },
    skip: !token || !teamId,
  });
  return query;
}

export { PROVIDERS_QUERY, useProvidersQuery };
