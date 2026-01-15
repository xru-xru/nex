import { datadogRum } from '@datadog/browser-rum';

import { ENV_VARS_WRAPPER } from '../configs/envVariables';
import isProduction from '../utils/isProduction';

export const initDatadogRUM = () => {
  datadogRum.init({
    applicationId: window[ENV_VARS_WRAPPER].REACT_APP_DATADOG_APP_ID,
    clientToken: window[ENV_VARS_WRAPPER].REACT_APP_DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.eu',
    service: 'nexoya-webapp',
    env: isProduction() ? 'prod' : 'development',
    version: window[ENV_VARS_WRAPPER].REACT_APP_VERSION,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackFrustrations: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'allow',
    beforeSend: (event, context) => {
      if ((event.type === 'view' && event.view.url.includes('callback')) || event.view.name === '/') {
        event.view.name = '/portfolios';
      }

      if (event.type === 'view' && event.view.url.includes('/portfolios/')) {
        const urlParams = new URLSearchParams(new URL(window.location.href).search);
        const activeTab = urlParams.get('activeTab') || 'performance';
        const activeSettingsTab = urlParams.get('activeSettingsTab') || '';

        if (activeTab === 'settings') {
          event.view.name = activeSettingsTab;
        } else {
          event.view.name = activeTab;
        }

        // Dynamically add all query parameters as global context
        const queryParamsContext: Record<string, string> = {};
        urlParams.forEach((value, key) => {
          queryParamsContext[key] = value;
        });

        datadogRum.setGlobalContext(queryParamsContext);
      }
      // Custom handling for GraphQL requests
      // @ts-ignore
      if (event.type === 'resource' && event.resource.url.includes('/graphql') && context?.requestInit) {
        // @ts-ignore
        const requestBody = JSON.parse(context?.requestInit?.body);
        const operationName = requestBody.operationName || 'unknown_operation';
        event.resource.url = `Graphql - ${operationName}`;
      }
    },
  });
  datadogRum.startSessionReplayRecording();
};

export const trackPortfolioView = (tab: string, subtab?: string) => {
  const viewName = subtab ? subtab : tab;
  // This declares a new, separate view to Datadog
  datadogRum.startView(viewName);
};

export const track = (actionName: string, context?: any) => datadogRum.addAction(actionName, context);
