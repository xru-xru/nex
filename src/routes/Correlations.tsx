import React from 'react';

import calculateCorrelation from 'calculate-correlation';
import { get } from 'lodash';
import styled from 'styled-components';
import { ArrayParam, useQueryParams } from 'use-query-params';

import { NexoyaMeasurement } from '../types/types';
import { CorrelationChartData } from '../types/types.custom';

import { useSelectedKpisQuery } from '../graphql/kpi/querySelectedKpis';

import { useTranslation } from '../hooks/useTranslation';
import { difference, union } from '../utils/array';
import { buildKpiKey } from '../utils/buildReactKeys';
import { distanceRange, format } from '../utils/dates';
import { decodeKpisQuery, encodeKpi } from '../utils/kpi';

import Button from '../components/Button';
import ButtonAdornment from '../components/ButtonAdornment';
import kpisToCorrelationChart from '../components/Charts/KpisCorrelationChart';
import { CHARTS_CONFIG } from '../components/Charts/config/ChartsConfig';
import CorrelationMetric from '../components/CorrelationMetric';
import ErrorMessage from '../components/ErrorMessage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import MainContent from '../components/MainContent';
import { PageHeader, PageHeaderActions, PageHeaderDescription, PageHeaderTitle } from '../components/PageHeader';
import Text from '../components/Text';
import Typography from '../components/Typography';
import PlusRegular from '../components/icons/PlusRegular';
import ScrollToTop from 'components/ScrollToTop';

import { colorByKey } from '../theme/utils';

import KPIRefCard from './kpisCompare/KPIRefCard';
import SidePanelKpis from './kpisCompare/SidePanelKpis';

const KpisWrapStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: ${colorByKey('paleGrey50')};
  padding: 16px 50px 0;
  margin-left: -50px;
  margin-right: -50px;
  margin-bottom: 32px;
`;
const PreselectedKpisOverflowWrapperStyled = styled.div`
  display: flex;
  overflow-x: auto;
  position: relative;
`;
const ButtonWrapperStyled = styled.div`
  min-width: 150px;
  .NEXYButton {
    padding: 11px 16px;
    height: 50px;
  }
  .NEXYButtonAdornment {
    margin-right: 16px;
  }
`;
const LoadingWrapStyled = styled.div`
  display: flex;
  & > div {
    width: 30%;
    height: 60px;
    margin-right: 30px;
    margin-bottom: 30px;
  }
`;
const InfoTextStyled = styled.div`
  display: flex;
  align-chartdata: center;
`;
const ChartWrapperStyled = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr minmax(50%, 60%);
`;

function getChartData(kpis: NexoyaMeasurement[], translate: (arg0: string) => string): CorrelationChartData[] {
  let k = 0; // to unify row names

  return kpis.reduce((acc, curr, i) => {
    // insert one dummy metric for labels row
    acc.push({
      metric: '',
      order: i + 1,
      value: '',
    });
    const matrix_1 = [];
    kpis[i].detail.data.map((item) => {
      matrix_1.push(item ? item.value : 0);
      return item;
    });

    for (let l = 0; l <= i; l++) {
      const matrix_2 = [];
      kpis[l].detail.data.map((item) => {
        matrix_2.push(item ? item.value : 0);
        return item;
      });
      acc.push({
        metric: k.toString() + translate(curr.name || ''),
        order: l + 1,
        value: l === i ? null : calculateCorrelation(matrix_1, matrix_2) || 0,
      });
    }

    k++;
    return acc;
  }, []);
}

function Correlations() {
  const chartRef = React.useRef({
    init: () => {},
  });
  const [showPicker, setShowPicker] = React.useState(false);
  const { translate } = useTranslation();
  const [queryParams, setQueryParams] = useQueryParams({
    kpi: ArrayParam,
  });
  const { dateFrom, dateTo } = distanceRange({
    distance: 31,
    startOf: 'day',
    endOf: false,
  });
  const selectedKpisQuery = queryParams.kpi || [];
  const kpisInput = decodeKpisQuery(selectedKpisQuery);
  const skip = get(selectedKpisQuery, 'length', 0) === 0;
  const { data, error, loading } = useSelectedKpisQuery({
    skip,
    kpis: kpisInput,
    dateFrom,
    dateTo,
  });
  const kpis = get(data, 'kpis', []);
  const chartData = React.useMemo(() => getChartData(kpis, translate), [kpis, translate]);

  function togglePicker() {
    setShowPicker((state) => !state);
  }

  function addItem(kpi: NexoyaMeasurement) {
    return () => {
      const nextKpisQuery = union(selectedKpisQuery, [encodeKpi(kpi)]);
      setQueryParams({
        kpi: nextKpisQuery,
      });
    };
  }

  function removeItem(kpi: NexoyaMeasurement) {
    return () => {
      const nextKpisQuery = difference(selectedKpisQuery, [encodeKpi(kpi)]);
      setQueryParams({
        kpi: nextKpisQuery,
      });
    };
  }

  React.useEffect(() => {
    chartRef.current = kpisToCorrelationChart({
      dimension: kpis.length,
      chartData,
    });
    chartRef.current!.init();
  }, [kpis.length, chartData]);
  return (
    <ScrollToTop>
      <MainContent>
        <PageHeader>
          <div>
            <PageHeaderTitle>
              <Typography variant="h1" component="h2" data-cy="pageTitle">
                Correlations
              </Typography>
            </PageHeaderTitle>
            <PageHeaderDescription>
              <Typography variant="subtitle" data-cy="pageSubtitle">
                A place to discover interesting relations between metrics and KPI’s.
              </Typography>
            </PageHeaderDescription>
          </div>
          <PageHeaderActions></PageHeaderActions>
        </PageHeader>
        {loading ? (
          <LoadingWrapStyled>
            <LoadingPlaceholder />
            <LoadingPlaceholder />
            <LoadingPlaceholder />
          </LoadingWrapStyled>
        ) : (
          <>
            <KpisWrapStyled>
              <PreselectedKpisOverflowWrapperStyled>
                {kpis.length !== 0 ? (
                  <ButtonWrapperStyled>
                    <Button
                      variant="contained"
                      color="tertiary"
                      size="small"
                      onClick={togglePicker}
                      data-cy="addMetricBtn"
                      startAdornment={
                        <ButtonAdornment>
                          <PlusRegular />
                        </ButtonAdornment>
                      }
                    >
                      Add metric
                    </Button>
                  </ButtonWrapperStyled>
                ) : null}
                {kpis.map((m, i) => (
                  <KPIRefCard onKpiRemove={removeItem} key={buildKpiKey(m, 'kpi-card')} kpi={m} index={i} />
                ))}
                {kpis.length === 0 && !loading ? (
                  <InfoTextStyled data-cy="noMetricsSpecified">
                    <Text>You have not specified metrics to compare.</Text>
                  </InfoTextStyled>
                ) : null}
              </PreselectedKpisOverflowWrapperStyled>
            </KpisWrapStyled>
          </>
        )}
        {kpis.length === 0 && !loading ? (
          <Button
            id="selectMetrics"
            variant="contained"
            color="tertiary"
            size="small"
            style={{
              height: 250,
              width: '100%',
            }}
            onClick={togglePicker}
            startAdornment={
              <ButtonAdornment>
                <PlusRegular />
              </ButtonAdornment>
            }
          >
            Select metrics to compare
          </Button>
        ) : (
          <ChartWrapperStyled>
            <div data-cy="correlationsChart">
              <CorrelationMetric
                index={0}
                kpi={kpis[0]}
                dummy={true}
                itemHeight={CHARTS_CONFIG.CORRELATION_CELL_SIZE}
              />
              {kpis.map((kpi, i) => (
                <CorrelationMetric
                  key={buildKpiKey(kpi, 'kpi-correlation')}
                  index={i + 1}
                  itemHeight={CHARTS_CONFIG.CORRELATION_CELL_SIZE}
                  kpi={kpi}
                  dateFrom={format(dateFrom) as any}
                  dateTo={format(dateTo) as any}
                />
              ))}
            </div>
            <div id={CHARTS_CONFIG.CORRELATION_CONTAINER_ID} />
          </ChartWrapperStyled>
        )}
        {error && <ErrorMessage error={error} />}
        <SidePanelKpis
          open={showPicker}
          selectedKpis={kpis}
          onClose={togglePicker}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />
      </MainContent>
    </ScrollToTop>
  );
}

export default Correlations;
