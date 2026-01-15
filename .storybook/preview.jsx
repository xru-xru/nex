import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider } from 'styled-components';

import GlobalStyle from '../src/theme/global';
import theme from '../src/theme/theme';

import nexyTheme from '../src/theme';
import { labelsQueryMock, teamQueryMock, translationQueryMock } from './mocks/graphql.mocks';

import { MockTeamProvider } from './mocks/useTeam.mocks';
import { MockPortfolioProvider } from './mocks/usePortfolio.mocks';
import { MockLabelsProvider } from './mocks/useLabels.mocks';
import '../src/global.css';
import { SidebarProvider } from '../src/context/SidebarProvider';
import { ImpactGroupsProvider } from '../src/context/ImpactGroupsProvider';
import { MockProvidersProvider } from './mocks/useProviders.mocks';
import { UnsavedChangesProvider } from '../src/context/UnsavedChangesProvider';
import { OptimizationBudgetProvider } from '../src/context/OptimizationBudget';
import { ApolloClient, ApolloProvider, from, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  link: from([]),
  cache: new InMemoryCache(),
});

// Configure the decorators for Storybook
export const mock_decorators = (queryMocks = [], routeConfig = true) => [
  (Story) => {
    const storyWithProviders = (
      <ApolloProvider client={client}>
        <MockedProvider
          mocks={[translationQueryMock, labelsQueryMock, teamQueryMock, ...queryMocks]}
          addTypename={false}
        >
          <MockTeamProvider>
            <ThemeProvider theme={{ ...theme, ...nexyTheme }}>
              <MockPortfolioProvider>
                <MockProvidersProvider>
                  <OptimizationBudgetProvider>
                    <MockLabelsProvider>
                      <ImpactGroupsProvider>
                        <UnsavedChangesProvider>
                          <SidebarProvider>
                            <GlobalStyle />
                            <Story />
                          </SidebarProvider>
                        </UnsavedChangesProvider>
                      </ImpactGroupsProvider>
                    </MockLabelsProvider>
                  </OptimizationBudgetProvider>
                </MockProvidersProvider>
              </MockPortfolioProvider>
            </ThemeProvider>
          </MockTeamProvider>
        </MockedProvider>
      </ApolloProvider>
    );

    if (routeConfig === true) {
      return (
        <MemoryRouter initialEntries={['/portfolio/1']}>
          <Route path="/portfolio/:portfolioID">{storyWithProviders}</Route>
        </MemoryRouter>
      );
    }

    if (routeConfig && typeof routeConfig === 'object') {
      return (
        <MemoryRouter initialEntries={[routeConfig.initialEntry]}>
          <Route path={routeConfig.path}>{storyWithProviders}</Route>
        </MemoryRouter>
      );
    }

    return <BrowserRouter>{storyWithProviders}</BrowserRouter>;
  },
];

// Configure Storybook parameters
export const parameters = {
  apolloClient: {
    MockedProvider,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
