import React, { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { StringParam } from 'serialize-query-params';
import styled from 'styled-components';
import { BooleanParam, NumberParam, useQueryParam, useQueryParams } from 'use-query-params';

import { NexoyaFunnelStepType, NexoyaPortfolioEventEdge } from '../../types';

import { usePortfolio } from 'context/PortfolioProvider';
import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

import PortfolioPerformanceChart from '../../components/Charts/PortfolioPerformanceChart';
import { usePortfolioToPerformanceChartData } from '../../components/Charts/converters/portfolioToPerformanceChartData';
import { DateSelectorProps } from '../../components/DateSelector';
import MultipleSwitch from '../../components/MultipleSwitchFluid';
import { MultiSeriesFunnel } from './components/Funnel/MultiSeriesFunnel';
import { PerformanceHeader } from './components/PerformanceChartHeader';
import PortfolioChartLegend from './components/PortfolioChartLegend';
import PortfolioCostPerChart from 'components/Charts/PortfolioCostPerChart';
import NoData from '../kpi0/NoData';
import { PerformanceTable } from '../../components/PerformanceTable/PerformanceTable';
import { usePerformanceFunnelStepQuery } from '../../graphql/performance/queryPerformanceFunnelStep';
import LoadingPlaceholder from '../../components/LoadingPlaceholder';
import { orderBy } from 'lodash';
import { PortfolioRoasChart } from '../../components/Charts/PortfolioRoasChart';
import { useLabels } from '../../context/LabelsProvider';
import { useImpactGroups } from '../../context/ImpactGroupsProvider';
import { PORTFOLIO_EVENTS_QUERY } from '../../graphql/portfolioEvents/queryPortfolioEvents';
import usePortfolioEventsStore from '../../store/portfolio-events';
import { useLazyQuery } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { useOptimizationStore } from '../../store/optimization';
import { Skeleton } from '../../components-ui/Skeleton';
import { usePortfolioV2ContentMetricsQuery } from 'graphql/performance/queryContentMetrics';
import { usePerformanceTotalsQuery } from '../../graphql/performance/queryPerformanceTotals';
import { useAttributionPerformanceQuery } from '../../graphql/performance/queryAttributionPerformance';
import { useAttributionPerformanceStore } from '../../store/attribution-performance';

type Props = {
  portfolioId: number;
  dateSelectorProps: DateSelectorProps;
  comparisonDateSelectorProps: DateSelectorProps;
  oldPortfolio?: any;
};

const PerformanceContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

type PerformanceSwitchType = 'overview' | 'metrics';
const PERFORMANCE_SWITCH_SECTIONS = [
  {
    id: 'overview',
    text: 'Overview',
  },
];

export function Performance({ portfolioId, dateSelectorProps, comparisonDateSelectorProps }: Props) {
  const [switchSections, setSwitchSections] = useState<{ id: string; text: string }[]>([]);
  const [activeSwitch, setActiveSwitch] = useState<PerformanceSwitchType>('overview');
  const [isMounted, setIsMounted] = useState(false);
  const [dateComparisonActive = false] = useQueryParam('dateComparisonActive', BooleanParam);

  const [queryParams, setQueryParams] = useQueryParams({
    fs: NumberParam,
    chart: StringParam,
    dateFrom: StringParam,
    dateTo: StringParam,
    compareFrom: StringParam,
    compareTo: StringParam,
  });

  const { teamId } = useTeam();
  const {
    selectedFunnelStep: { selectedFunnelStep },
    portfolioV2Info: {
      meta: { data: portfolioMeta },
      funnelSteps: { updateState },
    },
    providers: { handleResetProvideFilterState, providersFilter },
    performanceChart: { showEvents },
  } = usePortfolio();

  const {
    filter: { handleResetLabelFilterState, labelsFilter },
  } = useLabels();

  const {
    filter: { handleResetImpactGroupFilterState, impactGroupsFilter },
  } = useImpactGroups();

  const { setPortfolioEvents, setLoading } = usePortfolioEventsStore();
  const { optimizations, setOptimizations } = useOptimizationStore();
  const { setAttributionPerformanceData } = useAttributionPerformanceStore();

  const [loadPortfolioEvents] = useLazyQuery(PORTFOLIO_EVENTS_QUERY);

  const {
    data: multiSeriesFunnelData,
    loading: multiSeriesFunnelLoading,
    error: multiSeriesFunnelError,
  } = usePerformanceTotalsQuery({
    funnelStepId: selectedFunnelStep?.funnel_step_id ?? null,
    period: {
      start: dayjs(dateSelectorProps.dateFrom).utc().format(GLOBAL_DATE_FORMAT),
      end: dayjs(dateSelectorProps.dateTo).utc().format(GLOBAL_DATE_FORMAT),
    },
    comparisonPeriod:
      dateComparisonActive &&
      comparisonDateSelectorProps.dateFrom &&
      comparisonDateSelectorProps.dateTo &&
      dayjs(comparisonDateSelectorProps.dateFrom).isValid() &&
      dayjs(comparisonDateSelectorProps.dateTo).isValid()
        ? {
            start: dayjs(comparisonDateSelectorProps.dateFrom).utc().format(GLOBAL_DATE_FORMAT),
            end: dayjs(comparisonDateSelectorProps.dateTo).utc().format(GLOBAL_DATE_FORMAT),
          }
        : undefined,
    portfolioId,
  });

  const { loading: attributionPerformanceLoading } = useAttributionPerformanceQuery({
    portfolioId,
    funnelStepId: selectedFunnelStep?.funnel_step_id ?? null,
    isAttributed: portfolioMeta?.isAttributed,
    period: {
      start: dayjs(dateSelectorProps.dateFrom).utc().format(GLOBAL_DATE_FORMAT),
      end: dayjs(dateSelectorProps.dateTo).utc().format(GLOBAL_DATE_FORMAT),
    },
    onCompleted: (data) => {
      setAttributionPerformanceData(data?.portfolioV2?.attributionPerformance);
    },
  });

  const funnelSteps = useMemo(
    () => multiSeriesFunnelData?.portfolioV2?.performance?.funnelSteps,
    [multiSeriesFunnelData],
  );

  const { data: chartFunnelStepData, loading: chartFunnelStepLoading } = usePerformanceFunnelStepQuery({
    withProviders: !labelsFilter?.length && !impactGroupsFilter?.length,
    withLabels: labelsFilter?.length > 0 && !impactGroupsFilter?.length && !providersFilter?.length,
    withImpactGroups: impactGroupsFilter?.length > 0 && !labelsFilter?.length && !providersFilter?.length,
    withComparison: dateComparisonActive,
    funnelStepId: selectedFunnelStep?.funnel_step_id ?? -1,
    period: {
      start: dayjs(dateSelectorProps.dateFrom).utc().format(GLOBAL_DATE_FORMAT),
      end: dayjs(dateSelectorProps.dateTo).utc().format(GLOBAL_DATE_FORMAT),
    },
    comparisonPeriod:
      dateComparisonActive &&
      comparisonDateSelectorProps.dateFrom &&
      comparisonDateSelectorProps.dateTo &&
      dayjs(comparisonDateSelectorProps.dateFrom).isValid() &&
      dayjs(comparisonDateSelectorProps.dateTo).isValid()
        ? {
            start: dayjs(comparisonDateSelectorProps.dateFrom).utc().format(GLOBAL_DATE_FORMAT),
            end: dayjs(comparisonDateSelectorProps.dateTo).utc().format(GLOBAL_DATE_FORMAT),
          }
        : undefined,
    portfolioId,
  });

  const { data: tableFunnelStepsData, loading: tableFunnelStepsLoading } = usePortfolioV2ContentMetricsQuery({
    period: {
      start: dayjs(dateSelectorProps.dateFrom).utc().format(GLOBAL_DATE_FORMAT),
      end: dayjs(dateSelectorProps.dateTo).utc().format(GLOBAL_DATE_FORMAT),
    },
    comparisonPeriod:
      dateComparisonActive &&
      comparisonDateSelectorProps.dateFrom &&
      comparisonDateSelectorProps.dateTo &&
      dayjs(comparisonDateSelectorProps.dateFrom).isValid() &&
      dayjs(comparisonDateSelectorProps.dateTo).isValid()
        ? {
            start: dayjs(comparisonDateSelectorProps.dateFrom).utc().format(GLOBAL_DATE_FORMAT),
            end: dayjs(comparisonDateSelectorProps.dateTo).utc().format(GLOBAL_DATE_FORMAT),
          }
        : undefined,
    portfolioId,
  });

  const [activeChart, setActiveChart] = useState(queryParams.chart || 'performance');
  const isCostSelected = selectedFunnelStep?.type === NexoyaFunnelStepType.Cost;

  const isActivePortfolio = dayjs().isBefore(dayjs(portfolioMeta?.end));
  const portfolioDashboardUrls =
    portfolioMeta?.portfolioDashboardUrls?.filter((dashboardUrl) => dashboardUrl?.name && dashboardUrl?.url) || [];

  const hasLabels = funnelSteps?.[0]?.metricTotals?.labels?.some((w) => w.labelId);
  const hasMultipleImpactGroups = funnelSteps?.[0]?.metricTotals.impactGroups?.length > 1;

  const performanceFunnelStep = chartFunnelStepData?.portfolioV2?.performance?.funnelStep;

  const {
    realizedMetricDataPast,
    comparisonPerformanceChartData,
    dataForChart: performanceChartData,
  } = usePortfolioToPerformanceChartData({
    isActivePortfolio,
    loading: chartFunnelStepLoading,
    dailyMetrics: performanceFunnelStep?.dailyMetrics,
    optimizationMetricTotals: performanceFunnelStep?.optimizationMetricTotals,
    dailyOptimizationMetrics: performanceFunnelStep?.dailyOptimizationMetrics,
  });

  useEffect(() => {
    if (showEvents && portfolioId && queryParams?.dateFrom && queryParams?.dateTo) {
      setLoading(true);
      loadPortfolioEvents({
        fetchPolicy: 'network-only',
        variables: {
          teamId,
          portfolioId,
          start: dayjs(dateSelectorProps.dateFrom).utc().format(GLOBAL_DATE_FORMAT),
          end: dayjs(dateSelectorProps.dateTo).utc().format(GLOBAL_DATE_FORMAT),
          first: 100,
        },
      }).then(({ data }) => {
        setPortfolioEvents(
          orderBy(
            data?.portfolioV2?.portfolioEvents?.edges?.map((event: NexoyaPortfolioEventEdge) => event.node),
            'start',
            'asc',
          ),
        );
        setLoading(false);
      });
    }
  }, [showEvents, portfolioId, queryParams?.dateFrom, queryParams?.dateTo]);

  useEffect(() => {
    updateState({
      data: multiSeriesFunnelData?.portfolioV2?.performance?.funnelSteps,
      loading: multiSeriesFunnelLoading,
      error: multiSeriesFunnelError,
    });
    setOptimizations(multiSeriesFunnelData?.portfolioV2?.performance?.optimizations);
  }, [multiSeriesFunnelData, multiSeriesFunnelLoading, multiSeriesFunnelError, portfolioId]);

  useEffect(() => {
    setTimeout(() => setIsMounted(true));
  }, []);

  useEffect(() => {
    if (portfolioDashboardUrls?.length) {
      setSwitchSections([
        ...PERFORMANCE_SWITCH_SECTIONS,
        ...portfolioDashboardUrls.map((portfolioDashboardUrl) => ({
          id: portfolioDashboardUrl.name,
          text: portfolioDashboardUrl.name,
        })),
      ]);
    }
  }, [portfolioMeta]);

  useEffect(() => {
    if (selectedFunnelStep?.type !== NexoyaFunnelStepType.ConversionValue && activeChart === 'roas') {
      handleChangeActiveChart('performance');
    }
  }, [selectedFunnelStep?.type]);

  useEffect(() => {
    if (selectedFunnelStep?.funnel_step_id) {
      setQueryParams({ fs: selectedFunnelStep?.funnel_step_id });
    }
  }, [selectedFunnelStep]);

  useEffect(() => {
    setActiveChart(queryParams.chart || 'performance');
  }, [queryParams.chart]);

  useEffect(() => {
    // Reset all filters when portfolioId changes
    handleResetProvideFilterState();
    handleResetLabelFilterState();
    handleResetImpactGroupFilterState();
  }, [portfolioId]);

  function handleChangeActiveChart(chart: 'performance' | 'cost-per' | 'roas') {
    setQueryParams({
      chart,
    });
    setActiveChart(chart);
  }

  const renderChartBasedOnActiveSwitch = (activeChart: string) => {
    switch (activeChart) {
      case 'performance':
        return (
          <PortfolioPerformanceChart
            data={dateComparisonActive ? comparisonPerformanceChartData : performanceChartData}
            portfolioId={portfolioId}
            portfolioTitle={portfolioMeta?.title}
            optimizations={optimizations || []}
          />
        );
      case 'cost-per':
        return <PortfolioCostPerChart dailyMetrics={performanceFunnelStep?.dailyMetrics} />;
      case 'roas':
        return <PortfolioRoasChart dailyMetrics={performanceFunnelStep?.dailyMetrics} />;
    }
  };

  const renderCharts = isMounted || realizedMetricDataPast?.length || performanceChartData?.length;

  // Loading states
  const isFullPageLoading =
    multiSeriesFunnelLoading ||
    !isMounted ||
    !selectedFunnelStep ||
    !portfolioMeta ||
    !funnelSteps ||
    attributionPerformanceLoading;
  const shouldShowChartSkeleton = chartFunnelStepLoading && !chartFunnelStepData;
  const shouldShowTableSkeleton = tableFunnelStepsLoading;
  const shouldShowNoData = !isFullPageLoading && !renderCharts;

  if (isFullPageLoading) {
    // Block everything until main data is ready
    return (
      <>
        <div className="mt-6 flex flex-row gap-8">
          <div style={{ flexDirection: 'column' }}>
            <Skeleton style={{ height: 70, width: 456, marginBottom: 12 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <Skeleton style={{ height: 100, width: 300 }} />
                  <Skeleton style={{ height: 100, width: 148 }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex justify-between gap-4">
              <div className="flex gap-2">
                <Skeleton style={{ height: 29, width: 127 }} />
                <Skeleton style={{ height: 29, width: 88 }} />
              </div>
              <div className="flex">
                <Skeleton style={{ height: 29, width: 300 }} />
              </div>
            </div>
            <Skeleton style={{ height: 560, width: '100%' }} />
          </div>
        </div>
        <div className="mt-10">
          <Skeleton style={{ height: 560, width: '100%' }} />
        </div>
      </>
    );
  }

  if (shouldShowNoData) {
    return <NoData />;
  }

  // Main progressive render
  return (
    <>
      <PerformanceContainerStyled>
        {switchSections?.length ? (
          <MultipleSwitch
            style={{ marginBottom: 24 }}
            current={activeSwitch}
            sections={switchSections}
            initial={activeSwitch}
            onToggle={setActiveSwitch}
          />
        ) : null}

        {activeSwitch === 'overview' ? (
          <>
            <div style={{ display: 'flex', width: '100%' }}>
              {/* Funnel is always shown if funnelSteps is available */}
              <MultiSeriesFunnel performanceTotalsFunnelSteps={funnelSteps} />
              <div className="mt-3.5 flex w-full flex-col">
                <PerformanceHeader
                  disabled={chartFunnelStepLoading}
                  shouldRenderCustomization
                  shouldRenderLabelsFilter={hasLabels}
                  shouldRenderImpactGroupsFilter={hasMultipleImpactGroups}
                  activeProviderIds={funnelSteps?.[0]?.metricTotals.providers?.map(
                    (providerMetric) => providerMetric.providerId,
                  )}
                  renderSwitcher={() => {
                    return !isCostSelected ? (
                      <MultipleSwitch
                        withTooltip
                        sections={[
                          {
                            id: 'performance',
                            text: selectedFunnelStep?.title || '',
                          },
                          {
                            id: 'cost-per',
                            text: `Cost per ${selectedFunnelStep?.title}`,
                          },
                          selectedFunnelStep.type === NexoyaFunnelStepType.ConversionValue && {
                            id: 'roas',
                            text: `${selectedFunnelStep?.title} per cost `,
                          },
                        ].filter(Boolean)}
                        current={activeChart}
                        initial={activeChart}
                        onToggle={handleChangeActiveChart}
                      />
                    ) : null;
                  }}
                />

                {/* Chart progressive loading: show skeleton until chart data is ready */}
                {shouldShowChartSkeleton ? (
                  <Skeleton style={{ height: 560, width: '100%' }} />
                ) : (
                  <>
                    {renderChartBasedOnActiveSwitch(activeChart)}
                    <PortfolioChartLegend active={activeChart} title={selectedFunnelStep?.title} />
                  </>
                )}
              </div>
            </div>
            {/* Table progressive loading: show skeleton if still loading */}
            {shouldShowTableSkeleton ? (
              <div className="mt-10">
                <Skeleton style={{ height: 560, width: '100%' }} />
              </div>
            ) : (
              <PerformanceTable
                dateSelectorProps={dateSelectorProps}
                portfolioId={portfolioId}
                performanceFunnelSteps={tableFunnelStepsData?.portfolioV2?.performance?.funnelSteps}
                loading={tableFunnelStepsLoading}
              />
            )}
          </>
        ) : null}
        {portfolioMeta?.portfolioDashboardUrls?.length > 0
          ? portfolioMeta.portfolioDashboardUrls.map((portfolioUrl) =>
              activeSwitch === portfolioUrl.name ? (
                <iframe
                  referrerPolicy="no-referrer"
                  sandbox="allow-same-origin allow-scripts"
                  key={portfolioUrl.url}
                  frameBorder="0"
                  src={portfolioUrl.url}
                  title={portfolioUrl.name}
                  width="100%"
                  height="5000px"
                />
              ) : null,
            )
          : null}
      </PerformanceContainerStyled>
    </>
  );
}

export const LoadingWrapStyled = styled.div`
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
  flex-direction: row;
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
