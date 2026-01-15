import { create } from 'zustand';
import { ExtendedNexoyaSimulationScenario, NexoyaSimulation } from '../types';

interface SimulationState {
  selectedSimulation: NexoyaSimulation | undefined;
  selectedScenario: ExtendedNexoyaSimulationScenario | undefined;
  filteredSimulations: NexoyaSimulation[];

  // Actions
  setSelectedSimulation: (simulation: NexoyaSimulation | undefined) => void;
  setSelectedScenario: (scenario: ExtendedNexoyaSimulationScenario | undefined) => void;
  setFilteredSimulations: (simulations: NexoyaSimulation[]) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  selectedSimulation: undefined,
  selectedScenario: undefined,
  filteredSimulations: [],

  setSelectedSimulation: (simulation) => set({ selectedSimulation: simulation }),
  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  setFilteredSimulations: (simulations) => set({ filteredSimulations: simulations }),
  reset: () =>
    set({
      selectedSimulation: undefined,
      selectedScenario: undefined,
      filteredSimulations: [],
    }),
}));
