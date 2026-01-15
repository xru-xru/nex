import React, { FC, useEffect, useState } from 'react';

import { NexoyaFunnelStepPredictionScore, NexoyaFunnelStepV2, NexoyaPredictionTotal } from '../../../../types';

import { FunnelSteps } from './components/FunnelSteps';
import { PredictionLabels } from './components/PredictionLabels';

import { nexyColors } from '../../../../theme';
import { TotalPredictionScore } from '../DetailedReport/Prediction/TotalPredictionScoreCard';
import { FunnelContainerStyled, FunnelStepsContainerStyled, LabelsContainerStyled } from './styles';
import { FunnelData } from './MultiSeriesFunnel';

const DEFAULT_COLOR = nexyColors.azure;

const INITIAL_DATA = {
  labels: [],
  subLabels: [],
  values: [],
  colors: [],
};

interface Props {
  totalPredictionData: NexoyaPredictionTotal;
  predictionFunnelSteps: NexoyaFunnelStepPredictionScore[];
}

export const PredictionFunnel: FC<Props> = ({ predictionFunnelSteps, totalPredictionData }) => {
  const [funnelData, setFunnelData] = useState<FunnelData>(INITIAL_DATA);

  useEffect(() => {
    const funnelData = predictionFunnelSteps?.reduce(
      (acc, step) => ({
        labels: [...acc.labels, step.title],
        subLabels: [...acc.subLabels, step.title],
        values: [...acc.values, [100]], // This represents 100% of the total, so that each funnel step is full
        colors: acc.colors,
      }),
      {
        labels: [],
        subLabels: [],
        values: [],
        colors: [DEFAULT_COLOR],
      },
    );

    setFunnelData(funnelData);
  }, [predictionFunnelSteps]);

  return (
    <div style={{ marginRight: 40 }}>
      <TotalPredictionScore totalPredictionData={totalPredictionData} />
      <FunnelContainerStyled>
        <LabelsContainerStyled>
          <PredictionLabels funnelSteps={predictionFunnelSteps} />
        </LabelsContainerStyled>
        <FunnelStepsContainerStyled>
          <FunnelSteps
            withTooltip={false}
            funnelData={funnelData}
            funnelSteps={predictionFunnelSteps as unknown as NexoyaFunnelStepV2[]}
          />
        </FunnelStepsContainerStyled>
      </FunnelContainerStyled>
    </div>
  );
};
