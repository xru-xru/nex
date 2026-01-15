import React from 'react';

import { get } from 'lodash';
import zipcelx from 'zipcelx';

import { NexoyaOptimizationV2, NexoyaPortfolioV2 } from 'types';

import { useTranslationsQuery } from '../../../../graphql/translation/queryTranslations';
import { OptimizationDetailsReportController } from 'controllers/OptimizationDetailsReportController';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import { format } from '../../../../utils/dates';

import ButtonAdornment from '../../../../components/ButtonAdornment';
import ButtonAsync from '../../../../components/ButtonAsync';
import ErrorMessage from '../../../../components/ErrorMessage';
import SvgXlsx from '../../../../components/icons/Xlsx';
import { useCurrencyStore } from 'store/currency-selection';

type Props = {
  portfolio: NexoyaPortfolioV2;
  optimization: NexoyaOptimizationV2;
  disabled: boolean;
  loading: boolean;
};

export function ExportAllocationXlsx({ portfolio, disabled, loading, optimization }: Props) {
  const { currency, numberFormat } = useCurrencyStore();
  const transQuery = useTranslationsQuery();
  const translations = get(transQuery, 'data.translations', []);
  const [waitingXlsx, setWaitingXlsx] = React.useState(false);
  const [error, setError] = React.useState<null | Error>(null);

  function handleDownloadXlsxError(error) {
    setWaitingXlsx(false);
    setError(error);
  }

  function generateReport() {
    setWaitingXlsx(true);
    const { reportHeader, reportContent, reportFooter } = OptimizationDetailsReportController(
      portfolio,
      optimization,
      translations,
      currency,
      numberFormat,
    );

    try {
      zipcelx({
        filename: `${portfolio.title} - Optimization - ${format(optimization.start, 'DD.MM.YYYY')} - ${format(
          optimization.end,
          'DD.MM.YYYY',
        )})`,
        extention: '.xlsx',
        sheet: {
          data: [
            // header data
            ...reportHeader, // content data
            ...reportContent, // footer total data
            ...reportFooter,
          ],
        },
      });
      track(EVENT.DOWNLOAD_OPTIMIZATION_REPORT);
      setWaitingXlsx(false);
    } catch (e) {
      handleDownloadXlsxError(e);
    }
  }

  return (
    <>
      <ButtonAsync
        variant="contained"
        onClick={generateReport}
        loading={waitingXlsx || loading}
        disabled={disabled || waitingXlsx || loading}
        color="secondary"
        id="XlsxBtn"
        style={{
          marginRight: 'auto',
        }}
        startAdornment={
          <ButtonAdornment position="start">
            <SvgXlsx />
          </ButtonAdornment>
        }
      >
        {waitingXlsx ? 'Generating' : 'Download'}
      </ButtonAsync>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}
