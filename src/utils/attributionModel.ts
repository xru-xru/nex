import { camelCase, startCase, toNumber } from 'lodash';
import {
  NexoyaAttributionModelChannelFilterInput,
  NexoyaAttributionModelGa4FiltersInput,
  NexoyaContentFilterFieldName,
  NexoyaContentFilterOperator,
  NexoyaFieldOperation,
  NexoyaFilterListType,
  NexoyaIntegration,
} from '../types';
import {
  getFilterValueInputBasedOnType,
  getIconForField,
  getTypeForField,
  humanizeFieldName,
  mapOperationsToUI,
  sortFields,
} from '../routes/portfolio/components/Content/PortfolioRule/utils';
import { DataTableFilterOption } from '../routes/portfolio/components/Content/PortfolioRule/types';
import { ChannelAccount, ChannelSelection, Ga4State } from '../routes/components/CreateAttributionModel/types';
import { AvailableChannel } from '../routes/components/CreateAttributionModel/components/ChannelSelectionStep';

/**
 * Formats file size in bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** exponent;
  return `${size.toFixed(size >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/**
 * Transforms available field operations into UI-friendly filter options
 */
export function transformFieldOptions(availableFields: NexoyaFieldOperation[]): DataTableFilterOption[] {
  const sortedFields = sortFields(availableFields ?? []);
  return sortedFields
    ?.filter((field) => field.fieldName !== NexoyaContentFilterFieldName.ParentContentId)
    ?.map((field: NexoyaFieldOperation) => ({
      id: field.fieldName,
      label: humanizeFieldName(field.fieldName),
      value: field.fieldName,
      options:
        field.allowed.fieldType === 'boolean'
          ? [
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ]
          : field.allowed.enumOptionsString?.map((option: string) => ({
              label: startCase(camelCase(option)),
              value: option,
            })) || [],
      operators: mapOperationsToUI(field.operators),
      icon: getIconForField(field.fieldName),
      type:
        field.fieldName === NexoyaContentFilterFieldName.Title ||
        field.fieldName === NexoyaContentFilterFieldName.ParentTitle
          ? ('stringArr' as const)
          : (getTypeForField(field.allowed) as 'string' | 'number' | 'date' | 'numberArr' | 'stringArr' | 'boolean'),
      placeholder: `Filter by ${humanizeFieldName(field.fieldName)}`,
    }));
}

/**
 * Transforms integration data into available channels
 */
export function transformIntegrationsToChannels(integrationsData: {
  integrations?: NexoyaIntegration[];
}): AvailableChannel[] {
  const integrations: NexoyaIntegration[] = integrationsData?.integrations ?? [];

  return integrations
    .filter((integration) => integration.connected && integration.filterOptions?.length)
    .map((integration) => {
      const accounts: ChannelAccount[] =
        integration.filterOptions
          ?.flatMap((option) => option?.filterList ?? [])
          ?.map((item: NexoyaFilterListType) => {
            const rawId = item?.id ?? '';
            return {
              id: rawId,
              label: (item?.itemInfo ?? []).filter(Boolean).join(' • ') || 'Untitled account',
            };
          })
          .filter((item) => item.id && !isNaN(toNumber(item.id))) ?? [];

      return {
        providerId: integration.provider_id,
        providerName: integration.provider?.name ?? integration.title ?? integration.name,
        providerLogo: integration.provider?.logo ?? undefined,
        integrationId: integration.integration_id,
        accounts,
      };
    })
    .filter((channel) => channel.accounts.length > 0);
}

/**
 * Transforms channel selections into channel filter inputs for the API
 */
export function transformChannelSelectionsToFilters(
  selectedChannels: ChannelSelection[],
): NexoyaAttributionModelChannelFilterInput[] {
  return selectedChannels.map((channel) => {
    const contentFilters = channel.filters.map((filter) => ({
      fieldName: filter.value as NexoyaContentFilterFieldName,
      operator: (filter.filterOperator || 'eq') as NexoyaContentFilterOperator,
      value: getFilterValueInputBasedOnType(filter.type, filter.filterValues || []),
    }));

    const adAccountIds = channel.selectedAccountIds
      .map((id) => {
        const numericId = toNumber(id);
        return isNaN(numericId) ? null : numericId;
      })
      .filter((id): id is number => id !== null);

    return {
      providerId: channel.providerId,
      adAccountIds,
      contentFilters,
      conversions: [], // TODO: Add conversions when needed
    };
  });
}

/**
 * Transforms GA4 state into GA4 filter inputs for the API
 */
export function transformGa4StateToFilters(ga4State: Ga4State): NexoyaAttributionModelGa4FiltersInput {
  return {
    dimensions: ga4State.dimensions.map((d) => d.value).filter(Boolean),
    metricIds: ga4State.metricIds,
  };
}

