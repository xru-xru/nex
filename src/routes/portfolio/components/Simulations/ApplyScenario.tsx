import React, { useRef } from 'react';
import { useRouteMatch } from 'react-router';

import dayjs from 'dayjs';
import { toast } from 'sonner';

import { NexoyaScenarioTotalBudget } from '../../../../types';

import { useApplyScenarioMutation } from '../../../../graphql/simulation/mutationApplyScenario';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import { useRandomEmoji } from '../../../../hooks/useRandomEmoji';
import { ParticleContainerStyled, particles } from '../../../../utils/particles';
import { useTenantName } from '../../../../hooks/useTenantName';

import Button from '../../../../components/Button';
import ButtonAsync from '../../../../components/ButtonAsync';
import Dialog, { useDialogState } from '../../../../components/Dialog';
import Fade from '../../../../components/Fade';
import FormattedCurrency from '../../../../components/FormattedCurrency';
import Typography from '../../../../components/Typography';

import {
  ItemOverviewContainer,
  Separator,
  SpaceBetween,
  StyledTypography,
  StyledTypographyConfirmation,
  SuccessDialogActions,
  SuccessDialogContent,
} from './styles';

export const ApplyScenario = ({
  scenarioId,
  start,
  end,
  budget,
  simulationId,
  isApplied,
}: {
  scenarioId: number;
  start: Date;
  end: Date;
  budget: NexoyaScenarioTotalBudget;
  simulationId: number;
  isApplied: boolean;
}) => {
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const elementRef = useRef(null);
  const isExpired = dayjs().isAfter(dayjs(end));
  const tenantName = useTenantName();

  const { isOpen, openDialog, closeDialog } = useDialogState();

  const { applyScenario, loading } = useApplyScenarioMutation({
    portfolioId,
    simulationId,
    scenarioId,
  });

  const emoji = useRandomEmoji();

  const createParticlesAtCorner = particles({ particle: emoji, elementRef });

  const handleApplyScenario = () => {
    applyScenario()
      .then(() => {
        createParticlesAtCorner('top-left');
        createParticlesAtCorner('top-right');
        createParticlesAtCorner('bottom-left');
        createParticlesAtCorner('bottom-right');
        createParticlesAtCorner('middle-top');
        createParticlesAtCorner('middle-bottom');
        createParticlesAtCorner('middle-left');
        createParticlesAtCorner('middle-right');

        setTimeout(() => {
          closeDialog();
          track(EVENT.SIMULATION_APPLY_SCENARIO, {
            portfolioId,
            scenarioId,
            start,
            changePercentTotal: budget.changePercentTotal,
            budget: budget.currentScenarioTotal,
          });
          toast.message('Lean back!', {
            duration: 5000,
            description: 'We’ll let you know as soon as the scenario has been applied.',
          });
        }, 1000);
      })
      .catch(() => {
        toast.error('Failed to apply scenario');
      });
  };
  return (
    <>
      <Button
        disabled={isApplied || isExpired}
        onClick={openDialog}
        variant="contained"
        color={isApplied ? 'tertiary' : 'secondary'}
      >
        {isApplied ? 'Scenario applied' : 'Apply this scenario'}
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-cy="portfolioSuccessDialog"
        paperProps={{
          style: {
            width: 482,
          },
        }}
      >
        <ParticleContainerStyled ref={elementRef}>
          <Fade in={isOpen} onExited={closeDialog} delay={350}>
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
                    Apply scenario
                  </Typography>
                </SuccessDialogContent>
              </div>
              <Separator />
              <StyledTypographyConfirmation withEllipsis={false}>
                {tenantName} will replace the existing budget and apply the new budget for the timeframe{' '}
                {dayjs(start).format('MMM DD')} - {dayjs(end).format('MMM DD, YYYY')}
              </StyledTypographyConfirmation>

              <div>
                <ItemOverviewContainer>
                  <SpaceBetween>
                    <StyledTypography variant="subtitle">Timeframe:</StyledTypography>
                    <StyledTypography
                      variant="subtitle"
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      {dayjs(start).format('MMM DD')} - {dayjs(end).format('MMM DD, YYYY')}
                    </StyledTypography>
                  </SpaceBetween>
                  <SpaceBetween>
                    <StyledTypography variant="subtitle">Existing budget:</StyledTypography>
                    <StyledTypography
                      variant="subtitle"
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      <FormattedCurrency amount={budget?.baseScenarioTotal} />
                    </StyledTypography>
                  </SpaceBetween>
                  <SpaceBetween>
                    <StyledTypography variant="subtitle">New budget:</StyledTypography>
                    <StyledTypography
                      variant="subtitle"
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      <FormattedCurrency amount={budget?.currentScenarioTotal} />
                    </StyledTypography>
                  </SpaceBetween>
                </ItemOverviewContainer>
              </div>
            </div>
          </Fade>

          <Separator style={{ marginTop: 21 }} />
          <Fade in={isOpen} onExited={closeDialog} delay={500}>
            <SuccessDialogActions style={{ flexDirection: 'row' }}>
              <ButtonAsync
                loading={loading}
                disabled={loading}
                style={{ padding: '12px 24px', width: '100%' }}
                onClick={closeDialog}
                variant="contained"
                autoFocus
              >
                Cancel
              </ButtonAsync>
              <ButtonAsync
                style={{ width: '100%' }}
                loading={loading}
                disabled={loading}
                onClick={handleApplyScenario}
                color="primary"
                variant="contained"
                autoFocus
              >
                Apply scenario
              </ButtonAsync>
            </SuccessDialogActions>
          </Fade>
        </ParticleContainerStyled>
      </Dialog>
    </>
  );
};
