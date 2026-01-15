import useOrganizationStore from '../store/organization';

/**
 * Utility functions for managing tenant-specific assets
 */

/**
 * Get the current tenant name from the organization store
 */
export const getCurrentTenantName = (): string => {
  const { organization } = useOrganizationStore.getState();
  return organization?.tenant?.name || 'Nexoya';
};

/**
 * Generate tenant-specific asset paths
 */
export const getTenantAssetPath = (assetName: string, extension: string = 'png'): string => {
  const tenantName = getCurrentTenantName();
  const normalizedTenantName = tenantName.toLowerCase().replace(/\s+/g, '');
  return `/${assetName}-${normalizedTenantName}.${extension}`;
};

/**
 * Check if a tenant-specific asset exists
 */
export const checkTenantAssetExists = async (assetPath: string): Promise<boolean> => {
  try {
    const response = await fetch(assetPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get tenant-specific favicon paths
 */
export const getTenantFaviconPaths = () => {
  const tenantName = getCurrentTenantName();
  const normalizedTenantName = tenantName.toLowerCase().replace(/\s+/g, '');
  
  return {
    favicon32: `/favicon-32x32-${normalizedTenantName}.png`,
    favicon192: `/favicon-192x192-${normalizedTenantName}.png`,
    faviconICO: `/favicon-${normalizedTenantName}.ico`,
    manifest: `/manifest-${normalizedTenantName}.json`,
  };
};

/**
 * Get tenant-specific theme colors
 * You can extend this to return different colors for different tenants
 */
export const getTenantThemeColors = () => {
  const tenantName = getCurrentTenantName();
  
  // Default theme colors
  const defaultColors = {
    primary: '#99f127',
    secondary: '#0ec76a',
    background: '#ffffff',
    text: '#000000',
  };
  
  // You can add tenant-specific color schemes here
  const tenantColors: Record<string, typeof defaultColors> = {
    // Example: 'acmecorp': { primary: '#ff6b35', secondary: '#f7931e', ... },
  };
  
  return tenantColors[tenantName.toLowerCase()] || defaultColors;
};
