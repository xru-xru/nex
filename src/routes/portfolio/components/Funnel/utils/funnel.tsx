import {
  NexoyaFunnelStepPerformance,
  NexoyaImpactGroup,
  NexoyaImpactGroupMetricTotal,
  NexoyaLabelMetricTotal,
  NexoyaPortfolioLabel,
  NexoyaProvider,
  NexoyaProviderMetricTotal,
} from '../../../../../types';

import { FunnelData } from '../MultiSeriesFunnel';
import { TooltipContentContainer, TooltipContentFunnelTitle } from '../styles';

export const OFFSET_MULTIPLIERS = [0, 2, 6, 8, 9, 13, 12, 15, 0.9, 0.8, 0.7, 0.6];
export const FUNNEL_STEP_WIDTHS_PERCENTAGES = [
  1, 0.7, 0.48, 0.33, 0.23, 0.16, 0.11, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0.01, 0.01, 0.01, 0.01,
];
export const FUNNEL_CONFIG = { width: 110 };
export const DATE_COMPARISON_FUNNEL_WIDTH = 240;
export const DEFAULT_FUNNEL_WIDTH = 300;
const DEFAULT_PROPERTY_KEY_TO_FILTER_BY = 'providers';

export const roundPoint = (number: number): number => {
  return Math.round(number * 100) / 100;
};

export const computeArrayOfSums = (values: number[][]): number[] => {
  return values?.map((valueSet) => {
    return valueSet?.reduce((sum, value) => sum + (value || 0), 0);
  });
};

export const trimCompareToArray = (compareToArray: number[][], sliceTo?: number): number[][] => {
  return compareToArray?.map((value) => {
    return sliceTo ? value.slice(0, sliceTo) : value;
  });
};
export const getFunnelFlexPercentages = (data: number[][]): number[][] => {
  return data?.map((valueSet) => {
    const total = valueSet?.reduce((sum, value) => sum + (value || 0), 0);
    return valueSet?.map((value) => (total === 0 ? 0 : roundPoint(((value || 0) * 100) / total)));
  });
};

export const getConversionRatePercentages = (
  data: FunnelData,
  compareTo: boolean,
  providersLength: number,
): number[] => {
  const calculatePercentageChange = (currentValue: number, prevValue: number): number => {
    return currentValue && prevValue ? roundPoint((currentValue * 100) / prevValue) : 0;
  };

  const dataValuesCopy = [...data.values];
  const valuesToProcess: number[] | number[][] = compareTo
    ? data.values.map((value) => value.slice(0, providersLength))
    : dataValuesCopy;

  return valuesToProcess.reduce((result: number[], value: number | number[], index: number) => {
    if (index === 0) {
      return [0];
    }

    if (Array.isArray(value)) {
      const summedValue = value?.reduce((a, b) => a + b, 0);
      const summedPrevValue = (valuesToProcess[index - 1] as number[])?.reduce((a, b) => a + b, 0);
      const percentageChange = calculatePercentageChange(summedValue, summedPrevValue);
      result.push(percentageChange);
    } else {
      const prevValueArray = valuesToProcess[index - 1];
      const prevValue = Array.isArray(prevValueArray) ? prevValueArray?.reduce((a, b) => a + b, 0) : prevValueArray;
      const percentageChange = calculatePercentageChange(value, prevValue);
      result.push(percentageChange);
    }

    return result;
  }, []);
};
export const computeCostPerProviderPerFunnelStep = (
  providersFilter: NexoyaProvider[],
  labelsFilter: NexoyaPortfolioLabel[],
  impactGroupsFilter: NexoyaImpactGroup[],
  funnelSteps: NexoyaFunnelStepPerformance[],
  compareTo = false,
  propertyKey: 'total' | 'comparisonTotal',
): number[][] => {
  const calculateMetrics = (filter: (funnelStep: any) => any[], filterCondition: (metric: any) => boolean) => {
    return funnelSteps?.reduce((acc, funnelStep) => {
      filter(funnelStep)
        .filter(filterCondition)
        .forEach((metric) => {
          const funnelStepId = funnelStep?.funnelStep?.funnelStepId;
          acc[funnelStepId] = (acc[funnelStepId] || 0) + metric?.[propertyKey]?.value;
        });
      return acc;
    }, {});
  };

  const results: any[] = [];

  if (providersFilter.length) {
    results.push(
      ...providersFilter.map((provider) =>
        calculateMetrics(
          (funnelStep) => funnelStep?.metricTotals?.providers,
          (providerMetric: NexoyaProviderMetricTotal) => providerMetric.providerId === provider.provider_id,
        ),
      ),
    );

    if (compareTo) {
      results.push(
        calculateMetrics(
          (funnelStep) => funnelStep?.metricTotals?.providers,
          (providerMetric: NexoyaProviderMetricTotal) =>
            !providersFilter.some((providerFilter) => providerFilter.provider_id === providerMetric.providerId),
        ),
      );
    }
  } else if (labelsFilter.length) {
    results.push(
      ...labelsFilter.map((labelFilter) =>
        calculateMetrics(
          (funnelStep) => funnelStep?.metricTotals?.labels,
          (labelMetric: NexoyaLabelMetricTotal) => labelMetric.labelId === labelFilter.labelId,
        ),
      ),
    );

    if (compareTo) {
      results.push(
        calculateMetrics(
          (funnelStep) => funnelStep?.metricTotals?.labels,
          (labelMetric: NexoyaLabelMetricTotal) =>
            !labelsFilter.some((labelFilter) => labelFilter.labelId === labelMetric.labelId),
        ),
      );
    }
  } else if (impactGroupsFilter.length) {
    results.push(
      ...impactGroupsFilter.map((igFilter) =>
        calculateMetrics(
          (funnelStep) => funnelStep?.metricTotals?.impactGroups,
          (igMetric: NexoyaImpactGroupMetricTotal) => {
            return igMetric?.impactGroup?.impactGroupId === igFilter.impactGroupId;
          },
        ),
      ),
    );

    if (compareTo) {
      results.push(
        calculateMetrics(
          (funnelStep) => funnelStep?.metricTotals?.impactGroups,
          (igMetric: NexoyaImpactGroupMetricTotal) =>
            !impactGroupsFilter.some((igFilter) => igFilter?.impactGroupId === igMetric?.impactGroup?.impactGroupId),
        ),
      );
    }
  } else {
    results.push(
      calculateMetrics(
        (funnelStep) => funnelStep?.metricTotals?.[DEFAULT_PROPERTY_KEY_TO_FILTER_BY],
        () => true,
      ),
    );
  }

  return (results || []).filter((item) => item && Object.keys(item).length > 0);
};

// Sorts cost per provider per funnel step in order of funnel steps
export const sortCostPerProviderPerFunnelStep = (
  costPerProviderPerFunnelStep: number[][],
  funnelSteps: NexoyaFunnelStepPerformance[],
): { [key: string]: number }[] => {
  const funnelStepIdsInOrder = funnelSteps?.map((step) => {
    return step?.funnelStep?.funnelStepId;
  });

  return costPerProviderPerFunnelStep?.map(
    (obj) => funnelStepIdsInOrder && Object.fromEntries(funnelStepIdsInOrder?.map((id, index) => [index, obj[id]])),
  );
};

// Computes budget per provider per funnel step and computed funnel data values
export const computeBudgetAndFunnelDataValues = (
  sortedArr: { [key: string]: number }[],
): { computedFunnelDataValues: number[][]; adSpend: number[] } => {
  const map = Object.keys(sortedArr?.[0] || []).map((key) => Object.values(sortedArr).map((item) => item[key]));

  const adSpend = map.shift();

  return { computedFunnelDataValues: map, adSpend };
};

export const renderTooltipContent = (data: FunnelData, index: number): JSX.Element => {
  return (
    <div>
      <TooltipContentFunnelTitle>{data?.labels[index] || ''}</TooltipContentFunnelTitle>
      {data?.subLabels?.map((subLabel, seriesIndex) =>
        data?.values?.[index]?.[seriesIndex]?.toLocaleString() ? (
          <div key={subLabel + seriesIndex}>
            <TooltipContentContainer>
              <span style={{ color: '#C7C8D1', fontWeight: 400 }}>
                <span style={{ color: data?.colors[seriesIndex], fontSize: 16 }}>●</span>{' '}
                {data?.subLabels?.[seriesIndex]}
                {': '}
              </span>
              <span>{data?.values?.[index]?.[seriesIndex]?.toLocaleString() || 'N/A'}</span>
            </TooltipContentContainer>
          </div>
        ) : null,
      )}
    </div>
  );
};

export const getSliceToLengthOfActiveFilter = ({
  filteredProviderIds,
  filteredLabelIds,
  filteredImpactGroupIds,
}: {
  filteredProviderIds: number[];
  filteredLabelIds: number[];
  filteredImpactGroupIds: number[];
}) => {
  if (filteredProviderIds.length > 0) {
    return filteredProviderIds.length;
  }

  if (filteredLabelIds.length > 0) {
    return filteredLabelIds.length;
  }

  if (filteredImpactGroupIds.length > 0) {
    return filteredImpactGroupIds.length;
  }
};
