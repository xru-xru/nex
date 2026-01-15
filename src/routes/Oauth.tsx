import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PATHS } from './paths';

const OauthError = React.lazy(() => import('./oauth/OauthError'));
const OauthProviderFilters = React.lazy(() => import('./oauth/OauthProviderFilters'));
const NotFound = React.lazy(() => import('./oauth/NotFound'));

const Oauth = function Oauth() {
  return (
    <Switch>
      <Route path={PATHS.OAUTH.ERROR} component={OauthError} />
      <Route path={PATHS.OAUTH.GOOGLE} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.GA4} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.GOOGLE_ADS} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.FACEBOOK} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.LINKEDIN} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.SEARCHCONSOLE} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.TWITTER} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.WEATHER} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.EXCHANGERATESAPI} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.MAILCHIMP} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.MANDRILL} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.YOUTUBE} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.HUBSPOT} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.GOTOWEBINAR} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.GOOGLE_DCM} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.SALESFORCESALESCLOUD} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.GOOGLE_DV360} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.GOOGLE_SA360} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.BING} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.PINTEREST} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.TABOOLA} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.MEDIAMATH} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.TIKTOK} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.CRITEO} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.XADS} component={OauthProviderFilters} />
      <Route path={PATHS.OAUTH.REDDIT} component={OauthProviderFilters} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Oauth;
