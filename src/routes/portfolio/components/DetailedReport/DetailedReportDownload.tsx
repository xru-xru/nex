import React from 'react';

import writeXlsxFile from 'write-excel-file';

import { NexoyaFunnelStepPerformance, NexoyaValidationReportRows } from 'types';

import PerformanceReportController from 'controllers/PerformanceReportController';
import { useTenantName } from '../../../../hooks/useTenantName';

interface Props {
  data: NexoyaValidationReportRows[];
  initialFunnelSteps: NexoyaFunnelStepPerformance[];
  portfolioTitle: string;
  duration: string;
  onDone: () => void;
  onError: (err: any) => void;
}
function DetailedReportDownload({ data, initialFunnelSteps, portfolioTitle, duration, onDone, onError }: Props) {
  const tenantName = useTenantName();
  const rawData = PerformanceReportController(data, initialFunnelSteps, portfolioTitle, duration);
  function generateXlsx() {
    try {
      writeXlsxFile(rawData, {
        fileName: `Optimization details report.xlsx`,
        sheet: `${tenantName} Detailed Report`,
      }).then(onDone);
    } catch (err) {
      console.error(err);
      onError(err);
    }
  }

  React.useEffect(() => {
    generateXlsx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default DetailedReportDownload;
