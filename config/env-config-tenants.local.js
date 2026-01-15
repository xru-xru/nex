// Host-specific configurations
window.nexyTenantConfigs = {
  'nexoya': {
    REACT_APP_API_BASE_URL: 'https://portfolio-service.local.nexoya.io/graphql',
    REACT_APP_AUTH0_CLIENT_ID: 'MxlS84lqthoCDHUiDT7ScwbK8LIYbams',
    REACT_APP_AUTH0_AUDIENCE: 'PortfolioServiceAPILocal',
    REACT_APP_AUTH0_LOG_OUT:
      'https://nexoya-local.eu.auth0.com/v2/logout?returnTo=https%3A%2F%2Fwww.nexoya.com%2Flogout&client_id=',
    REACT_APP_AUTH0_DOMAIN: 'nexoya-local.eu.auth0.com',
  },
  'gettune': {
    REACT_APP_API_BASE_URL: 'https://portfolio-service.local.nexoya.io/graphql',
    REACT_APP_AUTH0_CLIENT_ID: 'MxlS84lqthoCDHUiDT7ScwbK8LIYbams',
    REACT_APP_AUTH0_AUDIENCE: 'GetTuneAPILocal',
    REACT_APP_AUTH0_LOG_OUT:
      'https://gettune-local.eu.auth0.com/v2/logout?returnTo=https%3A%2F%2Fwww.nexoya.com%2Flogout&client_id=',
    REACT_APP_AUTH0_DOMAIN: 'gettune-local.eu.auth0.com',
  }
};
