import React, { FC } from 'react';

import { NexoyaFunnelStepType, NexoyaPredictionTotal } from '../../../../../types';

import { usePortfolio } from '../../../../../context/PortfolioProvider';

import { track } from '../../../../../constants/datadog';
import { EVENT } from '../../../../../constants/events';

import Dialog from '../../../../../components/Dialog';
import useDialogState from '../../../../../components/Dialog/useDialogState';
import DialogTitle from '../../../../../components/DialogTitle';
import Button from 'components/Button';

import {
  DetailsDialogTitle,
  DynamicText,
  PredictionScorePercentage,
  PredictionTitle,
  ScoreDescriptionContainer,
  ShowDetailsButton,
  StepDescription,
  StepWrapper,
  StyledDialogActions,
  StyledDialogContent,
  StyledStep,
  TotalPredictionSubtitle,
  TotalPredictionWrapper,
} from '../../Funnel/styles';

interface Props {
  totalPredictionData: NexoyaPredictionTotal;
}
export const TotalPredictionScore: FC<Props> = ({ totalPredictionData }) => {
  const { isOpen, closeDialog, openDialog } = useDialogState({
    initialState: false,
  });
  const {
    selectedFunnelStep: { selectedFunnelStep, setSelectedFunnelStep },
    predictionChart: { activePredictionChart },
    portfolioV2Info: {
      funnelSteps: { data: funnelSteps },
    },
  } = usePortfolio();

  const awarenessFunnelStep = funnelSteps?.find(
    (funnelStep) => funnelStep?.funnelStep?.type === NexoyaFunnelStepType.Awareness,
  );

  return (
    <React.Fragment>
      <TotalPredictionWrapper
        disabled={activePredictionChart === 'achieved-predicted'}
        onClick={() => {
          if (activePredictionChart === 'achieved-predicted') {
            return;
          }
          setSelectedFunnelStep({ funnel_step_id: -1, title: 'Total', type: NexoyaFunnelStepType.Other });
        }}
        active={selectedFunnelStep?.funnel_step_id === -1}
      >
        <div style={{ display: 'flex' }}>
          <PredictionTitle>Total prediction accuracy</PredictionTitle>
        </div>
        <PredictionScorePercentage>{totalPredictionData?.score?.toFixed(2)}%</PredictionScorePercentage>
        <ScoreDescriptionContainer>
          <TotalPredictionSubtitle>
            Average value between prediction accuracies for each funnel step for your selected time period.
          </TotalPredictionSubtitle>
          <ShowDetailsButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openDialog();
              track(EVENT.VALIDATION_SHOW_DETAILS);
            }}
          >
            Show details
          </ShowDetailsButton>
        </ScoreDescriptionContainer>
      </TotalPredictionWrapper>
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        paperProps={{
          style: {
            width: 639,
            textAlign: 'center',
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-cy="deleteDialog"
      >
        <DialogTitle>
          <DetailsDialogTitle>How do we calculate the total prediction accuracy?</DetailsDialogTitle>
        </DialogTitle>
        <StyledDialogContent>
          <StepWrapper>
            <StyledStep>1</StyledStep>
            <StepDescription>
              We compare the achieved and predicted values for each funnel step for your selected time period.
              <br />
              <br />
              <DynamicText>
                For example: achieved {awarenessFunnelStep?.funnelStep?.title} and predicted{' '}
                {awarenessFunnelStep?.funnelStep?.title}.
              </DynamicText>
            </StepDescription>
          </StepWrapper>
          <StepWrapper>
            <StyledStep>2</StyledStep>
            <StepDescription>
              We calculate the prediction accuracy for each funnel step as the percentage ratio between achieved and
              predicted value.
              <br />
              <br />
              <DynamicText>
                For example: if the achieved and predicted values were exactly the same, the prediction accuracy would
                be 100%.
              </DynamicText>
            </StepDescription>
          </StepWrapper>
          <StepWrapper>
            <StyledStep>3</StyledStep>
            <StepDescription>
              We calculate the total prediction accuracy as the average value between the prediction accuracies for each
              funnel step.
            </StepDescription>
          </StepWrapper>
        </StyledDialogContent>
        <StyledDialogActions variant="primary">
          <Button onClick={closeDialog} variant="contained" color="primary">
            OK
          </Button>
        </StyledDialogActions>
      </Dialog>
    </React.Fragment>
  );
};
