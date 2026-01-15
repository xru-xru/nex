import { useMemo } from 'react';
import { round } from 'lodash';
import { NexoyaDailyMetric } from 'types';
import { useLabels } from '../../../context/LabelsProvider';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { diffCount } from 'utils/dates';
import { useImpactGroups } from '../../../context/ImpactGroupsProvider';
import { getFilterSource } from '../../../utils/provider';

interface PerformanceCostPerChartDataPoint {
  shouldFillGaps: boolean;
  timestamp: string;
  value: number;
  timestampComparison?: string;
  valueTimeComparison?: number;
  comparisonChangePercent?: number;
}

export function usePortfolioToRoasData({
  dailyMetrics,
  funnelStepId,
}: {
  dailyMetrics: NexoyaDailyMetric[];
  funnelStepId: number;
}) {
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

    return dailyMetrics
      ?.map((item) => {
        const filteredItems = getFilterSource(
          item,
          false,
          false,
          filteredProviderIds,
          filteredLabelIds,
          filteredImpactGroupIds,
        );

        const totalConversionValue = filteredItems?.reduce((acc, metric) => acc + (metric.value?.value || 0), 0);
        const totalCost = filteredItems?.reduce((acc, metric) => acc + (metric.value?.adSpend || 0), 0);
        const roas = totalCost > 0 ? (totalConversionValue / totalCost) * 100 : 0;

        const dataPoint: PerformanceCostPerChartDataPoint = {
          shouldFillGaps,
          timestamp: item?.day?.substring(0, 10),
          value: roas || null,
        };

        if (item.comparisonDay) {
          const comparisonConversionValue = filteredItems.reduce(
            (acc, metric) => acc + (metric.comparisonValue?.value || 0),
            0,
          );
          const comparisonCost = filteredItems.reduce((acc, metric) => acc + (metric.comparisonValue?.adSpend || 0), 0);
          const comparisonRoas = comparisonCost > 0 ? (comparisonConversionValue / comparisonCost) * 100 : 0;
          const comparisonChangePercent = comparisonRoas ? ((roas - comparisonRoas) / comparisonRoas) * 100 : 0;

          dataPoint.timestampComparison = item.comparisonDay?.substring(0, 10) || null;
          dataPoint.valueTimeComparison = comparisonRoas || 0;
          dataPoint.comparisonChangePercent = round(comparisonChangePercent, 2);
        }

        return dataPoint;
      })
      ?.filter((chartDataPoint) => {
        const isRoasValid = !isNaN(chartDataPoint.value) && chartDataPoint.value !== Infinity;
        const isComparisonRoasValid =
          chartDataPoint.valueTimeComparison === undefined ||
          (!isNaN(chartDataPoint.valueTimeComparison) && chartDataPoint.valueTimeComparison !== Infinity);

        return isRoasValid && isComparisonRoasValid;
      });
  }, [funnelStepId, filteredProviderIds]);

  return {
    dataForChart,
  };
}
