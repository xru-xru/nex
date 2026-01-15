import { NexoyaProviderFilter } from 'types';
import { get } from 'lodash';

/**
 * Validates provider data to ensure it's not corrupted
 * @param {number} providerId - The provider ID
 * @param {NexoyaProviderFilter[]} providerFilters - List of provider filters
 * @returns {boolean} - True if data is corrupted, false otherwise
 */
export function isProviderDataCorrupted(providerId: number, providerFilters: NexoyaProviderFilter[]): boolean {
  // Basic validation checks
  if (!providerId || !providerFilters || providerFilters.length === 0) {
    return true;
  }

  // Validate each filter in the provider filters
  for (const filter of providerFilters) {
    const filterList = get(filter, 'filterList', []);

    // Check if filter is valid
    if (!get(filter, 'filterName', false) || filterList.length === 0 || filterList.some((f) => !f.id || !f.itemInfo)) {
      return true;
    }
  }

  return false;
}
