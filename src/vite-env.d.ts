/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly REACT_APP_API_BASE_URL: string;
  readonly REACT_APP_AUTH0_DOMAIN: string;
  readonly REACT_APP_AUTH0_CLIENT_ID: string;
  readonly REACT_APP_AUTH0_AUDIENCE: string;
  readonly REACT_APP_AUTH0_LOG_OUT: string;
  readonly REACT_APP_AMCHARTS_KEY: string;
  readonly REACT_APP_DATADOG_APP_ID: string;
  readonly REACT_APP_DATADOG_CLIENT_TOKEN: string;
  readonly REACT_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
