import { NexoyaDailyImpactGroupMetric, NexoyaDailyMetric, NexoyaDailyOptimizationMetric } from '../types';

export const getDailySpendPerProvider = (dailyMetric: NexoyaDailyMetric) => {
  return dailyMetric?.providers?.reduce(
    (acc, provider) => ({
      ...acc,
      [provider.providerId]: provider?.value?.adSpend,
    }),
    {},
  );
};

export const getDailyValuePerProvider = (dailyMetric: NexoyaDailyMetric) => {
  return dailyMetric?.providers?.reduce(
    (acc, provider) => ({
      ...acc,
      [provider.providerId]: provider?.value?.value,
    }),
    {},
  );
};
export const getDailyValuePerLabel = (dailyMetric: NexoyaDailyMetric) => {
  return dailyMetric?.labels?.reduce(
    (acc, label) => ({
      ...acc,
      [label.labelId]: label?.value?.value,
    }),
    {},
  );
};
export const getDailyValuePerImpactGroup = (dailyMetric: NexoyaDailyMetric) => {
  return dailyMetric?.impactGroups?.reduce(
    (acc, impactGroupMetric) => ({
      ...acc,
      [impactGroupMetric?.impactGroup?.impactGroupId]: impactGroupMetric?.value?.value,
    }),
    {},
  );
};

export const getOptiDailyValuePerProvider = (dailyMetric: NexoyaDailyOptimizationMetric) => {
  return dailyMetric?.providers?.reduce(
    (acc, provider) => ({
      ...acc,
      [provider.providerId]: provider.relativeBaseline,
    }),
    {},
  );
};
export const getOptiDailyValuePerLabel = (dailyMetric: NexoyaDailyOptimizationMetric) => {
  return dailyMetric?.labels?.reduce(
    (acc, label) => ({
      ...acc,
      [label.labelId]: label.relativeBaseline,
    }),
    {},
  );
};
export const getOptiDailyValuePerImpactGroup = (dailyMetric: NexoyaDailyOptimizationMetric) => {
  return dailyMetric?.impactGroups?.reduce(
    (acc, impactGroupMetric) => ({
      ...acc,
      [impactGroupMetric?.impactGroup?.impactGroupId]: impactGroupMetric?.relativeBaseline,
    }),
    {},
  );
};

const filterByProvider = (dailyMetric: NexoyaDailyMetric | NexoyaDailyOptimizationMetric, providerIds: number[]) =>
  // @ts-ignore
  dailyMetric?.providers?.filter((provider) => providerIds.includes(provider.providerId));

const filterByLabel = (dailyMetric: NexoyaDailyMetric | NexoyaDailyOptimizationMetric, weightIds: number[]) =>
  // @ts-ignore
  dailyMetric?.labels?.filter((label) => weightIds.includes(label.labelId));

const filterByImpactGroup = (
  dailyMetric: NexoyaDailyMetric | NexoyaDailyOptimizationMetric,
  impactGroupIds: number[],
) =>
  // @ts-ignore
  (dailyMetric?.impactGroups || [])?.filter((impactGroup: NexoyaDailyImpactGroupMetric) =>
    impactGroupIds.includes(impactGroup.impactGroup?.impactGroupId),
  );

export const getFilterSource = (
  dailyMetric: NexoyaDailyMetric | NexoyaDailyOptimizationMetric,
  isStackedAreaChartActive: boolean,
  compareToRestOfData: boolean,
  filteredProviderIds: number[],
  filteredLabelIds: number[],
  filteredImpactGroupIds: number[],
) => {
  const isFilteringNeeded = !isStackedAreaChartActive || !compareToRestOfData;
  if (isFilteringNeeded) {
    if (filteredProviderIds.length > 0) {
      return filterByProvider(dailyMetric, filteredProviderIds);
    } else if (filteredLabelIds.length > 0) {
      return filterByLabel(dailyMetric, filteredLabelIds);
    } else if (filteredImpactGroupIds.length > 0) {
      return filterByImpactGroup(dailyMetric, filteredImpactGroupIds);
    }
  }

  return dailyMetric.providers;
};
