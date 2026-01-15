import React from 'react';

import useSimulationController, { NexoyaLocalSimulationInput } from '../controllers/SimulationController';

const SimulationContext = React.createContext<Record<string, any> | null>(null);

function SimulationProvider({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues?: NexoyaLocalSimulationInput;
}) {
  const value = useSimulationController(initialValues);
  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

function withSimulationProvider(Component: any) {
  return (props: any) => (
    <SimulationProvider>
      <Component {...props} />
    </SimulationProvider>
  );
}

function useSimulation(initialValues?: NexoyaLocalSimulationInput): Record<string, any> {
  const context = React.useContext(SimulationContext);

  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }

  // Use the initial values from context or fallback to default
  return {
    ...context,
    simulationState: initialValues ? { ...context.simulationState, ...initialValues } : context.simulationState,
  };
}

export { SimulationProvider, useSimulation, withSimulationProvider };
