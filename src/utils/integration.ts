import { NexoyaFilterListType, NexoyaIntegration, NexoyaProvider } from '../types/types';

export function equalFilter(a: NexoyaFilterListType, b: NexoyaFilterListType): boolean {
  return a.id === b.id;
}

export interface Category {
  title: string;
  providerIds: number[];
}

export const categorizeProviders = (providers: NexoyaProvider[]): Category[] => {
  const categoriesMap: { [key: string]: number[] } = {};

  providers.forEach((provider) => {
    const categoryTitle = provider?.category || 'Other';
    if (!categoriesMap[categoryTitle]) {
      categoriesMap[categoryTitle] = [];
    }
    categoriesMap[categoryTitle].push(provider?.provider_id);
  });

  return Object.keys(categoriesMap).map((title) => ({
    title,
    providerIds: categoriesMap[title],
  }));
};

export const getCustomCategories = (integrations: NexoyaIntegration[]): Category[] => [
  {
    title: 'All categories',
    providerIds: integrations?.map((integration) => integration?.provider_id),
  },
  {
    title: 'Featured',
    providerIds: integrations
      .filter((integration) => integration?.provider?.showInToplist)
      .map((integration) => integration?.provider_id),
  },
  {
    title: 'Connected',
    providerIds: integrations
      .filter((integration) => integration?.connected)
      .map((integration) => integration?.provider_id),
  },
];
