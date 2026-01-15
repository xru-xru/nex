import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { NumberParam, StringParam, useQueryParams } from 'use-query-params';

import {
  NexoyaFunnelStepPredictionScore,
  NexoyaFunnelStepType,
  NexoyaFunnelStepV2,
  NexoyaPredictionTotal,
} from '../../types';

import { usePortfolio, ValidationChartType } from '../../context/PortfolioProvider';
import { useFunnelStepsV2Query } from '../../graphql/funnelSteps/queryFunnelSteps';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import { PORTFOLIO_FEATURE_FLAGS } from '../../constants/featureFlags';

import ButtonAdornment from '../../components/ButtonAdornment';
import ButtonAsync from '../../components/ButtonAsync';
import MultipleSwitch from '../../components/MultipleSwitchFluid';
import PortfolioFeatureSwitch from '../../components/PortfolioFeatureSwitch';
import SvgDownload from '../../components/icons/Download';
import SvgGauge from '../../components/icons/Gauge';
import { PredictedVsAchievedChart } from './components/DetailedReport/PredictedVsAchievedChart';
import { PredictionThresholdsChart } from './components/DetailedReport/Prediction/PredictionThresholdsChart';
import { ValidationSkeleton } from './components/DetailedReport/Prediction/ValidationSkeleton';
import { PredictionTimelineChart } from './components/DetailedReport/PredictionTimelineChart';
import { WhatIfValidation } from './components/DetailedReport/WhatIfValidation';
import { PredictionFunnel } from './components/Funnel/PredictionFunnel';
import { EmptyChartMessage } from './components/Funnel/styles';
import FunnelStepsDropdown from './components/FunnelStepsDropdown';

import NoDataFound from './NoDataFound';
import { usePredictionQuery } from '../../graphql/prediction/queryPrediction';
import { fillDailyPredictions, fillDailyPredictionTotal, getDateRange } from './utils/validation';
import { useCurrencyStore } from 'store/currency-selection';
import useUserStore from '../../store/user';

type Props = {
  portfolioId: number;
  dateFrom: Date;
  dateTo: Date;
};

export const VALIDATION_CHART_SECTIONS = [
  {
    id: 'time-based' as ValidationChartType,
    text: 'Time-based',
  },
  {
    id: 'achieved-predicted' as ValidationChartType,
    text: 'Achieved / Predicted',
  },
  {
    id: 'prediction-timeline' as ValidationChartType,
    text: 'Prediction timeline',
  },

  {
    id: 'prediction-details' as ValidationChartType,
    text: 'Prediction details',
  },
];

const getRenderConditions = ({ activePredictionChart, predictionFunnelSteps }) => {
  const showPredictionFunnel = ['prediction-details', 'achieved-predicted', 'prediction-timeline'].includes(
    activePredictionChart,
  );
  const showPredictionDetails = activePredictionChart === 'prediction-details';
  const showAchievedPredicted = activePredictionChart === 'achieved-predicted';
  const showPredictionTimeline = activePredictionChart === 'prediction-timeline';
  const showTimeBasedValidation = activePredictionChart === 'time-based';
  const hasPredictionData = predictionFunnelSteps?.length;

  return {
    showPredictionFunnel,
    showPredictionDetails,
    showAchievedPredicted,
    showPredictionTimeline,
    showTimeBasedValidation,
    hasPredictionData,
  };
};

export const Validation = ({ portfolioId, dateFrom, dateTo }: Props) => {
  const [download, setDownload] = useState<boolean>(false);
  const [predictionFunnelSteps, setPredictionFunnelSteps] = useState<NexoyaFunnelStepPredictionScore[]>([]);
  const [totalPrediction, setTotalPrediction] = useState<NexoyaPredictionTotal>();
  const [queryParams, setQueryParams] = useQueryParams({
    fs: NumberParam,
    dateFrom: StringParam,
    dateTo: StringParam,
  });
  const {
    selectedFunnelStep: { selectedFunnelStep: partialSelectedFunnelStep, setSelectedFunnelStep },
    predictionChart: { setActivePredictionChart, activePredictionChart },
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const { loading: predictionLoading } = usePredictionQuery({
    portfolioId,
    start: queryParams?.dateFrom,
    end: queryParams?.dateTo,
    onCompleted: (data) => {
      const predictionFunnelSteps = data?.portfolioV2?.prediction?.funnelSteps;
      const dateRange = getDateRange(dateFrom, dateTo);

      const predictionFunnelStepsWithFilled = predictionFunnelSteps.map(
        (funnelStep: NexoyaFunnelStepPredictionScore) => ({
          ...funnelStep,
          dailyPredictions: fillDailyPredictions(funnelStep, dateRange),
        }),
      );

      setPredictionFunnelSteps(predictionFunnelStepsWithFilled);

      const { dailyPredictionTotal } = data.portfolioV2.prediction.total;
      const filledDailyPredictionTotal = fillDailyPredictionTotal(dailyPredictionTotal, dateRange);

      setTotalPrediction({
        ...data.portfolioV2.prediction.total,
        dailyPredictionTotal: filledDailyPredictionTotal,
      });
    },
  });

  const { data: funnelStepsData } = useFunnelStepsV2Query({
    portfolioId,
  });

  const isTotalSelected = partialSelectedFunnelStep?.funnel_step_id === -1;
  const { numberFormat } = useCurrencyStore();
  const { isSupportUser } = useUserStore();

  useEffect(() => {
    if (activePredictionChart === 'achieved-predicted' && isTotalSelected) {
      const firstFunnelStep = globalFunnelSteps[globalFunnelSteps.length - 1];
      setSelectedFunnelStep({
        title: firstFunnelStep?.title,
        funnel_step_id: firstFunnelStep.funnelStepId,
        type: firstFunnelStep.type,
      });
    }
  }, [activePredictionChart, isTotalSelected]);

  const onFunnelStepChange = useCallback(
    (funnelStep: NexoyaFunnelStepV2) => {
      setSelectedFunnelStep({
        title: funnelStep?.title,
        funnel_step_id: funnelStep.funnelStepId,
        type: funnelStep.type,
      });
      setQueryParams({ fs: funnelStep?.funnelStepId });
    },
    [setQueryParams, setSelectedFunnelStep],
  );

  const hasPortfolioWhatIfFeature = portfolioMeta?.featureFlags.some(
    (featureFlag) => PORTFOLIO_FEATURE_FLAGS.WHAT_IF_VALIDATION === featureFlag.name && featureFlag.status,
  );

  const globalFunnelSteps: NexoyaFunnelStepV2[] = funnelStepsData?.portfolioV2?.funnelSteps;
  const selectedFunnelStep = globalFunnelSteps?.find(
    (fs) => fs?.funnelStepId === partialSelectedFunnelStep?.funnel_step_id,
  );
  const selectedPredictionFunnelStep = useMemo(
    () => predictionFunnelSteps?.find((fs) => fs?.funnelStepId === partialSelectedFunnelStep?.funnel_step_id),
    [partialSelectedFunnelStep],
  );

  const {
    showAchievedPredicted,
    showPredictionDetails,
    showPredictionFunnel,
    showPredictionTimeline,
    showTimeBasedValidation,
    hasPredictionData,
  } = getRenderConditions({
    activePredictionChart,
    predictionFunnelSteps,
  });

  useEffect(() => {
    if (activePredictionChart === 'time-based' && !hasPortfolioWhatIfFeature) {
      setActivePredictionChart('achieved-predicted');
    }
  }, [hasPortfolioWhatIfFeature]);

  useEffect(() => {
    if (isSupportUser && !hasPortfolioWhatIfFeature) {
      toast.message(
        'What-if validation is not enabled for this portfolio, but you can view it because you are a support user.',
      );
    }
  }, [isSupportUser, hasPortfolioWhatIfFeature]);

  useEffect(() => {
    if (globalFunnelSteps?.length) {
      let targetFunnelStepId = null;
      if (queryParams.fs) {
        targetFunnelStepId = globalFunnelSteps.some(
          (fs) => fs.type !== NexoyaFunnelStepType.Cost && fs.funnelStepId === queryParams.fs,
        )
          ? queryParams.fs
          : null;
      }

      if (!targetFunnelStepId) {
        targetFunnelStepId = portfolioMeta?.defaultOptimizationTarget?.funnelStepId;
      }

      const targetFunnelStep = globalFunnelSteps?.length
        ? globalFunnelSteps?.find((fs) => fs.funnelStepId === targetFunnelStepId) ||
          globalFunnelSteps[globalFunnelSteps.length - 1]
        : { title: '', funnelStepId: '', type: NexoyaFunnelStepType.Other };

      setSelectedFunnelStep({
        title: targetFunnelStep?.title,
        funnel_step_id: targetFunnelStep.funnelStepId,
        type: targetFunnelStep.type,
      });

      setQueryParams({ fs: targetFunnelStep?.funnelStepId as number });
    }
  }, [globalFunnelSteps, queryParams, portfolioId, predictionFunnelSteps]);

  const handleSwitchToggle = (value) => {
    setActivePredictionChart(value);
    track(EVENT.VALIDATION_SWITCH_VIEW(VALIDATION_CHART_SECTIONS.find((v) => v.id === value).text));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <PortfolioFeatureSwitch
          bypass={isSupportUser}
          features={[PORTFOLIO_FEATURE_FLAGS.WHAT_IF_VALIDATION]}
          renderNew={() => {
            return (
              <MultipleSwitch
                style={{ marginBottom: 24 }}
                current={activePredictionChart}
                sections={VALIDATION_CHART_SECTIONS}
                initial={activePredictionChart}
                onToggle={handleSwitchToggle}
              />
            );
          }}
          renderOld={() => (
            <MultipleSwitch
              style={{ marginBottom: 24 }}
              current={activePredictionChart}
              sections={VALIDATION_CHART_SECTIONS.slice(1)}
              initial={activePredictionChart}
              onToggle={handleSwitchToggle}
            />
          )}
        />

        {activePredictionChart === 'time-based' ? (
          <div>
            <FunnelStepsDropdown initial={selectedFunnelStep} data={globalFunnelSteps} onChange={onFunnelStepChange} />
            <ButtonAsync
              size="small"
              variant="contained"
              loading={predictionLoading || download}
              color="primary"
              disabled={predictionLoading || download}
              onClick={() => {
                setDownload(true);
                track(EVENT.VALIDATION_DOWNLOAD_XLSX, {
                  portfolioId,
                });
              }}
              startAdornment={
                <ButtonAdornment position="start">
                  <SvgDownload />
                </ButtonAdornment>
              }
              style={{
                marginLeft: '8px',
              }}
            >
              Download report
            </ButtonAsync>
          </div>
        ) : null}
      </div>

      {predictionLoading && activePredictionChart !== 'time-based' ? (
        <ValidationSkeleton />
      ) : (
        <div style={{ display: 'flex' }}>
          {showPredictionFunnel ? (
            hasPredictionData ? (
              <PredictionFunnel totalPredictionData={totalPrediction} predictionFunnelSteps={predictionFunnelSteps} />
            ) : null
          ) : null}
          {showPredictionDetails ? (
            hasPredictionData ? (
              <PredictionThresholdsChart
                selectedFunnelStepId={partialSelectedFunnelStep?.funnel_step_id}
                totalPredictionData={totalPrediction}
                predictionFunnelSteps={predictionFunnelSteps}
                dateFrom={dateFrom}
                dateTo={dateTo}
              />
            ) : (
              <NoDataFound
                icon={<SvgGauge />}
                title="There is no optimization within the selected time period"
                subtitle="Please select alternative dates from the date picker to view the optimization performance"
              />
            )
          ) : null}
          {showAchievedPredicted ? (
            !isTotalSelected ? (
              hasPredictionData ? (
                <PredictedVsAchievedChart data={selectedPredictionFunnelStep?.dailyPredictions} />
              ) : (
                <NoDataFound
                  icon={<SvgGauge />}
                  title="There is no optimization within the selected time period"
                  subtitle="Please select alternative dates from the date picker to view the optimization performance"
                />
              )
            ) : (
              <EmptyChartMessage>
                Select a funnel step from the funnel above to show achieved and predicted values.
              </EmptyChartMessage>
            )
          ) : null}
          {showPredictionTimeline ? (
            hasPredictionData ? (
              <PredictionTimelineChart
                data={
                  isTotalSelected
                    ? totalPrediction?.dailyPredictionTotal
                    : selectedPredictionFunnelStep?.dailyPredictions
                }
              />
            ) : (
              <NoDataFound
                icon={<SvgGauge />}
                title="There is no optimization within the selected time period"
                subtitle="Please select alternative dates from the date picker to view the optimization performance"
              />
            )
          ) : null}
          <PortfolioFeatureSwitch
            bypass={isSupportUser}
            features={[PORTFOLIO_FEATURE_FLAGS.WHAT_IF_VALIDATION]}
            renderNew={() =>
              showTimeBasedValidation ? (
                <WhatIfValidation
                  portfolioId={portfolioId}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  portfolioTitle={portfolioMeta?.title}
                  numberFormat={numberFormat}
                  download={download}
                  setDownload={setDownload}
                  funnelStepId={
                    partialSelectedFunnelStep?.funnel_step_id || portfolioMeta?.defaultOptimizationTarget?.funnelStepId
                  }
                  funnelSteps={globalFunnelSteps}
                  selectedFunnelStep={selectedFunnelStep}
                  portfolioName={portfolioMeta?.title}
                  showDetailsTable
                />
              ) : null
            }
            renderOld={() => null}
          />
        </div>
      )}
    </>
  );
};
