import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { ORGANIZATION_WITH_TENANT_FRAGMENT } from '../organization/fragments';
import { TEAM_META_FRAGMENT } from './fragments';
import { useCurrencyStore } from 'store/currency-selection';
import useOrganizationStore, { DEFAULT_UI_CUSTOMIZATION_FALLBACK } from '../../store/organization';

const TEAM_QUERY = gql`
  query Team($team_id: Int!, $withMembers: Boolean!, $withOrg: Boolean!) {
    team(team_id: $team_id) {
      ...teamMeta
      members @include(if: $withMembers) {
        user_id
        firstname
        lastname
        email
        lastLogin
        role {
          name
        }
      }
      organization @include(if: $withOrg) {
        ...organizationWithTenant
      }
      onboarding
      featureFlags {
        name
        status
      }
      dashboardUrls {
        name
        url
      }
      customization
    }
    roles {
      name
      description
    }
  }
  ${TEAM_META_FRAGMENT}
  ${ORGANIZATION_WITH_TENANT_FRAGMENT}
`;
type Options = {
  withMembers?: boolean;
  withOrg?: boolean;
  skip?: boolean;
};

function useTeamQuery({ withMembers = false, withOrg = true, skip = false }: Options = {}) {
  const { teamId } = useTeam();
  const { setTeamCurrencySettings } = useCurrencyStore();
  const { setOrganization, setCustomization } = useOrganizationStore();

  const query = useQuery(TEAM_QUERY, {
    skip,
    variables: {
      team_id: teamId,
      withMembers,
      withOrg,
    },
    onCompleted: (data) => {
      if (data?.team?.currency) {
        setTeamCurrencySettings({ teamId, currency: data.team.currency, numberFormat: data.team.number_format });
      }
      if (data?.team?.organization && withOrg) {
        setOrganization(data?.team?.organization);
        setCustomization(data?.team?.organization?.tenant?.uiCustomization || DEFAULT_UI_CUSTOMIZATION_FALLBACK);
      }
    },
  });
  return query;
}

export { TEAM_QUERY, useTeamQuery };
