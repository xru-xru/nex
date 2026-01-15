import useOrganizationStore from '../store/organization';

/**
 * Hook to get the current tenant name
 * No fallback if no tenant name is available to avoid loading flashes
 */
export const useTenantName = () => {
  const { organization } = useOrganizationStore();
  return organization?.tenant?.name || '';
};
