// import { type RouterHistory } from 'react-router-dom';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import queryString from 'query-string';

import { IS_ISTA_USER, SESSION_ACCESS_TOKEN, SESSION_EXPIRES_AT, SESSION_USER_EMAIL } from '../constants/localStorage';

import { ENV_VARS_WRAPPER } from '../configs/envVariables';
import { ISTA_QUERY_PARAM } from '../constants/auth';

const ISTA_EMAIL_DOMAIN = '@ista.';

export const getSessionExpirationTimestamp = (): number => {
  return parseInt(localStorage.getItem(SESSION_EXPIRES_AT), 10);
};
export const beforeFirstAuthentication = (timestamp: number): boolean => {
  return isNaN(timestamp);
};
export const getLogoutUrl = () => {
  return `${window[ENV_VARS_WRAPPER].REACT_APP_AUTH0_LOG_OUT || ''}${
    window[ENV_VARS_WRAPPER].REACT_APP_AUTH0_CLIENT_ID || ''
  }`;
};
export const getExtraAuthOptions = (history: any): Record<string, any> => {
  return {
    state: compressToEncodedURIComponent(JSON.stringify(history.location)),
  };
};
export const getOAuthState = (history: any): string | null => {
  const qs = queryString.parse(history.location.search);

  if (qs.state) {
    return decompressFromEncodedURIComponent(<string>qs.state);
  }

  return null;
};
export const decompressStateValue = (stateValueStr: any): Record<string, any> => {
  const stateValue = JSON.parse(decompressFromEncodedURIComponent(stateValueStr));
  return stateValue;
};
export const compressStateValue = (stateValue: Record<string, any>): string => {
  const stateValueStr = compressToEncodedURIComponent(JSON.stringify(stateValue));
  return stateValueStr;
};
export const removeSessionStorage = (): void => {
  localStorage.removeItem(SESSION_ACCESS_TOKEN);
  localStorage.removeItem(SESSION_EXPIRES_AT);
  localStorage.removeItem(SESSION_USER_EMAIL);
};

export const setIsIstaUser = (email: string): void => {
  if (email?.includes(ISTA_EMAIL_DOMAIN)) {
    localStorage.setItem(IS_ISTA_USER, 'true');
  }
};

/**
 * Determines if ISTA query parameters should be used based on the current state
 * of the application or user preference.
 *
 * @param queryParamType - The 't' query parameter value from the URL
 * @returns The ISTA query parameter object or null if not applicable
 */
export const getIstaQueryParams = (queryParamType?: string): { t: string } | null => {
  // Check if the current URL has the 'ista' query param or if the user was previously identified as an ISTA user
  if (queryParamType === 'ista' || localStorage.getItem(IS_ISTA_USER) === 'true') {
    return ISTA_QUERY_PARAM;
  }
  return null;
};
