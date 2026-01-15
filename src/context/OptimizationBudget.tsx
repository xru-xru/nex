import { createContext, useContext, useState } from 'react';

type OptimizationBudgetItem = {
  optimizationId: number;
  dateApplied: string;
};

const OptimizationBudgetContext = createContext<Record<string, any> | null>(null);

function OptimizationBudgetItems() {
  const [values, setValues] = useState<OptimizationBudgetItem[]>([]);
  const addItem = (item: OptimizationBudgetItem) => setValues((s) => [...s, item]);
  return {
    values,
    addItem,
  };
}

function OptimizationBudgetProvider(props: any) {
  const value = OptimizationBudgetItems();
  return <OptimizationBudgetContext.Provider value={value} {...props} />;
}

function useOptimizationBudget(): Record<string, any> {
  const context = useContext(OptimizationBudgetContext);

  if (context === undefined) {
    throw new Error('useOptimizationBudget must be used within a OptimizationBudgetProvider');
  }

  return context;
}

export { useOptimizationBudget, OptimizationBudgetProvider };
