import React from 'react';
import { RouterHistory, withRouter } from 'react-router-dom';

import dayjs from 'dayjs';
import { get } from 'lodash';
import { DateParam } from 'serialize-query-params';
import styled from 'styled-components';
import { ArrayParam, useQueryParams } from 'use-query-params';

import { NexoyaMeasurement } from '../types/types';

import { useSelectedKpisQuery } from '../graphql/kpi/querySelectedKpis';

import usePresenterMode from '../hooks/usePresenterMode';
import { difference, union } from '../utils/array';
import { buildKpiKey } from '../utils/buildReactKeys';
import { distanceRange, djsAnchors, format, isSame } from '../utils/dates';
import { decodeKpisQuery, encodeKpi } from '../utils/kpi';

import Button from '../components/Button';
import ButtonAdornment from '../components/ButtonAdornment';
import KPIsCompareChart from '../components/Charts/KPIsCompareChart';
import { useKpisToCompareConverter } from '../components/Charts/converters/kpisToCompare';
import { DateSelector } from '../components/DateSelector';
import { useDialogState } from '../components/Dialog';
import ErrorMessage from '../components/ErrorMessage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import SidePanel from '../components/SidePanel';
import Text from '../components/Text';
import Typography from '../components/Typography';
import PlusRegular from '../components/icons/PlusRegular';
import SectionHeader from '../components/layout/SectionHeader/SectionHeader';

import { colorByKey } from '../theme/utils';

import CreateKpisReport from './kpisCompare/CreateKpisReport';
import KPIRefCard from './kpisCompare/KPIRefCard';
import SidePanelKpis from './kpisCompare/SidePanelKpis';

type Props = {
  history: RouterHistory;
  skipQuery: boolean;
};
const WrapStyled = styled.div`
  padding: 24px;
`;
const KpisWrapStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: ${colorByKey('paleGrey50')};
  padding: 24px 12px 0 24px;
  margin-left: -24px;
  margin-right: -24px;
  margin-bottom: 32px;
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
const ButtonWrapperStyled = styled.div`
  height: 51px;
  .NEXYButton {
    padding: 11px 16px;
    height: 100%;
  }
  .NEXYButtonAdornment {
    margin-right: 16px;
  }
  margin-right: 12px;
  margin-bottom: 24px;
`;
const PreselectedKpisOverflowWrapperStyled = styled.div`
  display: flex;
  overflow-x: auto;
  position: relative;
`;
type State = {
  dateFrom: Date;
  dateTo: Date;
};

function KPIsCompare({ history, skipQuery }: Props) {
  const [showPicker, setShowPicker] = React.useState(false);
  const { isOpen, openDialog, closeDialog } = useDialogState({
    initialState: false,
  });
  const { isPresenterMode } = usePresenterMode();
  const { dateFrom: dateFromDR, dateTo: dateToDR } = distanceRange({
    distance: 7,
    startOf: 'day',
    endOf: false,
  });
  const [queryParams, setQueryParams] = useQueryParams({
    kpi: ArrayParam,
    dateFromCompare: DateParam,
    dateToCompare: DateParam,
  });
  const [dates, setDates] = React.useState<State>({
    dateFrom: queryParams.dateFromCompare || dateFromDR,
    dateTo: queryParams.dateToCompare || dateToDR,
  });

  function handleDateChange({ from, to }) {
    setDates((s) => ({ ...s, dateFrom: from, dateTo: to }));
    setQueryParams({
      dateFromCompare: from,
      dateToCompare: to,
    });
  }

  const selectedKpisQuery = queryParams.kpi || [];
  const kpisInput = decodeKpisQuery(selectedKpisQuery);
  const skip = get(selectedKpisQuery, 'length', 0) === 0 || skipQuery;
  const { data, error, loading, notFound } = useSelectedKpisQuery({
    skip,
    kpis: kpisInput,
    dateFrom: format(dates.dateFrom, 'utcStartMidnight'),
    dateTo: isSame(dates.dateTo, djsAnchors.today)
      ? format(new Date(), 'utcInterval')
      : format(dayjs(dates.dateTo), 'utcEndMidnight'),
  });

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

  const kpis = get(data, 'kpis', []);
  const chartData = useKpisToCompareConverter(kpis);
  const numberOfKpis = kpis.length;
  return (
    <WrapStyled>
      <SectionHeader>
        <SectionHeader.Left>
          <Typography variant="h2" data-cy="sectionTitle">
            Comparing metrics
          </Typography>
        </SectionHeader.Left>
        <SectionHeader.Right>
          {!isPresenterMode && (
            <Button data-cy="saveAsReportBtn" variant="contained" color="primary" onClick={openDialog}>
              Save as report
            </Button>
          )}
        </SectionHeader.Right>
      </SectionHeader>
      <>
        {loading ? (
          <LoadingWrapStyled>
            <LoadingPlaceholder />
            <LoadingPlaceholder />
            <LoadingPlaceholder />
          </LoadingWrapStyled>
        ) : (
          <>
            <KpisWrapStyled data-cy="metricsSection">
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
                {kpis.length === 0 ? (
                  <div
                    style={{
                      height: 60,
                      marginBottom: '30',
                    }}
                  >
                    <Text>You have not specified KPIs to compare.</Text>
                    <Text variant="caption" display="flex">
                      NOTE: At the moment, we only allow comparing the same date range of different KPIs.
                    </Text>
                  </div>
                ) : null}
              </PreselectedKpisOverflowWrapperStyled>
            </KpisWrapStyled>
            {!(notFound || skip) && (
              <DateSelector
                dateFrom={dates.dateFrom}
                dateTo={dates.dateTo}
                hideFutureQuickSelection
                onDateChange={handleDateChange}
                panelProps={{
                  side: 'bottom',
                  align: 'start',
                }}
                style={{
                  margin: '0 0 32px 0',
                }}
                data-cy="kpiDateSelectorBtn"
              />
            )}
          </>
        )}
        {!loading && (notFound || skip) ? (
          <Button
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
          <>{numberOfKpis !== 0 ? <KPIsCompareChart data={chartData} handleDateChange={handleDateChange} /> : null}</>
        )}
      </>
      <SidePanelKpis
        open={showPicker}
        selectedKpis={kpis}
        onClose={togglePicker}
        onAddItem={addItem}
        onRemoveItem={removeItem}
      />
      <SidePanel
        isOpen={isOpen}
        onClose={closeDialog}
        paperProps={{
          style: {
            minWidth: 695,
          },
        }}
      >
        <CreateKpisReport
          history={history}
          onClose={closeDialog}
          selectedKpis={kpisInput}
          dateFrom={dates.dateFrom}
          dateTo={dates.dateTo}
        />
      </SidePanel>
      {error ? <ErrorMessage error={error} /> : null}
    </WrapStyled>
  );
}

export default withRouter(KPIsCompare);
