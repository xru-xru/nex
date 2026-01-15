import { gql } from '@apollo/client';

const ORGANIZATION_META_FRAGMENT = gql`
  fragment organizationMeta on Org {
    org_id
    name
  }
`;

const ORGANIZATION_WITH_TENANT_FRAGMENT = gql`
  fragment organizationWithTenant on Org {
    org_id
    name
    tenant {
      name
      tenant_id
      uiCustomization {
        faviconUrl
        helpPageUrl
        logoUrl
        pageTitlePrefix
        onboardingMail
        supportMail
      }
    }
  }
`;

export { ORGANIZATION_META_FRAGMENT, ORGANIZATION_WITH_TENANT_FRAGMENT };
