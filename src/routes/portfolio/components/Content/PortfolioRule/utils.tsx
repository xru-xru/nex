import { Calendar, CircleDashed, Fingerprint, Layers, SlidersHorizontal, Target, Type } from 'lucide-react';
import {
  NexoyaContentFilter,
  NexoyaContentFilterFieldName,
  NexoyaContentFilterOperator,
  NexoyaContentRuleFunnelStepMapping,
  NexoyaFieldAllowedValues,
  NexoyaFieldOperation,
  NexoyaFunnelStepMappingType,
  NexoyaFunnelStepV2,
  NexoyaMeasurement,
  NexoyaTranslation,
} from '../../../../../types';
import React from 'react';
import dayjs from 'dayjs';
import { capitalize, toNumber } from 'lodash';
import { GLOBAL_DATE_FORMAT } from '../../../../../utils/dates';
import { FilterType, Operator } from './types';
import translate from '../../../../../utils/translate';
import { AssignedMetric } from './ContentMetricAssignment';
import { getSelectedMeasurementForFunnelStepId } from '../../../../../lib/metric-assignment';

export type PortfolioRuleType = 'content-rule' | 'impact-group-rule' | 'attribution-rule';
const DEFAULT_DAYJS_YEAR_WHEN_NO_YEAR_IS_PRESENT_IN_DATE = 2001;

export const humanizeFieldName = (fieldName: string) => {
  const fieldMapping: Record<string, string> = {
    providerId: 'Provider id',
    collectionId: 'Collection id',
    teamId: 'Team ID',
    title: 'Title',
    collectionType: 'Collection Type',
    parentCollectionId: 'Parent Collection id',
    parentTitle: 'Parent Title',
    startDate: 'Start Date',
    endDate: 'End Date',
    latestMeasurementDataDate: 'Last Measurement date',
    bidStrategy: 'Bid Strategy',
  };

  return fieldMapping[fieldName] || fieldName.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
};

export const OPERATORS_MAP: Record<string, Operator> = {
  eq: { label: 'Is', value: NexoyaContentFilterOperator.Eq, humanReadable: 'Is' },
  ne: { label: 'Is not', value: NexoyaContentFilterOperator.Ne, humanReadable: 'Not' },
  gte: { label: 'Is on or after', value: NexoyaContentFilterOperator.Gte, humanReadable: 'On or after' },
  lte: { label: 'Is on or before', value: NexoyaContentFilterOperator.Lte, humanReadable: 'On or before' },
  contains: { label: 'Contains', value: NexoyaContentFilterOperator.Contains, humanReadable: 'Contains' },
  notContains: { label: 'Does not contain', value: NexoyaContentFilterOperator.NotContains, humanReadable: 'Not' },
  // startsWith: { label: 'Starts with', value: 'startsWith', humanReadable: 'Starts with' },
  // endsWith: { label: 'Ends with', value: 'endsWith', humanReadable: 'Ends with' },
  // isNull: { label: 'Is empty', value: 'isNull', humanReadable: 'Empty' },
  // isNotNull: { label: 'Is not empty', value: 'isNotNull', humanReadable: 'Not empty' },
};

// Utility to map incoming operations to UI operators
export const mapOperationsToUI = (operators: string[]) => operators.map((op) => OPERATORS_MAP[op]).filter(Boolean); // Filter out undefined mappings

export const getIconForField = (fieldName: NexoyaContentFilterFieldName) => {
  switch (fieldName) {
    case NexoyaContentFilterFieldName.ContentId:
      return <Fingerprint className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.Title:
      return <Type className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.ContentType:
      return <Layers className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.ParentContentId:
      return <Layers className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.ParentTitle:
      return <Type className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.StartDate:
      return <Calendar className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.EndDate:
      return <Calendar className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.LatestMeasurementDataDate:
      return <Calendar className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.BidStrategy:
      return <Target className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.Status:
      return <CircleDashed className="h-3.5 w-3.5" />;
    case NexoyaContentFilterFieldName.BudgetType:
      return <Layers className="h-3.5 w-3.5" />;
    default:
      return <SlidersHorizontal className="h-3.5 w-3.5" />;
  }
};

export const getTypeForField = (allowedFields: NexoyaFieldAllowedValues) => {
  if (allowedFields.enumOptionsNumber?.length) {
    return 'numberArr';
  } else if (allowedFields.enumOptionsString?.length) {
    return 'stringArr';
  }

  return allowedFields.fieldType;
};

export const getFilterValueInputBasedOnType = (type: FilterType, filterValues: string[]) => {
  const value = {
    date: null,
    number: null,
    numberArr: null,
    string: null,
    stringArr: null,
    boolean: null,
  };

  switch (type) {
    case 'date':
      const parsedDate = dayjs(filterValues?.[0]);

      // Check if the parsed date doesn't have a year and set it to the current year
      if (!parsedDate.isValid() || parsedDate.year() === DEFAULT_DAYJS_YEAR_WHEN_NO_YEAR_IS_PRESENT_IN_DATE) {
        value.date = parsedDate.year(dayjs().year()).format(GLOBAL_DATE_FORMAT);
      } else {
        value.date = parsedDate.format(GLOBAL_DATE_FORMAT);
      }
      break;
    case 'string':
      value.string = filterValues?.[0];
      break;
    case 'boolean':
      value.boolean = filterValues?.[0] === 'true';
      break;
    case 'number':
      value.number = toNumber(filterValues?.[0]);
      break;
    case 'numberArr':
      value.numberArr = filterValues?.map((val) => toNumber(val));
      break;
    case 'stringArr':
      value.stringArr = filterValues;
      break;
    default:
      break;
  }
  return value;
};

export const getFilterValuesFromFilter = (filter: NexoyaContentFilter) => {
  if (filter.value?.stringArr) return filter.value.stringArr;
  if (filter.value?.string) return [filter.value.string];
  if (filter.value?.numberArr) return filter.value.numberArr;
  if (filter.value?.number) return [String(filter.value.number)];
  if (filter.value?.date) return [dayjs(filter.value.date).format('DD MMM, YYYY')];
  return [];
};

export const displayFilterValue = (filter: NexoyaContentFilter) => {
  const filterValues = getFilterValuesFromFilter(filter);

  if (filterValues.length > 1) {
    return `${filterValues.length} selected`;
  } else if (filter?.value?.stringArr && filterValues?.length > 1) {
    // @ts-ignore
    return filterValues.map(capitalize);
  }

  return filterValues[0];
};

export const getAssignedMetricBasedOnMappingType = ({
  funnelStepId,
  assignedMetrics,
  mergedMeasurements,
  translations,
}: {
  funnelStepId: number;
  assignedMetrics: AssignedMetric[];
  mergedMeasurements?: NexoyaMeasurement[];
  translations: NexoyaTranslation[];
}) => {
  const assignedMetric = assignedMetrics.find((metric) => metric.funnelStepId === funnelStepId);
  const selectedMeasurement = getSelectedMeasurementForFunnelStepId(
    funnelStepId,
    mergedMeasurements || [],
    assignedMetrics,
  );
  const assignedMetricName = translate(translations, selectedMeasurement?.name);

  switch (assignedMetric?.type) {
    case NexoyaFunnelStepMappingType.Metric:
      return {
        assignedMetricId: selectedMeasurement?.measurement_id,
        assignedMetricName,
        mappingTypeLabel: 'Assign metric',
        type: assignedMetric?.type,
        hasAssigned: !!selectedMeasurement,
      };
    case NexoyaFunnelStepMappingType.Conversion:
      return {
        assignedMetricId: assignedMetric?.metricId,
        assignedMetricName,
        mappingTypeLabel: 'Custom conversions',
        type: assignedMetric?.type,
        hasAssigned: assignedMetric.conversions.some(
          (conversion) => conversion.metricId && conversion.accountConversionIds?.length,
        ),
      };
    case NexoyaFunnelStepMappingType.Utm:
      return {
        assignedMetricId: assignedMetric?.metricId,
        assignedMetricName: 'UTM tracking',
        mappingTypeLabel: 'UTM tracking',
        type: assignedMetric?.type,
        hasAssigned: !!(
          assignedMetric.utmParams?.length &&
          assignedMetric?.metricId &&
          assignedMetric.analyticsPropertyId
        ),
      };
    case NexoyaFunnelStepMappingType.CustomMetric:
      return {
        assignedMetricId: assignedMetric?.metricId,
        assignedMetricName: 'Custom metric',
        mappingTypeLabel: 'Custom metric',
        type: assignedMetric?.type,
        hasAssigned: !!(assignedMetric?.searchTitle && assignedMetric?.metricId),
      };
    case NexoyaFunnelStepMappingType.CustomImport:
      return {
        assignedMetricId: assignedMetric?.metricId,
        assignedMetricName: 'Custom import',
        mappingTypeLabel: 'Custom import',
        type: assignedMetric?.type,
        hasAssigned: !!(assignedMetric?.searchTitle && assignedMetric?.metricId),
      };
    case NexoyaFunnelStepMappingType.Ignore:
      return {
        assignedMetricId: null,
        assignedMetricName: 'No metric',
        mappingTypeLabel: 'Ignore mapping',
        type: assignedMetric?.type,
        hasAssigned: true,
      };
    default:
      return {
        assignedMetricId: null,
        assignedMetricName: '',
        mappingTypeLabel: '',
        type: null,
        hasAssigned: false,
      };
  }
};

export const excludeProviderAndParentCollectionFields = (filter: NexoyaContentFilter) =>
  filter.fieldName !== NexoyaContentFilterFieldName.SourceProviderId &&
  filter.fieldName !== NexoyaContentFilterFieldName.ParentContentId;

export const getHumanReadableFunnelStepMapping = ({
  funnelStepMapping,
  measurements,
  translations,
}: {
  funnelStepMapping: NexoyaContentRuleFunnelStepMapping;
  measurements: NexoyaMeasurement[];
  translations: NexoyaTranslation[];
}): { metric: string; mappingType: string } => {
  const measurement = measurements?.find((m) => m?.measurement_id === funnelStepMapping?.mapping?.metricId);
  const assignedMetricName = translate(translations, measurement?.name);

  if (funnelStepMapping?.mapping?.type === NexoyaFunnelStepMappingType.Metric) {
    return { metric: assignedMetricName, mappingType: 'Assign metric' };
  }

  if (funnelStepMapping?.mapping?.type === NexoyaFunnelStepMappingType.Conversion) {
    return { metric: 'Multiple custom conversions', mappingType: 'Custom conversions' };
  }

  if (funnelStepMapping?.mapping?.type === NexoyaFunnelStepMappingType.Utm) {
    return { metric: assignedMetricName, mappingType: 'GA4 tracking' };
  }

  if (funnelStepMapping?.mapping?.type === NexoyaFunnelStepMappingType.CustomImport) {
    return { metric: 'Custom import', mappingType: 'Custom import' };
  }

  if (funnelStepMapping?.mapping?.type === NexoyaFunnelStepMappingType.CustomMetric) {
    return { metric: 'Custom metric', mappingType: 'Custom metric' };
  }

  if (funnelStepMapping?.mapping?.type === NexoyaFunnelStepMappingType.Ignore) {
    return { metric: undefined, mappingType: 'Ignore mapping' };
  }

  return { metric: 'No assignment', mappingType: undefined };
};

export function normalizeFilter(filter: any) {
  // Remove __typename at the top level
  const { __typename, ...rest } = filter;
  // Normalize the value: remove __typename and remove keys with null
  const normalizedValue = Object.keys(rest.value).reduce(
    (acc, key) => {
      if (key === '__typename') return acc;
      // Only include keys that are not null
      if (rest.value[key] !== null) {
        acc[key] = rest.value[key];
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  return {
    ...rest,
    value: normalizedValue,
  };
}

export function camelCaseToWords(s: string) {
  const result = s.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export const sortFields = (fields: NexoyaFieldOperation[]) => {
  const FIELD_PRIORITY = {
    [NexoyaContentFilterFieldName.ContentType]: 1,
    [NexoyaContentFilterFieldName.Title]: 2,
    [NexoyaContentFilterFieldName.Status]: 3,
    [NexoyaContentFilterFieldName.StartDate]: 4,
    [NexoyaContentFilterFieldName.EndDate]: 5,
    [NexoyaContentFilterFieldName.BidStrategy]: 6,
    [NexoyaContentFilterFieldName.LatestMeasurementDataDate]: 7,
    [NexoyaContentFilterFieldName.ParentTitle]: 8,
  };

  return [...fields].sort((a, b) => {
    const priorityA = FIELD_PRIORITY[a.fieldName] || Number.MAX_SAFE_INTEGER;
    const priorityB = FIELD_PRIORITY[b.fieldName] || Number.MAX_SAFE_INTEGER;
    return priorityA - priorityB;
  });
};

export const cleanUtmParams = (params: any[] = []) => {
  const filtered = params?.filter((p) => p.type && p.values).map(({ type, values }) => ({ type, values }));
  return filtered?.length ? filtered : [];
};

export const areAllFunnelStepsAssigned = (
  funnelSteps: NexoyaFunnelStepV2[],
  assignedMetrics: AssignedMetric[],
  mergedMeasurements: NexoyaMeasurement[],
  translations: NexoyaTranslation[],
) => {
  return funnelSteps.every((step) => {
    const stepResult = getAssignedMetricBasedOnMappingType({
      funnelStepId: step.funnelStepId,
      assignedMetrics,
      mergedMeasurements,
      translations,
    });

    return stepResult.hasAssigned;
  });
};

export const areSomeFunnelStepsAssigned = (
  funnelSteps: NexoyaFunnelStepV2[],
  assignedMetrics: AssignedMetric[],
  mergedMeasurements: NexoyaMeasurement[],
  translations: NexoyaTranslation[],
) => {
  return funnelSteps.some((step) => {
    const stepResult = getAssignedMetricBasedOnMappingType({
      funnelStepId: step.funnelStepId,
      assignedMetrics,
      mergedMeasurements,
      translations,
    });

    return stepResult.hasAssigned;
  });
};
