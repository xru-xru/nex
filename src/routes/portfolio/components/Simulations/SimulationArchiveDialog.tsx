import React from 'react';

import dayjs from 'dayjs';

import { NexoyaLocalSimulationInput } from '../../../../controllers/SimulationController';

import ButtonAsync from '../../../../components/ButtonAsync';
import NumberValue from '../../../../components/NumberValue';
import Dialog from 'components/Dialog';
import Fade from 'components/Fade';
import Typography from 'components/Typography';

import { nexyColors } from '../../../../theme';
import {
  ItemOverviewContainer,
  Separator,
  SpaceBetween,
  StyledTypography,
  StyledTypographyConfirmation,
  SuccessDialogActions,
  SuccessDialogContent,
} from './styles';
import SvgInfo from '../../../../components/icons/Info';

type Props = {
  simulation: NexoyaLocalSimulationInput & { scenarios: number; isArchived?: boolean };
  isOpen: any;
  onClose: any;
  onArchiveSimulation: () => void;
  onGoBack: () => void;
  loading: boolean;
};

function SimulationArchiveDialog({ simulation, isOpen, onClose, onArchiveSimulation, onGoBack, loading }: Props) {
  const isArchived = simulation.isArchived;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-cy="portfolioSuccessDialog"
      paperProps={{
        style: {
          width: 482,
        },
      }}
    >
      <Fade in={isOpen} onExited={onClose} delay={350}>
        <div>
          <div style={{ padding: '20px 24px' }}>
            <SuccessDialogContent data-cy="portfolioSuccessContent">
              <Typography
                variant="h3"
                withEllipsis={false}
                style={{
                  textAlign: 'left',
                }}
              >
                Do you want to {isArchived ? 'unarchive' : 'archive'} the simulation?
              </Typography>
            </SuccessDialogContent>
          </div>
          <Separator />
          <StyledTypographyConfirmation withEllipsis={false}>
            You will {isArchived ? 'unarchive' : 'archive'} the{' '}
            <span style={{ color: nexyColors.orangeyRed }}>{simulation.name}</span> simulation in the simulations table.
          </StyledTypographyConfirmation>

          <div>
            <ItemOverviewContainer>
              <SpaceBetween>
                <StyledTypography variant="subtitle">Simulation name:</StyledTypography>
                <StyledTypography
                  variant="subtitle"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  {simulation?.name}
                </StyledTypography>
              </SpaceBetween>
              <SpaceBetween>
                <StyledTypography variant="subtitle">Timeframe:</StyledTypography>
                <StyledTypography
                  variant="subtitle"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  {dayjs(simulation.start).format('D MMM')} - {dayjs(simulation.end).utc().format('DD MMM YYYY')}
                </StyledTypography>
              </SpaceBetween>
              <SpaceBetween>
                <StyledTypography variant="subtitle">Scenarios:</StyledTypography>
                <StyledTypography
                  variant="subtitle"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  {simulation.scenarios} scenarios
                </StyledTypography>
              </SpaceBetween>
              <SpaceBetween>
                <StyledTypography variant="subtitle">Budget range:</StyledTypography>
                <StyledTypography
                  variant="subtitle"
                  style={{
                    fontWeight: 500,
                    display: 'flex',
                    gap: 4,
                  }}
                >
                  <NumberValue value={simulation.min} numberFormatProp="en-US" /> -
                  <NumberValue value={simulation.max} numberFormatProp="en-US" />
                </StyledTypography>
              </SpaceBetween>
              <SpaceBetween>
                <StyledTypography variant="subtitle">Budget steps:</StyledTypography>
                <StyledTypography
                  variant="subtitle"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  <NumberValue value={simulation.budgetStepSize} numberFormatProp="en-US" />
                </StyledTypography>
              </SpaceBetween>
            </ItemOverviewContainer>
          </div>
        </div>
      </Fade>
      <Fade in={isOpen} onExited={onClose} delay={500}>
        <ItemOverviewContainer style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <SvgInfo style={{ color: nexyColors.coolGray, width: 16, height: 16 }} />
          <StyledTypography withEllipsis={false}>Note: Archived simulations won't be deleted.</StyledTypography>
        </ItemOverviewContainer>
      </Fade>
      <Separator />
      <Fade in={isOpen} onExited={onClose} delay={600}>
        <SuccessDialogActions>
          <ButtonAsync
            loading={loading}
            disabled={loading}
            onClick={onArchiveSimulation}
            color="danger"
            variant="contained"
            autoFocus
          >
            {isArchived ? 'Unarchive simulation' : 'Archive simulation'}
          </ButtonAsync>
          <ButtonAsync
            loading={loading}
            disabled={loading}
            style={{ padding: '12px 24px' }}
            onClick={onGoBack}
            variant="text"
            autoFocus
          >
            Go back
          </ButtonAsync>
        </SuccessDialogActions>
      </Fade>
    </Dialog>
  );
}

export default SimulationArchiveDialog;
