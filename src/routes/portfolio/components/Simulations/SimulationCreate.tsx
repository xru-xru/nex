import React from 'react';

import dayjs from 'dayjs';
import { toNumber } from 'lodash';
import { toast } from 'sonner';

import { useSimulation, withSimulationProvider } from '../../../../context/SimulationProvider';
import { useTeam } from '../../../../context/TeamProvider';
import { useCreateSimulationMutation } from '../../../../graphql/simulation/mutationCreateSimulation';
import { useRunSimulationMutation } from '../../../../graphql/simulation/mutationRunSimulation';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import { GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import ButtonAsync from '../../../../components/ButtonAsync';
import { useDialogState } from '../../../../components/Dialog';
import DialogTitle from '../../../../components/DialogTitle';
import SidePanel, { SidePanelActions, SidePanelContent } from '../../../../components/SidePanel';
import { useStepper } from '../../../../components/Stepper';
import Text from '../../../../components/Text';
import VerticalStepper from '../../../../components/VerticalStepper';

import { SIMULATION_CREATION_STEPS } from '../../../../configs/simulation';
import { StepperWrapper, StepWrapper } from '../../../portfolios/CreatePortfolio';
import { SimulationDetails } from './SimulationDetails';
import SimulationReviewCreateDialog from './SimulationReviewCreateDialog';
import { SimulationSettings } from './SimulationSettings';
import DOMPurify from 'dompurify';
import { FEATURE_FLAGS } from '../../../../constants/featureFlags';
import SvgWarningTwo from '../../../../components/icons/WarningTwo';
import FeatureSwitch from '../../../../components/FeatureSwitch';
import { useCurrencyExchangeTimeframesQuery } from '../../../../graphql/currency/queryCurrencyExchangeTimeframes';
import { useCurrencyStore } from '../../../../store/currency-selection';
import { Link } from 'react-router-dom';

interface Props {
  portfolioId: number;
  startDate: Date | string;
  endDate: Date | string;
}

const SimulationCreate = ({ portfolioId }: Props) => {
  const { teamId } = useTeam();
  const {
    isOpen: isSimulationCreateOpen,
    openDialog: openSimulationCreate,
    closeDialog: closeSimulationCreate,
  } = useDialogState({
    initialState: false,
  });
  const { isOpen, openDialog, closeDialog } = useDialogState({
    initialState: false,
  });
  const { step, nextStep, previousStep, resetStep } = useStepper({
    initialValue: 1,
    end: SIMULATION_CREATION_STEPS.length,
  });

  const isLastStep = step === SIMULATION_CREATION_STEPS.length;

  useCurrencyExchangeTimeframesQuery();
  const { missingCurrencyCoverage } = useCurrencyStore();

  const { createSimulation, loading: createSimulationLoading } = useCreateSimulationMutation({ portfolioId });
  const { runSimulation, loading: runSimulationLoading } = useRunSimulationMutation({ portfolioId });
  const {
    simulationState,
    setSimulationState,
    handleChangeValueByKey,
    handleChangeBudgetRange,
    simulationState: {
      name,
      end,
      start,
      budgetStepSize,
      budgetStepCount,
      min,
      max,
      scenariosInput,
      budgetRange,
      ignoreContentBudgetLimits,
      skipNonOptimizedContentBudgets,
      budgetPacing,
    },
    resetState,
  } = useSimulation();

  const disableSubmit = () => {
    if (step === 1) {
      if (!name || !end || !start || createSimulationLoading || runSimulationLoading) {
        return true;
      }
    } else if (isLastStep) {
      if (
        !budgetStepSize ||
        !min ||
        !max ||
        createSimulationLoading ||
        runSimulationLoading ||
        parseFloat(budgetRange?.min) > parseFloat(budgetRange?.max)
      ) {
        return true;
      }
    }
  };

  const handleSaveForLater = async () => {
    createSimulation({
      variables: {
        portfolioId,
        teamId,
        name: DOMPurify.sanitize(name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
        budgetStepSize: parseFloat(budgetStepSize),
        budgetSteps: scenariosInput?.budgets?.map((b) => ({
          budget: toNumber(b.budget),
          isCustomScenario: b.isCustomScenario,
          isBaseScenario: b.isBaseScenario,
        })),
        start: dayjs(start).format(GLOBAL_DATE_FORMAT),
        end: dayjs(end).utc().format(GLOBAL_DATE_FORMAT),
        ignoreContentBudgetLimits: !!ignoreContentBudgetLimits,
        skipNonOptimizedContentBudgets: false,
        budgetPacing,
      },
    })
      .then(() => {
        closeSimulationCreate();
        closeDialog();
        toast.message('Simulation saved for later');
        resetState();
        resetStep();
      })
      .catch((e) => toast.error(e.message));
  };

  const handleStartSimulation = async () => {
    createSimulation({
      variables: {
        portfolioId,
        teamId,
        name: DOMPurify.sanitize(name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
        budgetStepSize: parseFloat(budgetStepSize),
        budgetSteps: scenariosInput?.budgets?.map((b) => ({
          budget: toNumber(b.budget),
          isCustomScenario: b.isCustomScenario,
          isBaseScenario: b.isBaseScenario,
        })),
        start: dayjs(start).format(GLOBAL_DATE_FORMAT),
        end: dayjs(end).utc().format(GLOBAL_DATE_FORMAT),
        ignoreContentBudgetLimits: !!ignoreContentBudgetLimits,
        skipNonOptimizedContentBudgets: false,
        budgetPacing,
      },
    })
      .then(({ data }) => {
        setTimeout(() => {
          runSimulation({
            variables: {
              teamId: teamId,
              portfolioId: portfolioId,
              simulationId: data?.createSimulation?.simulationId,
            },
          })
            .then(() => {
              resetState();
              resetStep();
              closeSimulationCreate();
              closeDialog();
              toast.success('Simulation started');
            })
            .catch((e) => toast.error(e.message));
        }, 250);
      })
      .catch((e) => toast.error(e.message));
  };

  const handleOpenReviewDialog = () => {
    closeSimulationCreate();
    openDialog();
  };

  return (
    <>
      <ButtonAsync
        variant="contained"
        color="primary"
        onClick={() => {
          openSimulationCreate();
          track(EVENT.SIMULATION_CREATE_DIALOG);
        }}
      >
        Create simulation
      </ButtonAsync>
      <SidePanel
        isOpen={isSimulationCreateOpen}
        onClose={() => {
          closeSimulationCreate();
        }}
        paperProps={{
          style: {
            width: 'calc(100% - 218px)',
            paddingBottom: '78px',
          },
        }}
        data-cy="createPortfolioDialog"
      >
        <DialogTitle
          style={{
            paddingBottom: '48px',
          }}
        >
          <Text component="h3">Create a simulation</Text>
        </DialogTitle>
        <SidePanelContent>
          <StepperWrapper>
            <VerticalStepper current={step} steps={SIMULATION_CREATION_STEPS} data-cy="simulationCreationSteps" />
          </StepperWrapper>
          <StepWrapper>
            {missingCurrencyCoverage && (
              <div className="mb-10 flex max-w-[470px] items-center gap-1.5 rounded-[5px] border border-[#eaeaea] bg-neutral-50 p-2 font-normal">
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
            {step === 1 ? (
              <SimulationDetails simulation={simulationState} handleChangeValueByKey={handleChangeValueByKey} />
            ) : (
              <SimulationSettings
                setSimulationState={setSimulationState}
                simulation={simulationState}
                handleChangeValueByKey={handleChangeValueByKey}
                handleChangeBudgetRange={handleChangeBudgetRange}
              />
            )}
          </StepWrapper>
        </SidePanelContent>
        <SidePanelActions>
          {step > 1 && (
            // @ts-ignore
            <ButtonAsync variant="contained" onClick={previousStep} id="funnelPreviousStep">
              Previous step
            </ButtonAsync>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {isLastStep ? (
              <ButtonAsync
                id="next"
                variant="contained"
                color="secondary"
                loading={createSimulationLoading || runSimulationLoading}
                disabled={disableSubmit()}
                // @ts-ignore
                onClick={isLastStep ? handleOpenReviewDialog : nextStep}
                style={{
                  marginRight: 16,
                }}
              >
                Save for later
              </ButtonAsync>
            ) : null}
            <ButtonAsync
              id="next"
              variant="contained"
              color="primary"
              loading={createSimulationLoading || runSimulationLoading}
              disabled={disableSubmit()}
              // @ts-ignore
              onClick={isLastStep ? handleOpenReviewDialog : nextStep}
            >
              {isLastStep ? 'Review and start simulation' : 'Next'}
            </ButtonAsync>
          </div>
        </SidePanelActions>
      </SidePanel>
      <SimulationReviewCreateDialog
        loading={createSimulationLoading || runSimulationLoading}
        isOpen={isOpen}
        onSaveForLater={handleSaveForLater}
        onStartSimulation={handleStartSimulation}
        simulation={{
          ...simulationState,
          scenarios: budgetStepCount,
        }}
        onClose={() => {
          closeDialog();
        }}
        onGoBack={() => {
          closeDialog();
          openSimulationCreate();
        }}
      />
    </>
  );
};

export default withSimulationProvider(SimulationCreate);
