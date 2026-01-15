import { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import DateProvider from './context/DateProvider';
import { KpisSelectionProvider } from './context/KpisSelectionProvider';
import { PortfoliosFilterProvider } from './context/PortfoliosFilterProvider';

import PrivateApp from './routes/PrivateApp';
import PrivateWizard from './routes/PrivateWizard';
import { Onboarding } from './routes/onboard/Onboarding';
import { OnboardingRedirect } from './routes/onboard/OnboardingRedirect';
import { PATHS } from './routes/paths';

const Portfolio = lazy(() => import('./routes/Portfolio'));
const Portfolios = lazy(() => import('./routes/Portfolios'));
const Attributions = lazy(() => import('./routes/Attributions'));
const AttributionRunDetails = lazy(() => import('./routes/AttributionRunDetails'));
const OnboardingGuide = lazy(() => import('./routes/OnboardingGuide'));
const Correlations = lazy(() => import('./routes/Correlations'));
const Content = lazy(() => import('./routes/Content'));
const DashboardSelection = lazy(() => import('./routes/DashboardSelection'));
const KPI = lazy(() => import('./routes/KPI'));
const KPIs = lazy(() => import('./routes/KPIs'));
const KPIsCompareRedirect = lazy(() => import('./routes/KPIsCompareRedirect'));
const Reports = lazy(() => import('./routes/Reports'));
const Report = lazy(() => import('./routes/Report'));
const Settings = lazy(() => import('./routes/Settings'));
const TabletDemo = lazy(() => import('./routes/Cockpit'));
const Oauth = lazy(() => import('./routes/Oauth'));
const Unauthorized = lazy(() => import('./Auth/Unauthorized'));

const Routes = () => (
  <Switch>
    <Route path={PATHS.AUTH.SIGN_UP} component={OnboardingRedirect} />
    <Route
      path={PATHS.WIZARD.ONBOARD}
      render={(props) => (
        <PrivateWizard {...props}>
          <Suspense fallback={<div />}>
            <Switch>
              <Route exact path={PATHS.WIZARD.ONBOARD} component={Onboarding} />
              <Route
                exact
                path={PATHS.WIZARD.ONBOARD_INVITE}
                component={() => <Redirect to={PATHS.WIZARD.ONBOARD} />}
              />
              <Route render={() => <div>Nothing matches in the onboard</div>} />
            </Switch>
          </Suspense>
        </PrivateWizard>
      )}
    />

    <Route path={PATHS.OAUTH.HOME} component={Oauth} />

    <Route
      path={PATHS.APP.TABLET_DEMO}
      render={() => (
        <Suspense fallback={<div />}>
          <DateProvider>
            <TabletDemo />
          </DateProvider>
        </Suspense>
      )}
    />

    <Route
      path={PATHS.APP.HOME}
      render={(props) => (
        <PrivateApp {...props}>
          <Suspense fallback={<div />}>
            <Switch>
              <Route exact path={PATHS.APP.HOME} component={OnboardingRedirect} />
              <Route exact path={PATHS.APP.ONBOARD_GUIDE} component={OnboardingGuide} />
              <Route exact path={PATHS.APP.HOME_KPI_PICKER} component={DashboardSelection} />
              <Route
                path={PATHS.APP.KPIS}
                render={() => (
                  <KpisSelectionProvider>
                    <Switch>
                      <Route exact path={PATHS.APP.KPIS} component={KPIs} />
                      <Route path={PATHS.APP.KPI} component={KPI} />
                      <Route path={PATHS.APP.KPIS_COMPARE} component={KPIsCompareRedirect} />
                    </Switch>
                  </KpisSelectionProvider>
                )}
              />
              <Route path={PATHS.APP.CORRELATIONS} component={Correlations} />
              <Route
                path={PATHS.APP.PORTFOLIOS}
                render={() => (
                  <>
                    <PortfoliosFilterProvider>
                      <Suspense fallback={<div />}>
                        <Switch>
                          <Route exact path={PATHS.APP.PORTFOLIOS} component={Portfolios} />
                          <Route exact path={PATHS.APP.PORTFOLIO} component={Portfolio} />
                        </Switch>
                      </Suspense>
                    </PortfoliosFilterProvider>
                  </>
                )}
              />
              <Route
                path={PATHS.APP.ATTRIBUTIONS}
                render={() => (
                  <>
                    <PortfoliosFilterProvider>
                      <Suspense fallback={<div />}>
                        <Switch>
                          <Route exact path={PATHS.APP.ATTRIBUTIONS} component={Attributions} />
                          <Route exact path={PATHS.APP.ATTRIBUTION} component={AttributionRunDetails} />
                        </Switch>
                      </Suspense>
                    </PortfoliosFilterProvider>
                  </>
                )}
              />
              <Route
                path={PATHS.APP.REPORTS}
                render={() => (
                  <>
                    <Suspense fallback={<div />}>
                      <Switch>
                        <Route exact path={PATHS.APP.REPORTS} component={Reports} />
                        <Route exact path={PATHS.APP.REPORT} component={Report} />
                      </Switch>
                    </Suspense>
                  </>
                )}
              />
              <Route path={PATHS.APP.SETTINGS} component={Settings} />
              <Route path={PATHS.APP.CONTENT} component={Content} />
              <Redirect to={PATHS.APP.HOME} />
            </Switch>
          </Suspense>
        </PrivateApp>
      )}
    />
    <Route path={PATHS.AUTH.UNAUTHORIZED} component={Unauthorized} />
  </Switch>
);

export default Routes;
