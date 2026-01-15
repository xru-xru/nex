import React, { useEffect } from 'react';
import { Route, Router } from 'react-router-dom';

import { ApolloProvider as ApolloHooksProvider, ApolloProvider, useLazyQuery } from '@apollo/client';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'styled-components';
import { QueryParamProvider } from 'use-query-params';

import InitProvider, { InitContext, InitCtx } from './context/InitProvider';
import { ProvidersProvider } from './context/ProvidersProvider';
import TeamProvider from './context/TeamProvider';
import { OptimizationBudgetProvider } from 'context/OptimizationBudget';

import { initDatadogRUM } from './constants/datadog';
import useInitialQuery from './hooks/useInitialQuery';

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import PageLoading from './components/PageLoading';
import Callback from './routes/Callback';
import { PATHS } from './routes/paths';

import GlobalStyles from './theme/global';
import theme, { TOAST_OPTIONS } from './theme/theme';

import Unauthorized from './Auth/Unauthorized';
import Routes from './Routes';
import client from './apollo';
import './global.css';
import history from './historyUtil';
import nexyTheme, { nexyColors } from './theme';
import Authenticate from './routes/Authenticate';
import { SidebarProvider } from './context/SidebarProvider';
import isProduction from './utils/isProduction';
import { ENV_VARS_WRAPPER } from './configs/envVariables';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SvgCheckCircle from './components/icons/CheckCircle';
import SvgError from './components/icons/Error';
import { HeaderProvider } from './context/HeaderProvider';
import { UnsavedChangesProvider } from './context/UnsavedChangesProvider';
import SvgWarningTwo from './components/icons/WarningTwo';
import { TRANSLATIONS_QUERY } from './graphql/translation/queryTranslations';
import useTranslationStore from './store/translations';
import useUserStore from './store/user';

const UNAUTHORIZED_HTTP_CODE = '401';

const AppInner = () => {
  const { initializing, loggedIn } = React.useContext<InitCtx>(InitContext);
  const { error } = useInitialQuery(loggedIn);
  const { setTranslations, setError } = useTranslationStore();
  const { user } = useUserStore();

  const [loadTranslations] = useLazyQuery(TRANSLATIONS_QUERY, {
    variables: { lang: 'en_us' },
    onCompleted: ({ translations }) => setTranslations(translations),
    onError: (error) => setError(error.message),
  });

  if (error) {
    if (error?.message?.includes(UNAUTHORIZED_HTTP_CODE)) {
      return <Unauthorized />;
    }
    // @ts-ignore
    throw new Error(error);
  }

  useEffect(() => {
    if (loggedIn && user) {
      loadTranslations();
    }
  }, [loggedIn, user, loadTranslations]);

  return (
    <QueryParamProvider ReactRouterRoute={Route}>
      <Toaster
        closeButton
        position="top-right"
        icons={{
          warning: (
            <SvgWarningTwo
              warningCircleColor="#FCF1BA"
              warningColor="#F5CF0F"
              style={{ height: 24, width: 24, marginRight: 6 }}
            />
          ),
          info: <SvgCheckCircle style={{ color: nexyColors.neutral400 }} />,
          success: <SvgCheckCircle style={{ color: nexyColors.greenTeal }} />,
          error: <SvgError style={{ width: 24, height: 24, color: nexyColors.red400 }} />,
        }}
        toastOptions={TOAST_OPTIONS}
      />
      <Route component={Authenticate} />
      <Route exact path={PATHS.AUTH.CALLBACK} component={Callback} />
      <React.Suspense fallback={<PageLoading />}>{initializing ? <PageLoading /> : <Routes />}</React.Suspense>
    </QueryParamProvider>
  );
};

const App = () => {
  useEffect(() => {
    // React app version is only set when deploy_prod is run, hence it won't be available in staging/acceptance
    if (isProduction() && window[ENV_VARS_WRAPPER] && window[ENV_VARS_WRAPPER].REACT_APP_VERSION !== 'SETME') {
      initDatadogRUM();
    }
  }, []);
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <Router history={history}>
            <ThemeProvider theme={{ ...theme, ...nexyTheme }}>
              <InitProvider>
                <TeamProvider>
                  <ProvidersProvider>
                    <OptimizationBudgetProvider>
                      <SidebarProvider>
                        <UnsavedChangesProvider>
                          <HeaderProvider>
                            <ErrorBoundary>
                              <DndProvider backend={HTML5Backend}>
                                <GlobalStyles />
                                <AppInner />
                              </DndProvider>
                            </ErrorBoundary>
                          </HeaderProvider>
                        </UnsavedChangesProvider>
                      </SidebarProvider>
                    </OptimizationBudgetProvider>
                  </ProvidersProvider>
                </TeamProvider>
              </InitProvider>
            </ThemeProvider>
          </Router>
        </ApolloHooksProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}; // COMMENT: Wrapper for production only user tracking

export default App;
