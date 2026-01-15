import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';

import useDateController from '../../controllers/DateController';
import { useDashboardKpisQuery } from '../../graphql/kpi/queryDashboardKpis';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import { buildKpiKey } from '../../utils/buildReactKeys';

import Button from '../../components/Button';
import { DateSelector } from '../../components/DateSelector';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import ErrorMessage from '../../components/ErrorMessage';
import KpiCard from '../../components/KpiCard';
import LoadingPlaceholder from '../../components/LoadingPlaceholder';
import { PageHeader, PageHeaderActions, PageHeaderTitle } from '../../components/PageHeader';
import Typography from '../../components/Typography';

import { PATHS } from '../paths';

const LoadingWrapStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 24px;
  margin-bottom: 48px;

  & > div {
    min-height: 200px;

    &:nth-child(1) {
      opacity: 1;
    }
    &:nth-child(2) {
      opacity: 0.75;
    }
    &:nth-child(3) {
      opacity: 0.45;
    }
    &:nth-child(4) {
      opacity: 0.25;
    }
  }
`;
const DateWrapStyled = styled.div`
  margin-bottom: 20px;

  .selection-drop {
    left: auto;
    transform: inherit;
    top: auto;
  }
`;
const GridWrapStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 24px;
`;

const DashboardKpis = () => {
  const { from, to, startDate, endDate, handleDateChange } = useDateController();
  const { data, error, loading } = useDashboardKpisQuery({
    dateFrom: startDate,
    dateTo: endDate,
  });
  const kpis: NexoyaMeasurement[] = get(data, 'team.kpis', []);
  return (
    <>
      <PageHeader
        style={{
          alignItems: 'baseline',
        }}
      >
        <PageHeaderTitle>
          <Typography variant="h2" component="h3">
            KPIs
          </Typography>
          <Button
            to={PATHS.APP.KPIS}
            variant="text"
            size="small"
            style={{
              marginLeft: '20px',
            }}
            data-cy="viewAllKpiDashboardBtn"
          >
            View all
          </Button>
        </PageHeaderTitle>
        <PageHeaderActions
          style={{
            marginTop: 0,
          }}
        >
          <DateWrapStyled>
            <DateSelector
              dateFrom={from}
              dateTo={to}
              onDateChange={({ from, to }) => {
                track(EVENT.DASHBOARD_CHANGE_METRIC_DATE_RANGE);
                handleDateChange({
                  from,
                  to,
                });
              }}
              hideFutureQuickSelection
              panelProps={{
                side: 'bottom',
                align: 'start',
              }}
              data-cy="kpiDateSelectorDashboardBtn"
            />
          </DateWrapStyled>
        </PageHeaderActions>
      </PageHeader>
      <div style={{ marginBottom: 25 }}>
        <ErrorBoundary>
          {loading ? (
            <LoadingWrapStyled>
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
            </LoadingWrapStyled>
          ) : error ? (
            <ErrorMessage error={error} />
          ) : kpis.length === 0 ? (
            <div
              style={{
                minHeight: 282,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button to={PATHS.APP.HOME_KPI_PICKER} color="primary" variant="contained" data-cy="addKpiDashboardBtn">
                Add KPIs
              </Button>
            </div>
          ) : (
            <div>
              <GridWrapStyled data-cy="dashboardKpiDiv">
                {kpis.map((kpi) => (
                  <KpiCard key={buildKpiKey(kpi)} kpi={kpi} startDate={startDate} endDate={endDate} />
                ))}
              </GridWrapStyled>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </>
  );
};

export default DashboardKpis;
