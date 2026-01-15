import React, { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DateParam, StringParam, useQueryParams } from 'use-query-params';

import {
  NexoyaDailyMetric,
  NexoyaFunnelStepPerformance,
  NexoyaPortfolioTargetItem,
  NexoyaPortfolioType,
  NexoyaTargetDailyItem,
} from 'types';
import { useDailyTargetMetricsQuery } from '../../graphql/target/dailyTargetMetrics';
import { useTargetItemQuery } from '../../graphql/target/targetItemQuery';

import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

import Button from '../../components/Button';
import TargetOverview from '../../components/Charts/target/TargetOverview';
import TargetPacing from '../../components/Charts/target/TargetPacing';
import LoadingPlaceholder from '../../components/LoadingPlaceholder/LoadingPlaceholder';
import MultipleSwitch from '../../components/MultipleSwitchFluid';
import SvgTarget from '../../components/icons/Target';
import { calculateSpentBudgetForDailyMetric } from './components/BudgetItem/utils';
import { PerformanceHeader } from './components/PerformanceChartHeader';
import { TargetItemSidePanel } from './components/TargetItem/TargetItemSidePanel';
import { TargetItemsTable } from './components/TargetItem/TargetItemsTable';
import { computeUnionOfTargetItems, filterDailyMetricsBySelectedPeriod } from './components/TargetItem/utils';

import { LoadingWrapStyled } from './Content/Content';
import NoDataFound from './NoDataFound';

dayjs.extend(isoWeek);

type Props = {
  portfolioId: number;
  portfolioType: NexoyaPortfolioType;
  portfolioStart: Date;
  portfolioEnd: Date;
};

type TargetChartType = 'overview' | 'pacing';

export const TARGET_CHART_SWITCHES = [
  {
    id: 'overview' as TargetChartType,
    text: 'Overview',
  },
  {
    id: 'pacing' as TargetChartType,
    text: 'Pacing',
  },
];

function Target({ portfolioId, portfolioStart, portfolioEnd, portfolioType }: Props) {
  const [targetItemDrawerOpen, setTargetItemDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useQueryParams({
    targetChart: StringParam,
    dateFrom: DateParam,
    dateTo: DateParam,
  });

  const { data: targetItemData, loading: targetItemLoading } = useTargetItemQuery({
    portfolioId,
  });

  const targetItems: NexoyaPortfolioTargetItem[] = targetItemData?.portfolioV2?.targetItems;

  const { data: dailyTargetMetricsData, loading: dailyTargetMetricsLoading } = useDailyTargetMetricsQuery({
    portfolioId,
    start: dayjs(portfolioStart).utc().format(GLOBAL_DATE_FORMAT),
    end: dayjs(portfolioEnd).utc().format(GLOBAL_DATE_FORMAT),
    skip: targetItemLoading || !targetItems?.length,
  });

  const allTargetItemsUnion: NexoyaPortfolioTargetItem & { targetDailyItems: NexoyaTargetDailyItem[] } =
    computeUnionOfTargetItems(targetItems);

  const targetFunnelStep = dailyTargetMetricsData?.portfolioV2?.defaultOptimizationTarget;

  const dailyMetricsForFunnelStep: NexoyaDailyMetric[] =
    dailyTargetMetricsData?.portfolioV2?.performance?.funnelSteps
      ?.find((fs: NexoyaFunnelStepPerformance) => fs?.funnelStep?.funnelStepId === targetFunnelStep?.funnelStepId)
      ?.dailyMetrics?.filter((dm: NexoyaDailyMetric) =>
        filterDailyMetricsBySelectedPeriod(dm, {
          start: queryParams.dateFrom,
          end: queryParams.dateTo,
        }),
      ) || [];

  const activeProviderIds: number[] = dailyMetricsForFunnelStep?.[0]?.providers?.map((bd) => bd.providerId) || [];

  useEffect(() => {
    if (!queryParams.targetChart) {
      setQueryParams({ targetChart: 'overview' as TargetChartType });
    }
  }, []);

  const renderCharts = useCallback(() => {
    if (!allTargetItemsUnion) {
      return null;
    }
    switch (queryParams.targetChart) {
      case 'overview' as TargetChartType:
        return (
          <TargetOverview
            portfolioType={portfolioType}
            dailyMetrics={dailyMetricsForFunnelStep}
            targetDailyItems={allTargetItemsUnion?.targetDailyItems}
          />
        );
      case 'pacing' as TargetChartType:
        return (
          <TargetPacing
            dailyMetrics={dailyMetricsForFunnelStep}
            targetDailyItems={allTargetItemsUnion?.targetDailyItems}
          />
        );
      default:
        return <></>;
    }
  }, [dailyMetricsForFunnelStep, allTargetItemsUnion]);

  if (targetItemLoading || dailyTargetMetricsLoading) {
    return (
      <LoadingWrapStyled>
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </LoadingWrapStyled>
    );
  }

  return (
    <>
      <div>
        <PerformanceHeader
          disabled={targetItemLoading || dailyTargetMetricsLoading}
          activeProviderIds={activeProviderIds}
          shouldRenderProvidersFilter={queryParams.targetChart === 'pacing'}
          renderSwitcher={() => (
            <MultipleSwitch
              sections={TARGET_CHART_SWITCHES}
              initial={TARGET_CHART_SWITCHES[0]}
              current={queryParams.targetChart}
              onToggle={(selectedOption) => {
                setQueryParams({
                  targetChart: selectedOption,
                });
              }}
            />
          )}
        />
      </div>
      {renderCharts()}
      {targetItems?.length ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <Button variant="contained" color="secondary" onClick={() => setTargetItemDrawerOpen(true)}>
              Add target item
            </Button>
          </div>
          <TargetItemsTable
            targetItems={targetItems}
            portfolioId={portfolioId}
            selectedPeriodSpend={(targetItem) =>
              calculateSpentBudgetForDailyMetric(dailyMetricsForFunnelStep, targetItem.start, targetItem.end)
            }
          />
        </>
      ) : (
        <NoDataFound
          title="You don’t have any target items yet"
          subtitle="Click the button below to get started"
          icon={<SvgTarget />}
          cta={
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <Button variant="contained" color="secondary" onClick={() => setTargetItemDrawerOpen(true)}>
                Add target item
              </Button>
            </div>
          }
        />
      )}
      <TargetItemSidePanel
        targetItemDrawerOpen={targetItemDrawerOpen}
        setTargetItemDrawerOpen={setTargetItemDrawerOpen}
        portfolioId={portfolioId}
      />
    </>
  );
}

export default Target;
