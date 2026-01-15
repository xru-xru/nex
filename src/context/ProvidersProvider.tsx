import React from 'react';

import { get } from 'lodash';

import { NexoyaProvider } from '../types/types';

import { useProvidersQuery } from '../graphql/provider/queryProviders';

import { emptyArr } from '../utils/array';

type ProvidersState = {
  activeProviders: NexoyaProvider[];
  providersMap: Map<number, NexoyaProvider>;
};
const ProvidersContext = React.createContext<any>(null);

function ProvidersProvider(props: any) {
  const [state, setState] = React.useState<ProvidersState>({
    activeProviders: [
      {
        provider_id: 26,
        name: '{provider.customimport}',
        logo: 'https://cdn.nexoya.io/img/00_provider_customimport.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: false,
        connected: true,
      },
      {
        provider_id: 100,
        name: '{provider.customkpi}',
        logo: 'https://cdn.nexoya.io/img/00_provider_customkpi-icon.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: false,
        connected: true,
      },
      {
        provider_id: 12,
        name: '{provider.facebook}',
        logo: 'https://cdn.nexoya.io/img/00_provider_meta-icon.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: true,
        connected: true,
      },
      {
        provider_id: 24,
        name: '{provider.google.ads}',
        logo: 'https://cdn.nexoya.io/img/00_provider_google_ads-icon.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: true,
        connected: true,
      },
      {
        provider_id: 2,
        name: '{provider.google.analytics}',
        logo: 'https://cdn.nexoya.io/img/00_provider_google_analytics-icon.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: false,
        connected: false,
      },
      {
        provider_id: 23,
        name: '{provider.google.searchconsole}',
        logo: 'https://cdn.nexoya.io/img/00_provider_google-search-console.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: false,
        connected: true,
      },
      {
        provider_id: 32,
        name: '{provider.googledcm}',
        logo: 'https://cdn.nexoya.io/img/00_provider_googledcm.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: true,
        connected: true,
      },
      {
        provider_id: 34,
        name: '{provider.googledv360}',
        logo: 'https://cdn.nexoya.io/img/00_provider_googledv360.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: true,
        connected: true,
      },
      {
        provider_id: 22,
        name: '{provider.instagramV2}',
        logo: 'https://cdn.nexoya.io/img/00_provider_instagram-icon.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: false,
        connected: false,
      },
      {
        provider_id: 13,
        name: '{provider.linkedin}',
        logo: 'https://cdn.nexoya.io/img/00_provider_linkedin-icon.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: true,
        connected: false,
      },
      {
        provider_id: 29,
        name: '{provider.weatherstack}',
        logo: 'https://cdn.nexoya.io/img/00_provider_weather.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: false,
        connected: true,
      },
      {
        provider_id: 21,
        name: '{provider.youtube}',
        logo: 'https://cdn.nexoya.io/img/00_provider_youtube-icon.svg',
        hasCollections: true,
        isPortfolioPrimaryChannel: true,
        connected: false,
      },
    ],
    providersMap: new Map(),
  });
  const { data, loading, error, refetch } = useProvidersQuery();
  const providers = get(data, 'providers', []);
  React.useEffect(() => {
    if (!loading && !emptyArr(providers)) {
      setState({
        activeProviders: providers.filter((p) => p.hasCollections),
        providersMap: new Map(providers.map((p) => [p.provider_id, p])),
      });
    }
  }, [providers, setState, loading]);

  if (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  const values = React.useMemo(
    () => ({
      state,
      setState,
      refetch,
    }),
    [state, setState, refetch],
  );
  return <ProvidersContext.Provider value={values} {...props} />;
}

function useProviders() {
  const context = React.useContext(ProvidersContext);

  if (context === undefined) {
    throw new Error(`useProviders must be used within ProvidersProvider`);
  }

  const { state, refetch } = context;
  const providerById = React.useCallback(
    (providerId: number): NexoyaProvider | {} => {
      const provider = state.providersMap.get(providerId);

      if (!provider) {
        // eslint-disable-next-line no-console
        console.warn(`useProviders: we could not find such provider (providerId:${providerId})`);
        return {};
      }

      return provider;
    },
    [state],
  );
  return { ...state, providerById, refetch };
}

export { ProvidersProvider, useProviders };
