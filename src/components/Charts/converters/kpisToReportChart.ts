import { useCallback, useMemo } from 'react';

import { get } from 'lodash';

import { NexoyaEvent, NexoyaMeasurement, NexoyaMeasurementData } from '../../../types/types';

import { useTranslation } from '../../../hooks/useTranslation';

export function useKpisToReportChart(kpis: NexoyaMeasurement[], events: NexoyaEvent[]) {
  const { translate } = useTranslation();
  const isThereEventForGivenDate = useCallback(
    (timestamp) => {
      return events.findIndex((ev) => ev.timestamp.substring(0, 10) === timestamp.substring(0, 10)) > -1;
    },
    [events]
  );
  const eventsWithTimeStamp: NexoyaEvent[] = useMemo(
    () =>
      events.map((event: NexoyaEvent) => ({
        ...event,
        timestamp: `${event.timestamp.substring(0, 10)} 12:00`,
      })),
    [events]
  );
  const chartData = useMemo(() => {
    const kp: NexoyaMeasurementData[] = get(kpis, '[1].detail.data', []) || []; // get length of details

    const cd: any[] = new Array(kp.length); // create placeholder array

    cd.fill({}); // fill it with empty

    kpis.forEach((kpi, kpiIndex) => {
      const details = get(kpi, 'detail.data', []) || [];
      details.forEach((detail, detailIndex) => {
        cd[detailIndex] = {
          ...cd[detailIndex],
          timestamp: new Date(detail.timestamp.substring(0, 10)),
          [`report-${kpiIndex}-value`]: detail.value || 0,
          [`report-${kpiIndex}-datatype`]: kpi.datatype || {},
          [`report-${kpiIndex}-name`]: translate(get(kpi, 'collection.title', '')),
          isThereEventForGivenDate: isThereEventForGivenDate(detail.timestamp),
        };
      });
    });
    return cd;
  }, [kpis, translate, isThereEventForGivenDate]);
  return {
    chartData,
    eventsWithTimeStamp,
  };
}
