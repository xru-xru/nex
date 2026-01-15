import { useMemo } from 'react';

import { round } from 'lodash';

import {
  NexoyaDailyImpactGroupMetric,
  NexoyaDailyLabelMetric,
  NexoyaDailyMetric,
  NexoyaDailyProviderMetric,
  NexoyaFunnelStepPerformance,
} from 'types';

import { useLabels } from '../../../context/LabelsProvider';
import { usePortfolio } from '../../../context/PortfolioProvider';

import { diffCount, fillMissingDays } from 'utils/dates';
import { useImpactGroups } from '../../../context/ImpactGroupsProvider';

interface PerformanceCostPerChartDataPoint {
  shouldFillGaps: boolean;
  timestamp: string;
  value: number;
  timestampComparison?: string;
  valueTimeComparison?: number;
  comparisonChangePercent?: number;
}

const getMetricFor = (
  filteredItems: NexoyaDailyProviderMetric[] | NexoyaDailyLabelMetric[] | NexoyaDailyImpactGroupMetric[],
  propertyKey: 'value' | 'comparisonValue',
  metricKey: 'adSpend' | 'value',
) => {
  // @ts-ignore
  return filteredItems?.reduce(
    (acc: number, metric: NexoyaDailyProviderMetric | NexoyaDailyLabelMetric) => acc + metric[propertyKey]?.[metricKey],
    0,
  );
};

export function usePortfolioToCostPerData(
  selectedFunnelStep: NexoyaFunnelStepPerformance,
  isAwareness: boolean,
  dailyMetrics: NexoyaDailyMetric[],
  funnelStepId: number,
) {
  const {
    providers: { providersFilter },
  } = usePortfolio();
  const {
    filter: { labelsFilter },
  } = useLabels();
  const {
    filter: { impactGroupsFilter },
  } = useImpactGroups();

  const filteredProviderIds = providersFilter.map((provider) => provider.provider_id);
  const filteredLabelIds = labelsFilter.map((label) => label.labelId);
  const filteredImpactGroupIds = impactGroupsFilter.map((impactGroup) => impactGroup.impactGroupId);

  const shouldFillTimeGaps = () => {
    let areThereGaps = false;
    dailyMetrics?.forEach((dataItem, i) => {
      const current = dataItem;
      const next = dailyMetrics[i + 1];
      if (next?.day && current?.day) {
        const daysCount = diffCount(current?.day, next?.day);
        if (daysCount > 2) {
          areThereGaps = true;
        }
      }
    });
    return areThereGaps;
  };

  const dataForChart = useMemo(() => {
    const shouldFillGaps = shouldFillTimeGaps();

    return (
      fillMissingDays([...(dailyMetrics || [])])
        ?.map((item) => {
          // Consolidated filtering logic
          const filteredItems = (() => {
            if (filteredProviderIds.length > 0) {
              return item?.providers?.filter((provider) => filteredProviderIds.includes(provider.providerId));
            } else if (filteredLabelIds.length > 0) {
              return item?.labels?.filter((label) => filteredLabelIds.includes(label.labelId));
            } else if (filteredImpactGroupIds.length > 0) {
              return item?.impactGroups?.filter((impactGroup) =>
                filteredImpactGroupIds.includes(impactGroup?.impactGroup?.impactGroupId),
              );
            }
            return item.providers;
          })();

          const adSpend = getMetricFor(filteredItems, 'value', 'adSpend');
          const value = getMetricFor(filteredItems, 'value', 'value');

          const costRatio = adSpend / value;
          const calculatedValue = isAwareness ? Math.round(costRatio * 1000 * 10) / 10 : round(costRatio, 2);

          const dataPoint: PerformanceCostPerChartDataPoint = {
            shouldFillGaps,
            timestamp: item?.day?.substring(0, 10),
            value: calculatedValue || null,
          };

          if (item.comparisonDay) {
            const comparisonAdSpend = getMetricFor(filteredItems, 'comparisonValue', 'adSpend');
            const comparisonValue = getMetricFor(filteredItems, 'comparisonValue', 'value');

            const comparisonChangePercent = comparisonValue ? ((value - comparisonValue) / comparisonValue) * 100 : 0;

            const comparisonCostRatio = comparisonAdSpend / comparisonValue;
            const calculatedComparisonValue = isAwareness
              ? Math.round(comparisonCostRatio * 1000 * 10) / 10
              : round(comparisonCostRatio, 2);

            dataPoint.timestampComparison = item.comparisonDay?.substring(0, 10) || null;
            dataPoint.valueTimeComparison = calculatedComparisonValue || 0;
            dataPoint.comparisonChangePercent = comparisonChangePercent;
          }
          return dataPoint;
        })
        // TODO: Check if we should cover this case on FE/BE
        ?.filter((chartDataPoint) => {
          const isValueValid = !isNaN(chartDataPoint.value) && chartDataPoint.value !== Infinity;
          const isComparisonValueValid =
            chartDataPoint.valueTimeComparison === undefined ||
            (!isNaN(chartDataPoint.valueTimeComparison) && chartDataPoint.valueTimeComparison !== Infinity);

          return isValueValid && isComparisonValueValid;
        })
    );
  }, [funnelStepId, selectedFunnelStep, filteredProviderIds, isAwareness, shouldFillTimeGaps, getMetricFor, round]);

  return {
    dataForChart,
  };
}
