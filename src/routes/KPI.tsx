import React, { useEffect } from 'react';
import { Match } from 'react-router-dom';
import 'react-router-dom';

import dayjs from 'dayjs';
import { get } from 'lodash';
import _orderBy from 'lodash/orderBy';
import styled from 'styled-components';

import { NexoyaCustomKpi, NexoyaCustomKpiConfigType, NexoyaMeasurement } from '../types/types';
import { $Values } from 'utility-types';

import { useGlobalDate, withDateProvider } from '../context/DateProvider';
import useKpiPredictionController from '../hooks/useKpiPredictionController';
import { useEventsQuery } from '../graphql/event/queryEvents';
import { useKpiPredictionQuery } from '../graphql/kpi/queryKpiPrediction';
import { useSelectedKpisQuery } from '../graphql/kpi/querySelectedKpis';

import usePresenterMode from '../hooks/usePresenterMode';
import { useTranslation } from '../hooks/useTranslation';
import { format } from '../utils/dates';
import { formatNumber } from '../utils/formater';
import { mergeQueryState } from '../utils/graphql';
import { kpiInput } from '../utils/kpi';
import { ChangePeriods } from 'constants/changePeriods';

import MenuList from '../components/ArrayMenuList';
import Button from '../components/Button';
import ButtonAdornment from '../components/ButtonAdornment';
import Card from '../components/Card';
import EmptyCardPlaceholder from '../components/Card/EmptyCardPlaceholder';
import CardContent from '../components/CardContent/CardContent';
import KPIsDetailChart from '../components/Charts/KPIsDetailChart';
import { useKpisToKpisDetailChart } from '../components/Charts/converters/kpisToKpiDetailChart';
import EditCustomKpiList from '../components/CustomKpi/EditCustomKpiList1';
import Divider from '../components/Divider/Divider';
import ErrorMessage from '../components/ErrorMessage';
import KPIsCompareDatesSidePanel from '../components/KPIsCompareDatesSidePanel';
import KPIsCompareSidePanel from '../components/KPIsCompareSidePanel';
import KpiReportTable from '../components/KpiReportTable/KpiReportTable';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import MainContent from '../components/MainContent';
import MenuItem from '../components/MenuItem';
import NumberValue from '../components/NumberValue';
import { PageHeader, PageHeaderActions, PageHeaderDescription, PageHeaderTitle } from '../components/PageHeader';
import Panel from '../components/Panel';
import SwitchSquare from '../components/Switch/SwitchSquare';
import Typography from '../components/Typography/Typography';
import SvgCaretDown from '../components/icons/CaretDown';
import ScrollToTop from 'components/ScrollToTop';

import { colorByKey } from '../theme/utils';

import KpiHeader from './kpi0/KpiHeader';
import NoData from './kpi0/NoData';
import NoKpiFound from './kpi0/NoKpiFound';
import CompareButton from './kpi0/chartMeasurements/CompareButton';
import PredictButton from './kpi0/chartMeasurements/PredictButton';

type Props = {
  match: Match;
};

type ChangePeriodsT = $Values<typeof ChangePeriods>;
export const LoadingWrapStyled = styled.div`
  padding: 24px;
  & > div:first-child {
    margin-bottom: 50px;
  }

  .section {
    &:nth-child(2) {
      margin-bottom: 50px;
    }

    &:nth-child(2) > div {
      height: 350px;
      opacity: 0.75;
    }

    &:nth-child(3) > div {
      height: 400px;
      opacity: 0.35;
    }
  }
`;
export const HeaderStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
export const LoadingStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 50px;

  & > div:last-child {
    flex: 1;
  }
`;
export const AvatarLoader = styled(LoadingPlaceholder)`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  margin-right: 15px;
`;
export const TitleLoader = styled(LoadingPlaceholder)`
  height: 35px;
  max-width: 650px;
  margin-bottom: 6px;
`;
export const SubtitleLoader = styled(LoadingPlaceholder)`
  height: 20px;
  width: 150px;
`;
const CardsWrapStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
  margin-bottom: 32px;

  .NEXYCard {
    height: 124px;
  }
`;
const CardContentStyled = styled(CardContent)`
  & > .NEXYTypography:first-child {
    margin-bottom: 12px;
  }
`;
const ValueChangeWrapStyled = styled.div<{
  readonly valueChangePercentage: number;
}>`
  display: flex;
  align-items: baseline;
  position: relative;

  .valueChangePercentage {
    color: ${colorByKey('cloudyBlue')};
    margin-left: 8px;

    span {
      font-weight: 600;
      letter-spacing: 0.8px;
      color: ${({ valueChangePercentage }) =>
        valueChangePercentage < 0 ? colorByKey('orangeyRed') : colorByKey('greenTeal')};
    }
  }
`;

function KPI({ match }: Props) {
  const collectionId = parseInt(match.params.collectionID, 10);
  const measurementId = parseInt(match.params.measurementID, 10);
  const { isPresenterMode } = usePresenterMode();
  // for last period related stuff
  const anchorEl = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [showLoadMore, setShowLoadMore] = React.useState<boolean>(false);
  const [changePeriod, setChangePeriod] = React.useState<ChangePeriodsT>(ChangePeriods.LAST_PERIOD);
  const { from, to, dateFrom, dateTo } = useGlobalDate();
  const { translate } = useTranslation();
  const kpiQuery = useSelectedKpisQuery({
    kpis: [
      {
        measurement_id: measurementId,
        collection_id: collectionId,
      },
    ],
    dateFrom: dateFrom(),
    dateTo: dateTo(),
    withCollectionLinks: true,
    withCollectionParent: true,
    first: 1000,
  });
  const kpiQueryForChangePeriod = useSelectedKpisQuery({
    kpis: [
      {
        measurement_id: measurementId,
        collection_id: collectionId,
      },
    ],
    dateFrom:
      changePeriod === ChangePeriods.LAST_PERIOD
        ? dateFrom()
        : format(dayjs(from).subtract(1, 'year'), 'utcStartMidnight'),
    dateTo:
      changePeriod === ChangePeriods.LAST_PERIOD ? dateTo() : format(dayjs(to).subtract(1, 'year'), 'utcEndMidnight'),
    withCollectionLinks: true,
    withCollectionParent: true,
  });
  const kpiForChange: NexoyaMeasurement = get(kpiQueryForChangePeriod, 'data.kpis[0]', {
    measurement_id: 0,
    collection: {
      collection_id: 0,
    },
  });
  const kpiForChangeValue: number = get(kpiForChange, 'detail.value', 0);
  const { data: eventsData, refetch } = useEventsQuery({
    dateFrom: dateFrom(),
    dateTo: dateTo(),
  });
  const events = get(eventsData, 'events', []);
  const kpi: NexoyaMeasurement = get(kpiQuery, 'data.kpis[0]', {
    measurement_id: 0,
    collection: {
      collection_id: 0,
    },
  });
  const customKpi: NexoyaCustomKpi = get(kpi, 'customKpiConfig', null) || null;
  const customKpiConfigType: NexoyaCustomKpiConfigType = get(customKpi, 'configType', null);
  const customKpiKpis: NexoyaMeasurement[] = get(customKpi, 'kpis', []);
  const sortedCustomKpiKpis: NexoyaMeasurement[] = React.useMemo(
    () => _orderBy(customKpiKpis, ['detail.valueSum'], ['desc']),
    [customKpiKpis],
  );
  const {
    showPredictions,
    predictionPeriod,
    tryPredictionActivation,
    showPredictionsDateChange,
    cancelShowPredictionsDateChange,
  } = useKpiPredictionController({
    to,
  });
  const predictionQuery = useKpiPredictionQuery({
    skip: !showPredictions || !kpi.measurement_id || !kpi.collection.collection_id,
    kpiInput: kpiInput(kpi),
    distance: predictionPeriod,
  });
  const { error } = mergeQueryState(kpiQuery, predictionQuery);
  const valueSumUptoEndDate = get(kpi, 'detail.valueSumUptoEndDate', null);
  const [showTotals, setShowTotals] = React.useState<boolean>(true);
  // Checking for available data here because buttons are rendered outside of chart
  // and they need to be hidden when there is no data
  const kpiData = get(kpi, 'detail.data', []);
  const isThereDataForChart = React.useMemo(() => {
    const valueToCheck = kpi.showAsTotal && showTotals ? 'valueSumUp' : 'value';
    return kpiData.some((item) => item[valueToCheck] !== null);
  }, [kpiData, kpi.showAsTotal, showTotals]);
  const valueChangePercentage = React.useMemo(() => {
    const kpiValue = get(kpi, 'detail.value', 0);
    const percentage = get(kpiForChange, 'detail.valueChangePercentage', 0);
    const changePercentage = ((kpiValue - kpiForChangeValue) / kpiForChangeValue) * 100;
    if (kpiValue === kpiForChangeValue) return percentage;
    return !kpiValue && !kpiForChangeValue
      ? 0
      : changePeriod === ChangePeriods.LAST_YEAR
        ? changePercentage
        : percentage;
  }, [changePeriod, kpi, kpiForChange, kpiForChangeValue]);
  const kpiDetailValue = get(kpi, 'detail.value', null);
  const { chartData, eventsWithTimeStamp, predictionsWithEvents } = useKpisToKpisDetailChart(
    [kpi],
    events,
    get(predictionQuery, 'data.predict', []),
    kpi.showAsTotal ? showTotals : false,
  );
  useEffect(() => setShowLoadMore(true), [customKpiKpis]);
  return (
    <ScrollToTop>
      <MainContent className="sectionToPrint">
        {kpiQuery.loading ? (
          <LoadingWrapStyled>
            <HeaderStyled>
              <LoadingStyled>
                <AvatarLoader />
                <div>
                  <TitleLoader />
                  <SubtitleLoader />
                </div>
              </LoadingStyled>
            </HeaderStyled>
            <div className="section">
              <LoadingPlaceholder />
            </div>
            <div className="section">
              <LoadingPlaceholder />
            </div>
          </LoadingWrapStyled>
        ) : !kpi ? (
          <NoKpiFound />
        ) : (
          <>
            <KpiHeader
              customKpiConfigType={customKpiConfigType}
              isCustomKpi={customKpi !== null}
              measurement={kpi} // Header doesn't need all of the measurement props.
              refetchKpi={kpiQuery.refetch}
            />
            <CardsWrapStyled>
              {kpi.showAsTotal && (
                <Card>
                  <CardContentStyled>
                    <Typography variant="h5">Total {translate(kpi.name)}</Typography>
                    <Typography component="h2" variant="h2">
                      <NumberValue value={valueSumUptoEndDate} datatype={kpi.datatype} />
                    </Typography>
                  </CardContentStyled>
                </Card>
              )}
              {kpiDetailValue === null ? (
                <EmptyCardPlaceholder />
              ) : (
                <Card data-cy="kpiPeriodCard">
                  <CardContentStyled>
                    <Typography variant="h5">{`${
                      kpi.calculation_type === 'avg' ? 'Average' : 'Change'
                    } in this period`}</Typography>
                    <ValueChangeWrapStyled valueChangePercentage={valueChangePercentage}>
                      <Typography component="h2" variant="h2">
                        <NumberValue value={get(kpi, 'detail.value', 0)} datatype={kpi.datatype} />
                      </Typography>
                      <Typography className="valueChangePercentage">
                        <span>
                          {valueChangePercentage > 0 ? '+' : null}
                          {formatNumber(valueChangePercentage, 'de-CH', {
                            maximumFractionDigits: 2,
                          })}
                          %
                        </span>{' '}
                        {changePeriod === ChangePeriods.LAST_PERIOD ? 'vs last period' : 'vs same period last year'}
                      </Typography>
                      <Button
                        onClick={() => setOpen((s) => !s)}
                        ref={anchorEl}
                        style={{
                          top: '-5px',
                        }}
                        data-cy="kpiChangePeriodBtn"
                        endAdornment={
                          <ButtonAdornment position="end">
                            <SvgCaretDown
                              style={{
                                transform: `rotate(${open ? '180' : '0'}deg)`,
                              }}
                            />
                          </ButtonAdornment>
                        }
                      />
                      <Panel
                        open={open}
                        anchorEl={anchorEl.current}
                        onClose={() => setOpen(false)}
                        placement="bottom-start"
                        style={{
                          maxHeight: 250,
                          overflowY: 'auto',
                        }}
                        popperProps={{
                          enableScheduleUpdate: true,
                          style: {
                            zIndex: 1305,
                          },
                        }}
                      >
                        <MenuList color="dark">
                          <MenuItem
                            key="change-period-last-period"
                            onClick={() => {
                              setChangePeriod(ChangePeriods.LAST_PERIOD);
                              setOpen(false);
                            }}
                          >
                            Last period
                          </MenuItem>
                          <MenuItem
                            key="change-period-last-year"
                            onClick={() => {
                              setChangePeriod(ChangePeriods.LAST_YEAR);
                              setOpen(false);
                            }}
                          >
                            Same period last year
                          </MenuItem>
                        </MenuList>
                      </Panel>
                    </ValueChangeWrapStyled>
                  </CardContentStyled>
                </Card>
              )}
            </CardsWrapStyled>
            <Divider />

            <PageHeader>
              {kpi.showAsTotal && (
                <SwitchSquare
                  style={{
                    marginTop: '5px',
                  }}
                  isOn={!showTotals}
                  toggleNotAllowed={false}
                  onToggle={() => setShowTotals(!showTotals)}
                />
              )}
              <PageHeaderActions>
                <CompareButton kpi={kpi} />
                <PredictButton
                  showPredictions={showPredictions}
                  tryPredictionActivation={tryPredictionActivation}
                  loading={predictionQuery.loading}
                  predictionPeriod={predictionPeriod}
                  isThereDataForChart={isThereDataForChart}
                />
              </PageHeaderActions>
            </PageHeader>
            {!isThereDataForChart ? (
              <NoData />
            ) : (
              <KPIsDetailChart
                data={chartData}
                predictionData={predictionsWithEvents}
                events={{
                  eventsData: eventsWithTimeStamp || [],
                  refetchEvents: refetch,
                }}
                predictionQuery={predictionQuery}
                showPredictionsDateChange={showPredictionsDateChange}
                deactivatePredictionsDateChangeOverlay={cancelShowPredictionsDateChange}
                showTotals={kpi.showAsTotal ? showTotals : false}
              />
            )}
            {customKpi ? (
              <>
                <PageHeader>
                  <div>
                    <PageHeaderTitle data-cy="customKpiTitle">
                      <Typography variant="h2" component="h3">
                        Metrics included in this custom KPI
                      </Typography>
                    </PageHeaderTitle>
                    <PageHeaderDescription data-cy="customKpiDescription">
                      <Typography variant="subtitle">Calculation: {customKpi.calc_type}</Typography>
                    </PageHeaderDescription>
                  </div>
                  <PageHeaderActions>
                    {!isPresenterMode && customKpiConfigType !== NexoyaCustomKpiConfigType.Utm && (
                      <EditCustomKpiList kpi={kpi} />
                    )}
                  </PageHeaderActions>
                </PageHeader>
                <KpiReportTable
                  kpis={sortedCustomKpiKpis}
                  from={from}
                  to={to}
                  isLoading={kpiQuery.loadingMore}
                  showLoadMore={showLoadMore}
                  showTotals={kpi.showAsTotal ? showTotals : false}
                  showCollection={true}
                  showCollectionType={true}
                  handleLoadMore={() => {
                    kpiQuery.fetchMore({
                      variables: {
                        offset: customKpiKpis.length,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        const prevData = get(prev, 'kpis[0]', {});
                        const fetchMoreDataKpis = get(fetchMoreResult, 'kpis[0].customKpiConfig.kpis', []);
                        setShowLoadMore(fetchMoreDataKpis === 10);
                        return {
                          kpis: [
                            {
                              ...prevData,
                              customKpiConfig: {
                                ...prevData.customKpiConfig,
                                kpis: [...(prevData.customKpiConfig.kpis || []), ...fetchMoreDataKpis],
                              },
                            },
                          ],
                        };
                      },
                    });
                  }}
                />
              </>
            ) : null}
          </>
        )}
      </MainContent>
      <KPIsCompareSidePanel />
      <KPIsCompareDatesSidePanel />
      {error ? <ErrorMessage error={error} /> : null}
    </ScrollToTop>
  );
}

export default withDateProvider(KPI);
