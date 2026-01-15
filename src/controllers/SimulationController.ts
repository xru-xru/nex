import React, { useState } from 'react';

import {
  NexoyaSimulationBudgetPacing,
  NexoyaSimulationBudgetPreview,
  NexoyaSimulationBudgetStep,
  NexoyaSimulationState,
} from 'types';

export interface ScenarioCreationBudget extends NexoyaSimulationBudgetStep {
  value: number;
  formattedValue: string;
  isFocused: boolean;
  isPersisted?: boolean;
}

export interface ScenarioInput extends NexoyaSimulationBudgetPreview {
  budgets: Array<ScenarioCreationBudget>;
}
export interface NexoyaLocalSimulationInput {
  name: string;
  end: Date;
  start: Date;
  min: number;
  max: number;
  budgetStepSize: number;
  simulationId?: number;
  scenariosInput: ScenarioInput;
  state?: NexoyaSimulationState;
  budgetRange?: BudgetRange;
  ignoreContentBudgetLimits: boolean;
  skipNonOptimizedContentBudgets: boolean;
  budgetPacing: NexoyaSimulationBudgetPacing;
}

export interface BudgetRange {
  min: string | number | undefined;
  max: string | number | undefined;
}

function useSimulationController(
  initialValues: NexoyaLocalSimulationInput = {
    name: '',
    end: null,
    start: null,
    min: null,
    max: null,
    budgetStepSize: null,
    scenariosInput: null,
    state: null,
    ignoreContentBudgetLimits: false,
    skipNonOptimizedContentBudgets: false,
    budgetPacing: NexoyaSimulationBudgetPacing.Static,
    budgetRange: {
      min: null,
      max: null,
    },
  },
): Record<string, any> {
  const [simulationState, setSimulationState] = useState<NexoyaLocalSimulationInput>(initialValues);

  const handleChangeValueByKey = React.useCallback((ev: any) => {
    const { name, value } = ev.target;
    setSimulationState((s) => ({ ...s, [name]: value }));
  }, []);

  const handleChangeBudgetRange = React.useCallback((ev: any) => {
    const { name, value } = ev.target;
    setSimulationState((s) => ({ ...s, budgetRange: { ...s.budgetRange, [name]: value } }));
  }, []);

  const resetState = () => {
    setSimulationState(initialValues);
  };

  return {
    simulationState,
    handleChangeValueByKey,
    setSimulationState,
    handleChangeBudgetRange,
    resetState,
  };
}

export default useSimulationController;
