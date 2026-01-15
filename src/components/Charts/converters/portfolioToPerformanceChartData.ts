import { NexoyaDailyMetric } from '../../../types';

import { useLabels } from '../../../context/LabelsProvider';
import { usePortfolio } from '../../../context/PortfolioProvider';

import {
  getDailyValuePerImpactGroup,
  getDailyValuePerLabel,
  getDailyValuePerProvider,
  getFilterSource,
  getOptiDailyValuePerImpactGroup,
  getOptiDailyValuePerLabel,
  getOptiDailyValuePerProvider,
} from '../../../utils/provider';
import { fillMissingDays, isInTheFuture, isToday } from 'utils/dates';
import { useImpactGroups } from '../../../context/ImpactGroupsProvider';
import { useCustomizationStore } from '../../../store/customization';

const calculateComparisonData = (
  dailyMetrics: NexoyaDailyMetric[],
  filteredProviderIds: number[],
  filteredLabelIds: number[],
  filteredImpactGroupIds: number[],
) => {
  const comparisonDataByDay = new Map(
    dailyMetrics.map((dm) => {
      const providerSource = getFilterSource(
        dm,
        false,
        false,
        filteredProviderIds,
        filteredLabelIds,
        filteredImpactGroupIds,
      );
      const comparisonValue =
        providerSource?.reduce(
          (acc, providerMetric) => acc + ((providerMetric as any).comparisonValue?.value || 0),
          0,
        ) ?? null;
      return [
        dm.day,
        {
          comparisonDay: dm.comparisonDay,
          valueTimeComparison: comparisonValue,
        },
      ];
    }),
  );

  const filledDailyMetrics = fillMissingDays([...dailyMetrics]);

  return filledDailyMetrics
    .map((dailyMetric) => {
      const providerSource = getFilterSource(
        dailyMetric,
        false,
        false,
        filteredProviderIds,
        filteredLabelIds,
        filteredImpactGroupIds,
      );

      const value =
        providerSource?.reduce((acc, providerMetric) => acc + ((providerMetric as any).value?.value || 0), 0) ?? null;

      const comparisonData = comparisonDataByDay.get(dailyMetric.day);
      const valueTimeComparison = comparisonData?.valueTimeComparison ?? null;

      let comparisonChangePercent = null;
      if (value !== null && valueTimeComparison !== null) {
        comparisonChangePercent =
          valueTimeComparison !== 0 ? ((value - valueTimeComparison) / valueTimeComparison) * 100 : 0;
      }

      return {
        timestamp: dailyMetric.day?.substring(0, 10) || null,
        value,
        timestampComparison: comparisonData?.comparisonDay?.substring(0, 10) || null,
        valueTimeComparison,
        comparisonChangePercent,
      };
    })
    .filter((chartDataPoint) => {
      const isValueValid =
        chartDataPoint.value === null || (!isNaN(chartDataPoint.value) && chartDataPoint.value !== Infinity);
      const isComparisonValueValid =
        chartDataPoint.valueTimeComparison === null ||
        (!isNaN(chartDataPoint.valueTimeComparison) && chartDataPoint.valueTimeComparison !== Infinity);
      return isValueValid && isComparisonValueValid;
    });
};

const calculateChartData = (
  dailyMetrics: NexoyaDailyMetric[] | undefined,
  optimizationMetricTotals: { expectedTotal: number; potentialPercentage?: number } | undefined,
  dailyOptimizationMetrics: any[] | undefined,
  isStackedAreaChartActive: boolean,
  compareToRestOfData: boolean,
  filteredProviderIds: number[],
  filteredLabelIds: number[],
  filteredImpactGroupIds: number[],
) => {
  const localDailyMetrics = dailyMetrics || [];
  const optimizationForGivenDate = () => {
    return {
      optimizationPotentialValue: optimizationMetricTotals?.expectedTotal,
      optimizationPotentialPercentage: optimizationMetricTotals?.potentialPercentage,
    };
  };

  const realizedData = localDailyMetrics.map((dailyMetric) => {
    const providerSource = getFilterSource(
      dailyMetric,
      isStackedAreaChartActive,
      compareToRestOfData,
      filteredProviderIds,
      filteredLabelIds,
      filteredImpactGroupIds,
    );

    const value = providerSource?.reduce(
      (acc: number, providerMetric: any) => acc + (providerMetric.value?.value || 0),
      0,
    );

    return {
      timestamp: dailyMetric.day,
      value,
      ...getDailyValuePerProvider(dailyMetric),
      ...getDailyValuePerLabel(dailyMetric),
      ...getDailyValuePerImpactGroup(dailyMetric),
      ...optimizationForGivenDate(),
    };
  });

  const optimizationMetrics = (dailyOptimizationMetrics || []).map((dailyMetric) => {
    const filteredProviders = getFilterSource(
      dailyMetric,
      isStackedAreaChartActive,
      compareToRestOfData,
      filteredProviderIds,
      filteredLabelIds,
      filteredImpactGroupIds,
    );

    let baselinePerformanceRelative = 0;
    let expectedPerformanceRelative = 0;

    filteredProviders?.forEach((providerMetric) => {
      baselinePerformanceRelative += providerMetric.relativeBaseline;
      expectedPerformanceRelative += providerMetric.relativeExpected;
    });

    return {
      timestamp: dailyMetric.day,
      baselinePerformanceRelative,
      expectedPerformanceRelative,
      ...getOptiDailyValuePerProvider(dailyMetric),
      ...getOptiDailyValuePerLabel(dailyMetric),
      ...getOptiDailyValuePerImpactGroup(dailyMetric),
    };
  });

  function mergeRealizedDataAndExpectedData(realizedData, expectedData) {
    if (isToday(expectedData?.[0]?.timestamp) || isInTheFuture(expectedData?.[0]?.timestamp)) {
      realizedData.push({
        timestamp: expectedData?.[0]?.timestamp,
        value: expectedData?.[0]?.expectedPerformanceRelative,
        optimizationTooltipDisabled: true,
      });
    }
    return [...realizedData, ...expectedData];
  }

  return optimizationMetrics?.length
    ? mergeRealizedDataAndExpectedData(realizedData, optimizationMetrics)
    : realizedData;
};

interface UsePortfolioToPerformanceChartDataParams {
  isActivePortfolio: boolean;
  loading?: boolean;
  dailyMetrics?: NexoyaDailyMetric[];
  optimizationMetricTotals?: { expectedTotal: number; potentialPercentage?: number };
  dailyOptimizationMetrics?: any[];
}

export function usePortfolioToPerformanceChartData({
  isActivePortfolio,
  loading,
  dailyMetrics,
  optimizationMetricTotals,
  dailyOptimizationMetrics,
}: UsePortfolioToPerformanceChartDataParams) {
  const { compareTo: compareToRestOfData, isStackedAreaChartActive } = useCustomizationStore();
  const {
    providers: { providersFilter },
  } = usePortfolio();
  const {
    filter: { labelsFilter },
  } = useLabels();

  const {
    filter: { impactGroupsFilter },
  } = useImpactGroups();

  if (loading) {
    return {
      isActivePortfolio,
      dataForChart: [],
      realizedMetricDataPast: [],
      comparisonPerformanceChartData: [],
      validationDataFormatted: null,
      validationTooltip: null,
    };
  }

  const filteredProviderIds = providersFilter.map((provider) => Number(provider.provider_id));
  const filteredLabelIds = labelsFilter.map((label) => Number(label.labelId));
  const filteredImpactGroupIds = impactGroupsFilter.map((impactGroup) => Number(impactGroup.impactGroupId));
  const localDailyMetrics: NexoyaDailyMetric[] = dailyMetrics || [];

  const comparisonPerformanceChartData = calculateComparisonData(
    localDailyMetrics,
    filteredProviderIds,
    filteredLabelIds,
    filteredImpactGroupIds,
  );

  const dataForChart = calculateChartData(
    dailyMetrics,
    optimizationMetricTotals,
    dailyOptimizationMetrics,
    isStackedAreaChartActive,
    compareToRestOfData,
    filteredProviderIds,
    filteredLabelIds,
    filteredImpactGroupIds,
  );

  return {
    isActivePortfolio,
    dataForChart,
    realizedMetricDataPast: localDailyMetrics,
    comparisonPerformanceChartData,
  };
}
