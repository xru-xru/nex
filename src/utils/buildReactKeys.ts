import { get } from 'lodash';

import { NexoyaMeasurement } from '../types/types';

export function buildKpiKey(kpi: NexoyaMeasurement, prefix = ''): string {
  const provider = kpi.provider_id || '';
  const collection = get(kpi, 'collection.collection_id', '');
  const measurement = kpi.measurement_id || '';
  const id = `${provider}-${collection}-${measurement}`;
  return `${prefix ? `${prefix}-` : ''}${id}`;
}
