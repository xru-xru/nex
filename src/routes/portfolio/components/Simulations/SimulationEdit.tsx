import React, { useState } from 'react';

import dayjs from 'dayjs';
import { isEmpty, isEqual, toNumber } from 'lodash';
import { toast } from 'sonner';

import { NexoyaSimulation } from '../../../../types';

import { withSimulationProvider } from '../../../../context/SimulationProvider';
import { useTeam } from '../../../../context/TeamProvider';
import { NexoyaLocalSimulationInput } from '../../../../controllers/SimulationController';
import { useEditSimulationMutation } from '../../../../graphql/simulation/mutationEditSimulation';

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
import { SimulationSettings } from './SimulationSettings';

interface Props {
  portfolioId: number;
  simulation: NexoyaSimulation;
  isSimulationEditOpen: boolean;
  closeSimulationEdit: () => void;
}

const SimulationEdit = ({ portfolioId, simulation, isSimulationEditOpen, closeSimulationEdit }: Props) => {
  const { teamId } = useTeam();

  const { closeDialog } = useDialogState({
    initialState: false,
  });

  const { step, nextStep, previousStep, resetStep } = useStepper({
    initialValue: 1,
    end: SIMULATION_CREATION_STEPS.length,
  });

  const isLastStep = step === SIMULATION_CREATION_STEPS.length;

  const { editSimulation, loading: editSimulationLoading } = useEditSimulationMutation({ portfolioId });

  const initialState: NexoyaLocalSimulationInput = {
    scenariosInput: {
      // @ts-ignore
      budgets: simulation.budget.steps,
      stepSize: simulation.budget.stepSize,
      stepCount: simulation.budget.stepCount,
    },
    name: simulation?.name,
    end: simulation?.end,
    start: simulation?.start,
    min: simulation?.budget?.min,
    max: simulation?.budget?.max,
    budgetStepSize: simulation?.budget?.stepSize,
    state: simulation?.state,
    simulationId: simulation?.simulationId,
    budgetRange: {
      min: simulation.budget.min,
      max: simulation.budget.max,
    },
    ignoreContentBudgetLimits: simulation.ignoreContentBudgetLimits,
    skipNonOptimizedContentBudgets: false,
    budgetPacing: simulation.budgetPacing,
  };
  const [simulationState, setSimulationState] = useState<NexoyaLocalSimulationInput>(initialState);

  const {
    name,
    end,
    start,
    budgetStepSize,
    min,
    max,
    budgetRange,
    skipNonOptimizedContentBudgets,
    ignoreContentBudgetLimits,
    budgetPacing,
  } = simulationState;

  const handleChangeValueByKey = React.useCallback((ev: any) => {
    const { name, value } = ev.target;
    setSimulationState((s) => ({ ...s, [name]: value }));
  }, []);

  const handleChangeBudgetRange = React.useCallback((ev: any) => {
    const { name, value } = ev.target;
    setSimulationState((s) => ({ ...s, budgetRange: { ...s.budgetRange, [name]: value } }));
  }, []);

  const resetState = () => {
    setSimulationState(null);
    resetStep();
  };

  const getEditedValues = () => {
    return {
      ...(isEqual(initialState.name, name) ? {} : { name }),
      ...(isEqual(initialState.budgetStepSize, budgetStepSize) ? {} : { budgetStepSize }),
      ...(isEqual(initialState.max, toNumber(budgetRange?.max)) ? {} : { budgetMax: toNumber(budgetRange?.max) }),
      ...(isEqual(initialState.min, toNumber(budgetRange?.min)) ? {} : { budgetMin: toNumber(budgetRange?.min) }),
      ...(isEqual(initialState.start, start) ? {} : { start: dayjs(start).format(GLOBAL_DATE_FORMAT) }),
      ...(isEqual(initialState.end, end) ? {} : { end: dayjs(end).utc().format(GLOBAL_DATE_FORMAT) }),

      ...(isEqual(initialState.skipNonOptimizedContentBudgets, skipNonOptimizedContentBudgets)
        ? {}
        : { skipNonOptimizedContentBudgets }),
      ...(isEqual(initialState.ignoreContentBudgetLimits, ignoreContentBudgetLimits)
        ? {}
        : { ignoreContentBudgetLimits }),
      ...(isEqual(initialState.budgetPacing, budgetPacing) ? {} : { budgetPacing }),
      ...(isEqual(
        initialState?.scenariosInput?.budgets?.map((b) => b.budget),
        simulationState?.scenariosInput?.budgets?.map((b) => b.budget),
      )
        ? {}
        : {
            budgetSteps: simulationState.scenariosInput?.budgets?.map((b) => ({
              budget: toNumber(b.budget),
              isCustomScenario: b.isCustomScenario,
              isBaseScenario: b.isBaseScenario,
            })),
          }),
    };
  };

  const disableSubmit = () => {
    if (step === 1) {
      if (!name || !end || !start || editSimulationLoading) {
        return true;
      }
    } else if (isLastStep) {
      if (
        !budgetStepSize ||
        !min ||
        !max ||
        editSimulationLoading ||
        isEmpty(getEditedValues()) ||
        toNumber(budgetRange?.min) > toNumber(budgetRange?.max)
      ) {
        return true;
      }
    }
    return false;
  };

  const handleEditSimulation = async () => {
    editSimulation({
      variables: {
        simulationId: simulation.simulationId,
        portfolioId,
        teamId,
        ...getEditedValues(),
      },
    })
      .then(() => {
        closeSimulationEdit();
        closeDialog();
        toast.success('Simulation edited successfully');
        resetState();
      })
      .catch((e) => toast.error(e.message));
  };

  return (
    <>
      <SidePanel
        isOpen={isSimulationEditOpen}
        onClose={() => {
          resetState();
          closeSimulationEdit();
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
          <Text component="h3">Edit simulation</Text>
        </DialogTitle>
        <SidePanelContent>
          <StepperWrapper>
            <VerticalStepper current={step} steps={SIMULATION_CREATION_STEPS} data-cy="simulationCreationSteps" />
          </StepperWrapper>
          <StepWrapper>
            {step === 1 ? (
              <SimulationDetails simulation={simulationState} handleChangeValueByKey={handleChangeValueByKey} />
            ) : (
              <SimulationSettings
                simulation={simulationState}
                setSimulationState={setSimulationState}
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
            <ButtonAsync
              id="next"
              variant="contained"
              color="primary"
              loading={editSimulationLoading}
              disabled={disableSubmit()}
              // @ts-ignore
              onClick={isLastStep ? handleEditSimulation : nextStep}
            >
              {isLastStep ? 'Save' : 'Next'}
            </ButtonAsync>
          </div>
        </SidePanelActions>
      </SidePanel>
    </>
  );
};

export default withSimulationProvider(SimulationEdit);
