import { useCallback } from 'react';

import dayjs from 'dayjs';
import { get } from 'lodash';

import { NexoyaEvent, NexoyaMeasurement } from '../../../types/types';

import { useTranslation } from '../../../hooks/useTranslation';
import { GLOBAL_DATE_FORMAT } from '../../../utils/dates';

type ChartDataType = {
  collectionTitle: string;
  name: string;
  data: NexoyaMeasurement[];
};
export type KpisDetailChartData = {
  chartData: ChartDataType[];
  eventsWithTimeStamp: NexoyaEvent[];
  predictionsWithEvents: any[];
};
// made as a custom hook to be able to use useTranslation() hook inside
export function useKpisToKpisDetailChart(
  kpis: NexoyaMeasurement[],
  events: NexoyaEvent[],
  predictions: any[],
  showTotals: boolean,
): KpisDetailChartData {
  const { translate } = useTranslation();
  const predictionsToUse = get(predictions, showTotals ? 'valueSumUp' : 'data', []);

  const isThereEventForGivenDate = (timestamp: string) => {
    return events.some(
      (ev) => dayjs(ev.timestamp).format(GLOBAL_DATE_FORMAT) === dayjs(timestamp).format(GLOBAL_DATE_FORMAT),
    );
  };

  const eventsWithTimeStamp: NexoyaEvent[] = events.map((event: NexoyaEvent) => ({
    ...event,
    timestamp: `${event.timestamp.substring(0, 10)} 12:00`,
    eventId: event.event_id,
  }));

  const predictionsWithEvents = predictionsToUse.map((prediction) => ({
    ...prediction,
    isThereEventForGivenDate: isThereEventForGivenDate(prediction.timestamp),
  }));

  const getChartData = useCallback(() => {
    const chartData = [];
    kpis.forEach((kpi) => {
      const detailData = get(kpi, 'detail.data', []) || [];
      chartData.push({
        collectionTitle: get(kpi, 'collection.title', ''),
        name: translate(kpi.name),
        data: detailData.map((item) => ({
          ...item,
          value: item.value || 0,
          timestamp: item.timestamp.substring(0, 10),
          isThereEventForGivenDate: isThereEventForGivenDate(item.timestamp),
        })),
      });
    });
    return chartData;
  }, [events, kpis]);

  return {
    chartData: getChartData(),
    eventsWithTimeStamp,
    predictionsWithEvents,
  };
}
