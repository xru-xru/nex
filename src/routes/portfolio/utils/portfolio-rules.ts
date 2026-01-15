import {
  NexoyaAttributionRuleFilters,
  NexoyaContentRuleFilters,
  NexoyaContentV2,
  NexoyaImpactGroupRuleFilters,
} from '../../../types';

export const CONTENT_TYPE_SUB_ACCOUNT_NUMBER = 2;

export const extractProviderMapFromFilters = (
  filter: NexoyaContentRuleFilters | NexoyaImpactGroupRuleFilters | NexoyaAttributionRuleFilters,
  subAccounts: NexoyaContentV2[],
): Record<number, number[]> => {
  const providerMap: Record<number, number[]> = {};

  const isContentRuleOrAttributionRule = (filter: any): filter is NexoyaContentRuleFilters =>
    filter.__typename === 'ContentRuleFilters' || filter.__typename === 'AttributionRuleFilters';

  const providerIds = isContentRuleOrAttributionRule(filter)
    ? [filter.providerId]
    : // @ts-ignore
      filter.providers.map((p) => p.providerId);

  const parentContentIds = isContentRuleOrAttributionRule(filter)
    ? filter.adAccountIds
    : // @ts-ignore
      filter.providers.flatMap((p) => p.adAccountIds);

  // Find matching subAccounts and map their providers to content IDs
  for (const providerId of providerIds) {
    const matchingSubAccounts = subAccounts.filter(
      (account) => account.provider?.provider_id === providerId && parentContentIds?.includes(account.contentId),
    );

    if (!providerMap[providerId]) {
      providerMap[providerId] = [];
    }

    matchingSubAccounts.forEach((account) => {
      providerMap[providerId].push(account.contentId);
    });
  }

  return providerMap;
};
