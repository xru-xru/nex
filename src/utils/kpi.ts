import { get } from 'lodash';

import { NexoyaCkKpiInput, NexoyaCustomKpi, NexoyaMeasurement, NexoyaMeasurementConnection } from '../types/types';
import { KpiInput } from '../types/types.custom';

import { toArr } from './array';

const SPLIT_KEY = '|';
const M_QUERY_KEY = 'm';
const C_QUERY_KEY = 'c';
// Used to create a unique reference key. Usually used as React Key
// when mapping over elements, or when creating a selection of kpis
// and we need to keep a reference through a key form.
// TODO: This is currently a copy in the /utils/buildReactKeys.js which should be removed and used this one instead
export function getKpiKey(kpi: NexoyaMeasurement, prefix = ''): string {
  const provider = kpi.provider_id || '';
  const collection = get(kpi, 'collection.collection_id', '');
  const measurement = kpi.measurement_id || '';
  const id = `${provider}-${collection}-${measurement}`;
  return `${prefix ? `${prefix}-` : ''}${id}`;
}
// Used to compare two KPIs and see if they are equal. We used it in
// filtering mostly to filter out the kpis.
export function equalKpis(first: NexoyaMeasurement, second: NexoyaMeasurement): boolean {
  const firstMeaId = first.measurement_id;
  const secondMeaId = second.measurement_id;
  const firstColId = get(first, 'collection.collection_id', null);
  const secondColId = get(second, 'collection.collection_id', null);

  if (!firstMeaId || !secondMeaId || !firstColId || !secondColId) {
    throw new Error('equalKpis can not compare kpis without data');
  }

  return firstMeaId === secondMeaId && firstColId === secondColId;
}
// Used to compare two KPIs and see if they are equal. We used it in
// filtering mostly to filter out the kpis.
export function equalCustomKpis(first: NexoyaMeasurement, second: NexoyaMeasurement): boolean {
  const firstMeaId = first.measurement_id;
  const secondMeaId = second.measurement_id;
  const firstColId = get(first, 'collection.collection_id', null);
  const secondColId = get(second, 'collection.collection_id', null);

  if (!firstMeaId || !secondMeaId) {
    throw new Error('equalKpis can not compare kpis without data');
  }

  return firstMeaId === secondMeaId && firstColId === secondColId;
}
// Used to compare two kpi inputs
export function equalKpisInput(first: KpiInput, second: KpiInput): boolean {
  const firstMeaId = first.measurement_id;
  const secondMeaId = second.measurement_id;
  const firstColId = first.collection_id;
  const secondColId = second.collection_id;

  if (!firstMeaId || !secondMeaId || !firstColId || !secondColId) {
    throw new Error('equalKpisFlat can not compare kpis without data');
  }

  return firstMeaId === secondMeaId && firstColId === secondColId;
}
// Used to detect does a array of kpis (collection) contain a given kpi (item)
export function doesContainKpi(collection: NexoyaMeasurement[], item: NexoyaMeasurement): boolean {
  if (!collection || !collection.length || !item) return false;
  return collection.filter((collectionItem) => equalKpis(collectionItem, item)).length > 0;
}
// Used to return a boolean whether all of the KPIs in a paginated list
// are in the selected kpis array or not. Used in the kpi lists where
// we want to select items
export function allSelected(selectedKpis: NexoyaMeasurement[], kpis: NexoyaMeasurementConnection): boolean {
  const { edges } = kpis;

  // In case selected are less than edges we can automatically
  // assume not all of the kpis are selected in the list.
  if (!edges || selectedKpis.length < edges.length || edges.length === 0) {
    return false;
  }

  // We want to find only the selected Kpis which are actually
  // visible in the Kpis list. If we use a filter on Kpis, we
  // can have selected items which are not in the kpis list.
  const visibleSelection = edges.filter((kpi) => selectedKpis.some((k) => !equalKpis(kpi.node, k)));
  return visibleSelection.length === edges.length;
}
// Used to build the a KPIInput for graphql query. We have this helper
// because the transformation is quite a lot of code to repeat all the time
export function kpiInput(kpi: NexoyaMeasurement): KpiInput {
  const mId = get(kpi, 'measurement_id', 0);
  const cId = get(kpi, 'collection.collection_id', 0);
  return {
    measurement_id: mId,
    collection_id: cId,
  };
}
// Used to build custopmKpiInput. Custom kpi can sometimes have plain number,
// without attached collection - therefore we don't check for collection
// and in case collection is not there - don't throw error as we would do with
// "normal" metrics
export function customKpiInput(kpi: NexoyaMeasurement, customKPIConfig?: NexoyaCustomKpi): NexoyaCkKpiInput {
  const mId = get(kpi, 'measurement_id', null);
  const cId = get(kpi, 'collection.collection_id', null);

  // if there is mId, but not cId, that is expected for some cases for custom kpi
  // therefore we return object like this
  // default value takes precedence over the mId if it exists
  if (!cId && mId) {
    return {
      default_value: customKPIConfig?.defaultValue ?? mId,
    };
  }

  // if we don't have cId, but also no mId then that's a red flag
  if (!mId && !cId) {
    throw new Error(`kpiInput: the kpi is not valid (m_id: ${mId}, c_id: ${cId})`);
  }

  // finally, we return the "regular" pair
  return {
    measurement_id: mId,
    collection_id: cId,
  };
}
// Comment:
// This is used to transform selected kpis stored in a state/context
// into an input for GraphQl as a variable.
export function kpiInputArr(input: NexoyaMeasurement[] | NexoyaMeasurement): KpiInput[] {
  return toArr<NexoyaMeasurement>(input).map(kpiInput);
}
// kpiInputArr version for custom kpis, which takes into consideration some
// specifics like some kpis included in custom kpi don't have collection attached
export function customKpiInputArr(
  input: NexoyaMeasurement[] | NexoyaMeasurement,
  customKpiConfig: NexoyaCustomKpi
): NexoyaCkKpiInput[] {
  return toArr<NexoyaMeasurement>(input).map((kpiInput) => customKpiInput(kpiInput, customKpiConfig));
}

// Turn incoming query param into a KpiInput we can use to
// query the kpi we want.
function decodeKpi(input: string): KpiInput {
  // we are expecting it in this format -> "c17940406|m245"
  let [cId, mId]: string[] | number[] = input.split(SPLIT_KEY);

  if (!cId || !mId) {
    throw new Error(`decodeKpi: invalid kpi string (m_id: ${mId}, c_id: ${cId})`);
  }

  mId = parseInt(mId.replace(M_QUERY_KEY, ''));
  cId = parseInt(cId.replace(C_QUERY_KEY, ''));

  if (isNaN(mId) || isNaN(cId)) {
    throw new Error(`decodeKpi: could not convert string to number (m_id: ${mId}, c_id: ${cId})`);
  }

  return {
    measurement_id: mId,
    collection_id: cId,
  };
}

// Used to convert the url kpi queries into a usable array of KpiInputs for graphql
export function decodeKpisQuery(input: string[]): KpiInput[] {
  if (!Array.isArray(input)) {
    throw new Error('decodeKpiQuery: expecting an array of strings with format cId|mId');
  }

  return input.map(decodeKpi);
}
// Turn incoming KpiInput or Kpi into a Kpi url query param.
// So we can update the url with the appropriate queries.
export function encodeKpi(kpi: KpiInput | NexoyaMeasurement): string {
  const mId = get(kpi, 'measurement_id', 0);
  const cId = get(kpi, 'collection_id', null) || get(kpi, 'collection.collection_id', 0);

  if (!mId || !cId) {
    throw new Error(`encodeKpi: invalid kpi (m_id: ${mId}, c_id: ${cId})`);
  }

  return `${C_QUERY_KEY}${cId}${SPLIT_KEY}${M_QUERY_KEY}${mId}`;
}
// Used to convert the UI kpis into an array of strings which we can
// use as query params in the URL appended to the "location.pathname"
export function encodeKpisQuery(input: KpiInput | KpiInput[] | NexoyaMeasurement[] | NexoyaMeasurement): string[] {
  if (!input) {
    throw new Error(`encodeKpisQuery: invalid input (${input})`);
  }

  return toArr<any>(input).map(encodeKpi);
}
