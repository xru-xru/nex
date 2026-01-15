import { Location } from 'react-router-dom';

import auth0 from 'auth0-js';
import jwt_decode from 'jwt-decode';

import { Auth0ParsedHash } from '../types/types.custom';
import '../types/types.custom';

import { SESSION_ACCESS_TOKEN, SESSION_EXPIRES_AT, SESSION_USER_EMAIL } from '../constants/localStorage';
import { BASE_WINDOW_URL } from '../constants/window';

import { ENV_VARS_WRAPPER } from '../configs/envVariables';
import history from '../historyUtil';
import {
  beforeFirstAuthentication,
  compressStateValue,
  decompressStateValue,
  getExtraAuthOptions,
  getOAuthState,
  getSessionExpirationTimestamp,
  removeSessionStorage,
  setIsIstaUser,
} from './utils';

const AUTH_REDIRECT_STATE_KEY = 'auth_redirect_state';

class Auth {
  constructor() {
    this.scheduleRenewal();
  }

  tokenRenewalTimeout = null;
  redirectState: Location | null = null;
  expiresAt: string | null = null;
  auth0 = new auth0.WebAuth({
    domain: window[ENV_VARS_WRAPPER]?.REACT_APP_AUTH0_DOMAIN || '',
    clientID: window[ENV_VARS_WRAPPER]?.REACT_APP_AUTH0_CLIENT_ID || '',
    redirectUri: `${BASE_WINDOW_URL}/callback`,
    audience: window[ENV_VARS_WRAPPER]?.REACT_APP_AUTH0_AUDIENCE || 'CoreGraphQLAPIdev',
    responseType: 'token id_token', // Include 'id_token' for nonce handling
    scope: 'openid email profile',
  });
  buildAuthorizeUrl = () => this.auth0.client.buildAuthorizeUrl({});
  login = ({ signup = false, customQueryParams = null }) => {
    removeSessionStorage();

    if (signup) {
      this.auth0.authorize({
        ...getExtraAuthOptions(history),
        screen_hint: 'signup',
        page: 'signup',
        responseType: 'token id_token',
        ...customQueryParams,
      });
    } else {
      const stateUnparsed = getOAuthState(history);
      this.saveRedirectState(history.location); // Save the current location

      if (stateUnparsed) {
        const state = JSON.parse(stateUnparsed);
        // reuse the state which we got initally
        const authorizeOptions: auth0.AuthorizeOptions = {
          state: compressStateValue({
            redirectLocation: state.redirectLocation,
          }),
        };

        if (state.oauth2) {
          authorizeOptions.clientID = state.oauth2.client_id;
          authorizeOptions.connection = state.oauth2.connection;
          authorizeOptions.scope = state.oauth2.scope;
          authorizeOptions.prompt = 'login';
        }
        authorizeOptions.authorizationParams = { customParam: 'foo' };

        this.auth0.authorize({ ...authorizeOptions, ...customQueryParams });
      } else {
        // otherwise setup a new state with current location and params (history)
        this.auth0.authorize({
          ...getExtraAuthOptions(history),
          ...customQueryParams,
        });
      }
    }
  };
  handleAuthentication = (callback): void => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.setSession(authResult);
        callback();
      } else if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        this.logout();
      }
    });
  };
  setSession = (authResult: Auth0ParsedHash): void => {
    const decodedToken = jwt_decode(authResult.accessToken);
    const expiresAt = (authResult.expiresIn * 1000 + Date.now()).toString();
    const email = decodedToken['http://nexoya.io/email'];
    localStorage.setItem(SESSION_ACCESS_TOKEN, authResult.accessToken);
    localStorage.setItem(SESSION_EXPIRES_AT, expiresAt);
    this.expiresAt = expiresAt;
    localStorage.setItem(SESSION_USER_EMAIL, email);
    setIsIstaUser(email);
    this.redirectState = null;

    // TODO: There is a chance the JSON.parse will throw an error
    // let's wrap it in try catch and make sure the rest
    // of the UI wont' get affected
    try {
      const state = decompressStateValue(authResult.state);
      if (state?.redirectLocation) window.location = state.redirectLocation;
      if (state.pathname || state.search) this.redirectState = state;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Exception while parsing state: ${JSON.stringify(authResult.state || 'null')}`);
      // eslint-disable-next-line no-console
      console.warn(`Exception while parsing state e: ${e}`);
    }

    this.scheduleRenewal();
  };
  getUserProfile = (cb?: any): void => {
    this.auth0.client.userInfo(auth.getAccessToken(), (err, profile) => {
      if (cb) {
        cb(err, profile);
        return;
      }

      // eslint-disable-next-line no-console
      console.warn('You did not provide callback for auth0 profile');
    });
  };
  getAccessToken = (): string => {
    return localStorage.getItem(SESSION_ACCESS_TOKEN) || '';
  };
  getExpiresAt = (): string | null | void => {
    return this.expiresAt || localStorage.getItem(SESSION_EXPIRES_AT);
  };
  logout = (): void => {
    if (this.tokenRenewalTimeout) {
      clearTimeout(this.tokenRenewalTimeout);
    }

    removeSessionStorage();

    // Perform logout with the configured options
    this.auth0.logout({
      clientID: window[ENV_VARS_WRAPPER]?.REACT_APP_AUTH0_CLIENT_ID || '',
    });
  };
  isAuthenticated = (): boolean => {
    return Date.now() < getSessionExpirationTimestamp();
  };
  saveRedirectState = (state: Location) => {
    localStorage.setItem(AUTH_REDIRECT_STATE_KEY, JSON.stringify(state));
  };
  getAndClearRedirectState = (): Location | null => {
    const state = localStorage.getItem(AUTH_REDIRECT_STATE_KEY);
    localStorage.removeItem(AUTH_REDIRECT_STATE_KEY);
    return state ? JSON.parse(state) : null;
  };
  renewToken = (): void => {
    this.auth0.checkSession(
      {
        ...getExtraAuthOptions(history),
        redirectUri: `${BASE_WINDOW_URL}/callback`,
      },
      (err, result) => {
        if (result && result.accessToken) {
          this.setSession(result);
        } else if (err) {
          // eslint-disable-next-line no-console
          console.log(err);
          this.logout();
        }
      },
    );
  };
  scheduleRenewal = (): void => {
    const delay = getSessionExpirationTimestamp() - Date.now();

    // The user has not been authenticated in this browser yet. Wait until we
    // Auth0.authorize the user for the first time before we schedule renewal
    if (beforeFirstAuthentication(delay)) {
      return;
    }

    // The user most likely refreshed the browser.
    // We have expiration timestamp, so let's schedule renewal
    if (delay > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewToken();
      }, delay);
      return;
    }

    // The expiration timestamp has expired. Let's renew the token.
    this.renewToken();
  };
}

const auth = new Auth();
export default auth;
