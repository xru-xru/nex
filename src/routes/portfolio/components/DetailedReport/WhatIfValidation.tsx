import { LogoIcon } from '../../../../components/Logo';
import Typography from '../../../../components/Typography';
import SvgGauge from '../../../../components/icons/Gauge';

import * as Styles from '../../styles/OptimizationProposal';

import NoDataFound from '../../NoDataFound';
import WhatIfValidationChart from './DetailedReportPerformanceChart';
import WhatIfValidationTable from './DetailedReportPerformanceTable';
import { useValidationQuery } from '../../../../graphql/portfolio/queryValidation';
import {
  NexoyaFunnelStepPerformance,
  NexoyaValidationPerformance,
  NexoyaValidationReportRows,
} from '../../../../types';
import React, { Suspense } from 'react';
import DetailedReportDownload from './DetailedReportDownload';
import { getFormattedDateSelector } from '../../../../utils/dates';
import { toast } from 'sonner';

export const WhatIfValidation = ({
  portfolioName,
  showDetailsTable,
  funnelSteps = [],
  funnelStepId,
  portfolioId,
  dateFrom,
  dateTo,
  download,
  setDownload,
  portfolioTitle,
  numberFormat,
  selectedFunnelStep = null,
}) => {
  const { data, loading } = useValidationQuery({
    portfolioId,
    dateFrom,
    dateTo,
    skip: !funnelStepId,
    funnelStepId,
  });

  const validation = data?.validation?.validation;
  const validationReport: NexoyaValidationReportRows[] = validation?.validationReport || [];
  const validationPerformance: NexoyaValidationPerformance[] = validation?.validationPerformance || [];

  return (
    <div style={{ width: '100%' }}>
      {loading ? (
        <Styles.LoadingWrapStyled style={{ marginTop: 40 }}>
          <LogoIcon infinite={true} duration={1500} />
          <Styles.LoadingContent>
            <Typography variant="h1">Getting everything ready...</Typography>
            <Typography variant="h5">It might take up to a minute to load your detailed performance report.</Typography>
          </Styles.LoadingContent>
        </Styles.LoadingWrapStyled>
      ) : validationPerformance.length !== 0 ? (
        <>
          <Styles.FunnelStepsDropdown>
            <Styles.SubtitleStyled>Performance per funnel step</Styles.SubtitleStyled>
          </Styles.FunnelStepsDropdown>
          {showDetailsTable ? (
            <WhatIfValidationTable
              funnelSteps={funnelSteps}
              data={validationPerformance}
              activeFunnelStepId={selectedFunnelStep?.funnel_step_id}
              showOptimized={false}
            />
          ) : null}
          <Styles.PerformanceWrapper>
            <WhatIfValidationChart
              data={validationPerformance}
              targetFunnelStepId={selectedFunnelStep?.funnelStepId}
              showOptimized={false}
              portfolioName={portfolioName}
            />
          </Styles.PerformanceWrapper>
        </>
      ) : (
        <NoDataFound
          icon={<SvgGauge />}
          title="There is no optimization within the selected time period"
          subtitle="Please select alternative dates from the date picker to view the optimization performance"
        />
      )}
      {download ? (
        <Suspense fallback={null}>
          <DetailedReportDownload
            data={validationReport}
            initialFunnelSteps={funnelSteps as unknown as NexoyaFunnelStepPerformance[]}
            portfolioTitle={portfolioTitle}
            // @ts-ignore
            duration={getFormattedDateSelector({ dateFrom, dateTo }, numberFormat)}
            onDone={() => setDownload(false)}
            onError={(err) => {
              setDownload(false);
              console.error(err);
              toast.error('Something went wrong while downloading the report');
            }}
          />
        </Suspense>
      ) : null}
    </div>
  );
};
