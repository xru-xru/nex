import React from 'react';

import dayjs from 'dayjs';

import { NexoyaLocalSimulationInput } from '../../../../controllers/SimulationController';

import ButtonAsync from '../../../../components/ButtonAsync';
import NumberValue from '../../../../components/NumberValue';
import SvgInfoCircle from '../../../../components/icons/InfoCircle';
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
import { FEATURE_FLAGS } from '../../../../constants/featureFlags';
import SvgWarningTwo from '../../../../components/icons/WarningTwo';
import FeatureSwitch from '../../../../components/FeatureSwitch';
import { useCurrencyExchangeTimeframesQuery } from '../../../../graphql/currency/queryCurrencyExchangeTimeframes';
import { useCurrencyStore } from '../../../../store/currency-selection';
import { Link } from 'react-router-dom';

type Props = {
  simulation: NexoyaLocalSimulationInput & { scenarios: number };
  isOpen: any;
  onClose: any;
  onSaveForLater: () => void;
  onStartSimulation: () => void;
  onGoBack: () => void;
  loading: boolean;
};

function SimulationReviewCreateDialog({
  simulation,
  isOpen,
  onClose,
  onSaveForLater,
  onStartSimulation,
  onGoBack,
  loading,
}: Props) {
  useCurrencyExchangeTimeframesQuery();
  const { missingCurrencyCoverage } = useCurrencyStore();

  const customScenariosLength = simulation.scenariosInput?.budgets?.filter((s) => s.isCustomScenario)?.length;
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
                Review and start simulation
              </Typography>
            </SuccessDialogContent>
          </div>
          <Separator />
          <StyledTypographyConfirmation>
            We will run a budgets simulation with the following settings:
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
              <Separator />
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
                  {simulation.min} - {simulation.max}
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
              {customScenariosLength ? (
                <>
                  <Separator />
                  <SpaceBetween>
                    <StyledTypography variant="subtitle">Manually added scenarios:</StyledTypography>
                    <StyledTypography
                      variant="subtitle"
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      <NumberValue value={customScenariosLength} numberFormatProp="en-US" />
                    </StyledTypography>
                  </SpaceBetween>
                  <SpaceBetween>
                    <StyledTypography variant="subtitle">Values:</StyledTypography>
                    <div className="font flex-end flex flex-row flex-wrap gap-2 text-sm font-normal text-neutral-400">
                      {simulation.scenariosInput?.budgets
                        ?.filter((s) => s.isCustomScenario)
                        ?.map((s) => (
                          <>
                            <NumberValue key={s.budget} value={s.budget} numberFormatProp="en-US" />
                          </>
                        ))}
                    </div>
                  </SpaceBetween>
                </>
              ) : null}
            </ItemOverviewContainer>
          </div>
        </div>
      </Fade>
      <Fade in={isOpen} onExited={onClose} delay={500}>
        <div>
          <ItemOverviewContainer style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <SvgInfoCircle style={{ color: nexyColors.coolGray, width: 16, height: 16 }} />
            <StyledTypography withEllipsis={false}>
              We will notify you when the simulation is ready to explore.
            </StyledTypography>
          </ItemOverviewContainer>
          {missingCurrencyCoverage && (
            <div className="mx-6 mb-5 flex items-center gap-1.5 rounded-[5px] border border-[#eaeaea] bg-neutral-50 p-2 font-normal">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <SvgWarningTwo
                    warningCircleColor="#FCF1BA"
                    warningColor="#F5CF0F"
                    style={{ height: 16, width: 16 }}
                  />
                  <div className="text-md font-medium text-neutral-800">
                    Update currency rates before launching simulation
                  </div>
                </div>
                <p className="text-neutral-600">
                  Please update all currency rates in the{' '}
                  <Link
                    to="/settings?tab=currencies"
                    className="cursor-pointer text-[14px] font-medium leading-[150%] tracking-[0.36px] text-purple-400 underline"
                  >
                    Team Settings page
                  </Link>{' '}
                  to be able to start the simulation.
                </p>
              </div>
            </div>
          )}
        </div>
      </Fade>
      <Separator />
      <Fade in={isOpen} onExited={onClose} delay={600}>
        <SuccessDialogActions>
          {onSaveForLater ? (
            <ButtonAsync
              loading={loading}
              disabled={loading}
              onClick={onSaveForLater}
              variant="contained"
              id="portfolioCreateAnother"
            >
              Save for later
            </ButtonAsync>
          ) : null}
          <ButtonAsync
            loading={loading}
            disabled={loading}
            onClick={onStartSimulation}
            color="primary"
            variant="contained"
            autoFocus
          >
            Start simulation
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

export default SimulationReviewCreateDialog;
