import React from 'react';
import { NexoyaProvider } from '../../src/types';
import { ProvidersProvider } from '../../src/context/ProvidersProvider';

const mockUseProviders = () => ({
  activeProviders: [
    {
      provider_id: 24,
      name: '{provider.google.ads}',
      logo: 'https://cdn.nexoya.io/img/00_provider_google_ads-icon.svg',
      hasCollections: true,
      isPortfolioPrimaryChannel: true,
      __typename: 'Provider',
      connected: false,
    },
  ],
  // @ts-ignore
  providersMap: new Map<number, NexoyaProvider>([
    [
      24,
      {
        provider_id: 24,
        name: '{provider.google.ads}',
        logo: 'https://cdn.nexoya.io/img/00_provider_google_ads-icon.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: true,
        __typename: 'Provider',
        connected: false,
      },
    ],
  ]),
  providerById: (providerId: number) => {
    if (providerId === 24) {
      return {
        provider_id: 24,
        name: '{provider.google.ads}',
        logo: 'https://cdn.nexoya.io/img/00_provider_google_ads-icon.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: true,
        __typename: 'Provider',
        connected: false,
      };
    }
    return {};
  },
});

// MockProvidersProvider to inject the mock data
export const MockProvidersProvider = ({ children }: { children: React.ReactNode }) => {
  // Override the useProviders hook with the mock implementation
  // @ts-ignore
  ProvidersProvider.useProviders = mockUseProviders;

  return <ProvidersProvider>{children}</ProvidersProvider>;
};
