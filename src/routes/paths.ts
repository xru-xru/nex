import { get } from 'lodash';

import { NexoyaMeasurement } from '../types/types';
import { KpiInput } from '../types/types.custom';

import { stringifyQueryParams } from '../utils/queryParams';

const COLLECTION_KEY = ':collectionID';
const MEASUREMENT_KEY = ':measurementID';
const PORTFOLIO_KEY = ':portfolioID';
const ATTRIBUTION_KEY = ':attributionID';
const REPORT_KEY = ':reportID';
const FUNNEL_KEY = ':funnelID';
const CONTENT_KEY = ':contentID';

export const EXTERNAL_GOOGLE_ADS_MANAGEMENT_URL =
  'https://app.adhook.io/auth.html?t=66c453d826fed821fa8f6811&prompt=none';

export const PATHS = {
  AUTH: {
    SIGN_UP: '/signup',
    LOGIN: '/login',
    CALLBACK: '/callback',
    UNAUTHORIZED: '/unauthorized',
  },
  WIZARD: {
    ONBOARD: '/onboard',
    ONBOARD_NAME: '/onboard/name',
    ONBOARD_INVITE: '/onboard/invite',
  },
  APP: {
    HOME: '/',
    HOME_KPI_PICKER: '/dashboard/selection',
    ONBOARD_GUIDE: '/guide',
    FUNNELS: '/funnels',
    FUNNEL: `/funnels/${FUNNEL_KEY}`,
    KPIS: '/kpis',
    KPIS_COMPARE: '/kpis/compare',
    KPIS_COMPARE_DATES: '/kpis/comparedates',
    KPI: `/kpis/${COLLECTION_KEY}/${MEASUREMENT_KEY}`,
    CORRELATIONS: '/correlations',
    NOTIFICATIONS: '/notifications',
    PORTFOLIOS: `/portfolios`,
    PORTFOLIO: `/portfolios/${PORTFOLIO_KEY}`,
    ATTRIBUTIONS: `/attributions`,
    ATTRIBUTION: `/attributions/${ATTRIBUTION_KEY}`,
    REPORTS: '/reports',
    REPORT_NEW: '/reports/new',
    REPORT: `/reports/${REPORT_KEY}`,
    SETTINGS: '/settings',
    SETTINGS_INTEGRATIONS: '/settings?tab=integrations',
    // TODO: This is temporary
    TABLET_DEMO: '/cockpit',
    CONTENT: `/content/${CONTENT_KEY}`,
  },
  OAUTH: {
    HOME: '/oauth',
    ERROR: `/oauth/error`,
    GOOGLE: '/oauth/google',
    GA4: '/oauth/ga4',
    GOOGLE_ADS: '/oauth/googleads',
    FACEBOOK: '/oauth/facebook',
    LINKEDIN: '/oauth/linkedin',
    SEARCHCONSOLE: '/oauth/searchconsole',
    TWITTER: '/oauth/twitterV2',
    WEATHER: '/oauth/weatherstack',
    EXCHANGERATESAPI: '/oauth/exchangeratesapi',
    MAILCHIMP: '/oauth/mailchimp',
    MANDRILL: '/oauth/mandrill',
    YOUTUBE: '/oauth/youtube',
    HUBSPOT: '/oauth/hubspot',
    GOTOWEBINAR: '/oauth/gotowebinar',
    GOOGLE_DCM: '/oauth/googledcm',
    SALESFORCESALESCLOUD: '/oauth/salesforcesalescloud',
    GOOGLE_DV360: '/oauth/googledv360',
    GOOGLE_SA360: '/oauth/googlesa360',
    BING: '/oauth/bing',
    PINTEREST: '/oauth/pinterest',
    TABOOLA: '/oauth/taboola',
    MEDIAMATH: '/oauth/mediamath',
    TIKTOK: '/oauth/tiktokV1',
    CRITEO: '/oauth/criteo',
    XADS: '/oauth/xAds',
    REDDIT: '/oauth/reddit',
  },
  WEBSITE: {
    CONTACT: 'https://www.nexoya.com/contact/',
  },
};
// TODO: Storing these params need to be rethought and rewritten
export const PARAMS = {
  PORTFOLIOS_FILTER: {
    key: 'filter',
    values: {
      ACTIVE: 'active',
      COMPLETED: 'completed',
      PLANNED: 'planned',
    },
  },
  PORTFOLIOS_ORDER: {
    key: 'order',
    values: {
      ASC: 'ASC',
      DESC: 'DESC',
    },
  },
};
// used to build the path for a KPI. We are also including the query params
// in the url if necessary.
export function buildKpiPath(kpi: NexoyaMeasurement | KpiInput, params: Record<string, any>) {
  const mId = get(kpi, 'measurement_id', 0).toString();
  const cId = get(kpi, 'collection_id', null) || get(kpi, 'collection.collection_id', 0);

  if (!mId || !cId) {
    console.warn('Link cannot be created as there is no measurement_id and no collection_id');
    return '';
  }

  return `${PATHS.APP.KPI.replace(COLLECTION_KEY, cId).replace(MEASUREMENT_KEY, mId)}?${stringifyQueryParams(params)}`;
}

// COMMENT: We use "number" for args because we store the IDs in the DB as numbers.
export const buildPortfolioPath = (portfolioId: number): string => {
  return PATHS.APP.PORTFOLIO.replace(PORTFOLIO_KEY, portfolioId.toString());
};

// Comment: We use "number" for args because we store the IDs in the DB as numbers.
export function buildReportPath(reportId: number): string {
  return PATHS.APP.REPORT.replace(REPORT_KEY, reportId.toString());
}
export function buildContentPath(contentId: number, params: Record<string, unknown> = {}, skip?: boolean) {
  return `${PATHS.APP.CONTENT.replace(CONTENT_KEY, contentId?.toString())}?${stringifyQueryParams(params, skip)}`;
}
