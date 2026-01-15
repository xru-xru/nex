import { VerticalStep } from '../components/VerticalStepper/Step';

export const SIMULATION_CREATION_STEPS: VerticalStep[] = [
  {
    id: 'simulation-details',
    name: 'Basic details',
    description: `Give your simulation a name, timeframe and the scenario type to explore.`,
  },
  {
    id: 'simulation-settings',
    name: 'Simulation settings',
    description: `Define the budget range and steps for your budgets simulation.`,
  },
];
