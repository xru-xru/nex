import { NexoyaPortfolioParentContentsSortField, NexoyaSortOrder } from '../../../types';
import { extractIdsByKey } from '../../../utils/array';
import { ContentFilterState } from '../../../store/content-filter';

export const humanizeSortField = (sortField: NexoyaPortfolioParentContentsSortField) => {
  switch (sortField) {
    case NexoyaPortfolioParentContentsSortField.ContentTitle:
      return 'Content title';
    case NexoyaPortfolioParentContentsSortField.ContentType:
      return 'Content type';
    case NexoyaPortfolioParentContentsSortField.LabelName:
      return 'Label name';
    case NexoyaPortfolioParentContentsSortField.ImpactGroupName:
      return 'Impact group name';
    case NexoyaPortfolioParentContentsSortField.ProviderId:
      return 'Channel';
    case NexoyaPortfolioParentContentsSortField.IsIncludedInOptimization:
      return 'Optimization status';
    case NexoyaPortfolioParentContentsSortField.ContentRuleName:
      return 'Content rule name';
    case NexoyaPortfolioParentContentsSortField.ImpactGroupRuleName:
      return 'Impact group rule name';
    case NexoyaPortfolioParentContentsSortField.AttributionRuleName:
      return 'Attribution rule name';
    case NexoyaPortfolioParentContentsSortField.IsRuleManaged:
      return 'Content mode';
    default:
      return '';
  }
};

export const buildPortfolioContentFilterVariables = (
  teamId: number,
  portfolioId: number,
  filters: ContentFilterState,
) => {
  const {
    providersFilter,
    labelsFilter,
    impactGroupsFilter,
    contentRulesFilter,
    attributionRulesFilter,
    impactGroupRulesFilter,
    isIncludedInOptimization,
    isRuleManaged,
    titleContains,
    sortField,
    sortOrder,
    pageSize,
  } = filters;

  const filteredProviderIds = extractIdsByKey(providersFilter, 'provider_id');
  const filteredLabelIds = extractIdsByKey(labelsFilter, 'labelId');
  const filteredImpactGroupIds = extractIdsByKey(impactGroupsFilter, 'impactGroupId');
  const filteredContentRuleIds = extractIdsByKey(contentRulesFilter, 'contentRuleId');
  const filteredAttributionRuleIds = extractIdsByKey(attributionRulesFilter, 'attributionRuleId');
  const filteredImpactGroupRuleIds = extractIdsByKey(impactGroupRulesFilter, 'impactGroupRuleId');

  return {
    teamId,
    portfolioId,
    sortOrder: sortField ? sortOrder || NexoyaSortOrder.Asc : NexoyaSortOrder.Asc,
    sortField: sortField || NexoyaPortfolioParentContentsSortField.ProviderId,
    first: pageSize,
    portfolioContentFilter: {
      ...(filteredAttributionRuleIds.length ? { attributionRuleIds: filteredAttributionRuleIds } : {}),
      ...(filteredContentRuleIds.length ? { contentRuleIds: filteredContentRuleIds } : {}),
      ...(filteredImpactGroupIds.length ? { impactGroupIds: filteredImpactGroupIds } : {}),
      ...(filteredImpactGroupRuleIds.length ? { impactGroupRuleIds: filteredImpactGroupRuleIds } : {}),
      ...(filteredLabelIds.length ? { labelIds: filteredLabelIds } : {}),
      ...(filteredProviderIds.length ? { providerIds: filteredProviderIds } : {}),
      ...(titleContains ? { titleContains } : {}),
      ...(isRuleManaged !== undefined ? { isRuleManaged } : {}),
      ...(isIncludedInOptimization !== undefined ? { isIncludedInOptimization } : {}),
    },
  };
};
