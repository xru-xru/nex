import React, { FC } from 'react';

import styled from 'styled-components';

import { NexoyaFunnelStepPredictionScore } from '../../../../../types';

import { usePortfolio } from '../../../../../context/PortfolioProvider';

import { shortenNumber } from '../../../../../utils/number';
import { extractSumOfDailyPredictionValues } from '../../../utils/utils';

import { NumberValueStyled } from '../../../../content/styles/ContentPageTableRow';

import { nexyColors } from '../../../../../theme';
import {
  FunnelStepLabelButtonStyled,
  FunnelStepTitleContainerStyled,
  LabelsStyled,
  LabelTitleStyled,
  NumbersWrapperStyled,
  PotentialWrapStyled,
  ValueTitleStyled,
} from '../styles';

interface Props {
  funnelSteps: NexoyaFunnelStepPredictionScore[];
}

const PrimaryText = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 20px;
`;

const SecondaryText = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 15px;
`;

export const PredictionLabels: FC<Props> = ({ funnelSteps }) => {
  const {
    selectedFunnelStep: { selectedFunnelStep, setSelectedFunnelStep },
  } = usePortfolio();

  return (
    <LabelsStyled>
      {funnelSteps
        ?.filter((fs) => fs.funnelStepId !== -1)
        ?.map((funnelStep) => {
          const { score } = funnelStep;
          const funnelStepId = funnelStep?.funnelStepId;
          const funnelStepSelected = selectedFunnelStep?.funnel_step_id === funnelStepId;
          const predictionVariant = score > 0 ? 'positive' : score === 0 ? 'default' : 'negative';
          const { predicted, achieved } = extractSumOfDailyPredictionValues(funnelStep.dailyPredictions);

          return (
            <FunnelStepLabelButtonStyled
              key={funnelStepId}
              active={funnelStepSelected}
              onClick={() =>
                setSelectedFunnelStep({
                  title: funnelStep?.title,
                  funnel_step_id: funnelStep.funnelStepId,
                  type: funnelStep.type,
                })
              }
            >
              <FunnelStepTitleContainerStyled style={{ marginBottom: 0 }}>
                <LabelTitleStyled>{funnelStep.title}</LabelTitleStyled>
              </FunnelStepTitleContainerStyled>
              <NumbersWrapperStyled>
                <ValueTitleStyled>
                  <PrimaryText color={nexyColors.azure}>{shortenNumber(achieved)}</PrimaryText>
                  <SecondaryText color={nexyColors.lilac}>{shortenNumber(predicted)}</SecondaryText>
                </ValueTitleStyled>
                <PotentialWrapStyled>
                  <NumberValueStyled
                    value={score.toFixed(2) as unknown as number}
                    showChangePrefix={false}
                    textWithColor
                    noValue={!score}
                    variant={predictionVariant}
                    datatype={score ? { suffix: true, symbol: '%' } : null}
                    style={{ fontSize: 24, fontWeight: 400 }}
                  />
                </PotentialWrapStyled>
              </NumbersWrapperStyled>
            </FunnelStepLabelButtonStyled>
          );
        })}
    </LabelsStyled>
  );
};
