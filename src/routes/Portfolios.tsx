import React, { useMemo } from 'react';

import dayjs from 'dayjs';

import { NexoyaPortfolioDashboardElement, NexoyaPortfolioDashboardNotification } from 'types/types';

import { withPortfolioProvider } from '../context/PortfolioProvider';
import { usePortfoliosFilter } from '../context/PortfoliosFilterProvider';
import { usePortfolioDashboardQuery } from '../graphql/portfolio/queryPortfolioDashboard';

import { FEATURE_FLAGS } from '../constants/featureFlags';
import { useQueryParamDateRange } from '../hooks/useQueryParamDateRange';
import { distanceRange, djsAnchors } from 'utils/dates';

import DashboardContentChart from '../components/Charts/DashboardContentChart';
import DashboardNotifications from '../components/Dashboard/components/DashboardNotifications';
import DashboardPortfoliosHeader from '../components/Dashboard/components/DashboardPortfoliosHeader';
import DashboardPortfoliosRow from '../components/Dashboard/components/DashboardPortfoliosRow';
import { DateSelector } from '../components/DateSelector';
import ErrorBoundary from '../components/ErrorBoundary';
import FeatureSwitch from '../components/FeatureSwitch';
import MainContent from '../components/MainContent';
import { PageHeader, PageHeaderActions, PageHeaderTitle } from '../components/PageHeader';
import Typography from '../components/Typography';
import SvgGauge from '../components/icons/Gauge';
import { Tabs, TabsContent, TabsNav } from 'components/Tabs';

import * as Styles from './portfolios/styles/Portfolios';

import { portfoliosTabs } from '../configs/portfolio';
import { BrickLoader, BrickLoaderWrapper } from './Portfolio';
import NoDataFound from './portfolio/NoDataFound';
import CreatePortfolio from './portfolios/CreatePortfolio';
import Portfolios2Filter from './portfolios/PortfoliosFilter';

const allowedTabs = [portfoliosTabs.ACTIVE, portfoliosTabs.COMPLETED] as const;

function Portfolios2() {
  const [activeTab, setActiveTab] = React.useState<(typeof allowedTabs)[number]>();
  const { search } = usePortfoliosFilter();

  const range = distanceRange({
    distance: 30,
    anchor: djsAnchors.yesterday,
    type: 'day',
  });
  const { dateFrom, dateTo, setDates } = useQueryParamDateRange(range, {
    dateFrom: 'from',
    dateTo: 'to',
  });
  const setDatesMapped = ({ from, to }: { from: Date; to: Date }) => setDates({ dateFrom: from, dateTo: to });
  const dateFromStr = useMemo(
    () =>
      dayjs
        .utc(dateFrom || range.dateFrom)
        .format('YYYY-MM-DD')
        .substring(0, 10),
    [dateFrom, range],
  );
  const dateToStr = useMemo(
    () =>
      dayjs
        .utc(dateTo || range.dateTo)
        .format('YYYY-MM-DD')
        .substring(0, 10),
    [dateTo, range],
  );

  const { loading, data: dashboardPortfolioData } = usePortfolioDashboardQuery({
    dateFrom: dateFromStr,
    dateTo: dateToStr,
    completed: activeTab === portfoliosTabs.COMPLETED,
    search: search.value || null,
  });

  const notifications: NexoyaPortfolioDashboardNotification[] =
    dashboardPortfolioData?.portfolioDashboard?.notifications || [];
  const elements: NexoyaPortfolioDashboardElement[] = dashboardPortfolioData?.portfolioDashboard?.elements || [];

  const renderLoadingSkeleton = () => (
    <BrickLoaderWrapper style={{ flexDirection: 'column' }}>
      <BrickLoader style={{ width: '100%', height: 84, padding: '4px 19px 4px 15px' }} />
      <BrickLoader style={{ width: '100%', height: 84, padding: '4px 19px 4px 15px' }} />
      <BrickLoader style={{ width: '100%', height: 84, padding: '4px 19px 4px 15px' }} />
      <BrickLoader style={{ width: '100%', height: 84, padding: '4px 19px 4px 15px' }} />
    </BrickLoaderWrapper>
  );

  return (
    <MainContent className="sectionToPrint">
      <PageHeader>
        <PageHeaderTitle>
          <Typography variant="h1" component="h2">
            Portfolios
          </Typography>
        </PageHeaderTitle>
        <PageHeaderActions>
          <CreatePortfolio />
        </PageHeaderActions>
      </PageHeader>
      <ErrorBoundary>
        <FeatureSwitch
          features={[FEATURE_FLAGS.DASHBOARD_NEW_DISABLED]}
          renderNew={() => (
            <div style={{ display: 'flex', marginBottom: 32 }}>
              {elements?.length ? (
                <>
                  <DashboardContentChart loading={loading} data={elements} />
                  <DashboardNotifications loading={loading} notifications={notifications} />
                </>
              ) : (
                <NoDataFound
                  icon={<SvgGauge />}
                  title="Portfolio graphs are coming as soon as we receive the data"
                  subtitle="Your graphs will be displayed as soon as there's data available."
                />
              )}
            </div>
          )}
          renderOld={() => null}
        />

        <Tabs defaultTab={activeTab || portfoliosTabs.ACTIVE} controlledTab={activeTab || portfoliosTabs.ACTIVE}>
          <Styles.TabsNavWrapperStyled>
            <div>
              <TabsNav
                tab={portfoliosTabs.ACTIVE}
                component={Styles.NavTabStyled}
                onClick={() => {
                  setActiveTab(portfoliosTabs.ACTIVE);
                }}
              >
                Active
              </TabsNav>
              <TabsNav
                tab={portfoliosTabs.COMPLETED}
                component={Styles.NavTabStyled}
                onClick={() => setActiveTab(portfoliosTabs.COMPLETED)}
              >
                Completed
              </TabsNav>
            </div>
            <DateSelector
              dateFrom={dateFrom || range.dateFrom}
              dateTo={dateTo || range.dateTo}
              onDateChange={setDatesMapped}
              hideFutureQuickSelection
              useNexoyaDateRanges={true}
            />
          </Styles.TabsNavWrapperStyled>
          <Portfolios2Filter />
          <TabsContent tab={portfoliosTabs.ACTIVE}>
            <DashboardPortfoliosHeader />
            {loading ? (
              renderLoadingSkeleton()
            ) : (
              <>
                {elements.map((portfolio, i) => (
                  <DashboardPortfoliosRow key={i} data={portfolio} counter={i} />
                ))}
              </>
            )}
          </TabsContent>
          <TabsContent tab={portfoliosTabs.COMPLETED}>
            <DashboardPortfoliosHeader />
            {loading ? (
              renderLoadingSkeleton()
            ) : (
              <>
                {elements.map((portfolio, i) => (
                  <DashboardPortfoliosRow key={i} data={portfolio} counter={i} />
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
    </MainContent>
  );
}

export default withPortfolioProvider(Portfolios2);
