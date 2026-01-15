import { get } from 'lodash';

import { NexoyaMeasurement } from '../../../types/types';
import { UIDateRange } from '../../../types/types.custom';

import { useEventsQuery } from '../../../graphql/event/queryEvents';

import usePresenterMode from '../../../hooks/usePresenterMode';

import Button from '../../../components/Button';
import ButtonAdornment from '../../../components/ButtonAdornment';
import ReportsChart from '../../../components/Charts/ReportsChart';
import { useKpisToReportChart } from '../../../components/Charts/converters/kpisToReportChart';
import ErrorBoundary from '../../../components/ErrorBoundary';
import KpiReportTable from '../../../components/KpiReportTable/KpiReportTable';
import { PageHeader, PageHeaderActions, PageHeaderTitle } from '../../../components/PageHeader';
import Typography from '../../../components/Typography';
import SvgPencil from '../../../components/icons/Pencil';

type Props = {
  kpis: NexoyaMeasurement[];
  onSelectKpis: () => void;
  dateRange: UIDateRange;
};

function ReportData({ kpis, dateRange, onSelectKpis }: Props) {
  const hasNoKpis = kpis.length === 0;
  const dateFrom = get(dateRange, 'range.dateFrom', null);
  const dateTo = get(dateRange, 'range.dateTo', null);
  const { isPresenterMode } = usePresenterMode();
  // TODO: Consider moving this one level up
  const { data: eventsData, refetch: refetchEvents } = useEventsQuery({
    dateFrom: dateRange.range.dateFrom,
    dateTo: dateRange.range.dateTo,
  });
  const events = get(eventsData, 'events', []);
  const { chartData, eventsWithTimeStamp } = useKpisToReportChart(kpis, events);
  return (
    <ErrorBoundary>
      <div>
        {hasNoKpis ? (
          <div>
            <div
              style={{
                marginBottom: 15,
              }}
            >
              <Button onClick={onSelectKpis} color="primary" variant="contained">
                Add metrics to Report
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                marginBottom: 50,
                position: 'relative',
              }}
            >
              <ErrorBoundary>
                <div id="kpiReportChart">
                  {kpis[0] ? (
                    <ReportsChart
                      data={chartData}
                      numOfKpis={kpis.length}
                      reportEvents={eventsWithTimeStamp}
                      refetchEvents={refetchEvents}
                    />
                  ) : null}
                </div>
              </ErrorBoundary>
            </div>
            <PageHeader
              style={{
                marginBottom: 20,
              }}
            >
              <PageHeaderTitle>
                <Typography variant="h2" component="h3">
                  Metrics in this report
                </Typography>
              </PageHeaderTitle>
              <PageHeaderActions
                style={{
                  marginTop: 0,
                }}
              >
                {!isPresenterMode && (
                  <Button
                    id="reportEditMetrics"
                    color="tertiary"
                    variant="contained"
                    size="small"
                    onClick={onSelectKpis}
                    startAdornment={
                      <ButtonAdornment position="start">
                        <SvgPencil />
                      </ButtonAdornment>
                    }
                  >
                    Edit metrics
                  </Button>
                )}
              </PageHeaderActions>
            </PageHeader>
            <KpiReportTable kpis={kpis} from={dateFrom} to={dateTo} showCollection={true} showLegend={true} />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default ReportData;
