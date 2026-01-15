import { get } from 'lodash';

import { NexoyaMeasurement, NexoyaMeasurementData } from '../../../types/types';

import { useTranslation } from '../../../hooks/useTranslation';

type kpisCompareData = {
  id: string;
  name: string;
  collectionTitle: string;
  datatype: string;
  data: NexoyaMeasurementData[];
};
// made as a custom hook to be able to use useTranslation() hook inside
export function useKpisToCompareConverter(kpis: NexoyaMeasurement[]): kpisCompareData[] {
  const { translate } = useTranslation();
  if (!kpis || kpis.length === 0) return [];
  const formattedData: kpisCompareData[] = kpis.map((item: NexoyaMeasurement) => ({
    id: `${item.measurement_id || 0}-${get(item, 'collection.collection_id', 0)}`,
    name: translate(item.name),
    collectionTitle: translate(get(item, 'collection.title', '') || ''),
    datatype: get(item, 'datatype.label', 'default'),
    // TODO: Think about default datatype if no datatype
    data: get(item, 'detail.data', []).map((item) => ({
      ...item,
      value: item.value || 0,
    })),
  }));
  return formattedData;
}
