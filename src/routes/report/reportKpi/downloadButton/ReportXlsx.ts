import React from 'react';

import { get } from 'lodash';
import zipcelx from 'zipcelx';

import { NexoyaReport } from '../../../../types/types';
import '../../../../types/types';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import { useTranslation } from '../../../../hooks/useTranslation';
import { formatNumber, formatShortDate } from '../../../../utils/formater';

type Props = {
  report: NexoyaReport;
  onDone: () => void;
  onError: (error: Error) => void;
};

function ReportXlsx({ report, onDone, onError }: Props) {
  const { translate } = useTranslation();
  function generateXlsx() {
    try {
      zipcelx({
        filename: report.name,
        sheet: {
          data: [
            [
              {
                value: 'KPI',
                type: 'string',
              },
              {
                value: 'Provider',
                type: 'string',
              },
              ...get(report, 'kpis[0].detail.data', []).map((point) => ({
                value: formatShortDate(point.timestamp),
                type: 'string',
              })),
            ],
            ...report.kpis.map((kpi) => {
              const parentCollection = get(kpi, 'collection.parent_collection', null);
              return [
                {
                  value: `${translate(kpi.name)} - ${
                    parentCollection ? translate(parentCollection.title) + ' - ' : ''
                  } ${translate(get(kpi, 'collection.title', ''))}`,
                  type: 'string',
                },
                {
                  value: `${translate(get(kpi, 'provider.name', ''))}`,
                  type: 'string',
                },
                ...get(kpi, 'detail.data', []).map((point) => {
                  const isDollar = get(kpi, 'datatype.symbol', '') === '$';
                  const symbolBefore = isDollar ? '$ ' : '';
                  const symbolAfter = isDollar ? '' : ` ${get(kpi, 'datatype.symbol', '')}`;
                  return {
                    value: `${symbolBefore}${formatNumber(Math.round(point.value * 100) / 100)}${symbolAfter}`,
                    type: 'string',
                  };
                }),
              ];
            }),
          ],
        },
      });
      onDone();
    } catch (err) {
      onError(err);
    }
  }

  React.useEffect(() => {
    track(EVENT.REPORT_DOWNLOAD_XLSX);
    generateXlsx(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default ReportXlsx;
