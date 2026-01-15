import React from 'react';

import writeXlsxFile from 'write-excel-file';

import { NexoyaFunnelStepPerformance, NexoyaFunnelStepV2 } from 'types';

import AdSpendReportController from '../../../controllers/AdSpendReportController';
import { useTenantName } from '../../../hooks/useTenantName';
import { PerformanceProvider } from '../../../components/PerformanceTable/data-table';

interface Props {
  contentMetrics: PerformanceProvider[];
  performanceFunnelSteps: NexoyaFunnelStepPerformance[];
  portfolioTitle: string;
  duration: string;
  onDone: () => void;
  onError: (err: any) => void;
  funnelSteps: NexoyaFunnelStepV2[];
  exportType: 'daily' | 'summed';
}
function AdSpendReportDownload({
  contentMetrics,
  performanceFunnelSteps,
  portfolioTitle,
  duration,
  onDone,
  onError,
  funnelSteps,
  exportType,
}: Props) {
  const tenantName = useTenantName();
  const rawData = AdSpendReportController({
    contentMetrics,
    performanceFunnelSteps,
    portfolioTitle,
    duration,
    funnelSteps,
    exportType,
  });
  function generateXlsx() {
    try {
      // @ts-ignore
      writeXlsxFile(rawData, {
        fileName: `${tenantName}-${portfolioTitle}-${duration}.xlsx`,
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

export default AdSpendReportDownload;
