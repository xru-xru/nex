import { create } from 'zustand';
import { NexoyaOptimizationV2 } from '../types';

type OptimizationStore = {
  optimizations: NexoyaOptimizationV2[];
  setOptimizations: (optimizations: NexoyaOptimizationV2[]) => void;
  performanceChartOptimization: NexoyaOptimizationV2;
  setPerformanceChartOptimization: (optimization: NexoyaOptimizationV2) => void;

  activeOptimization: NexoyaOptimizationV2;
  setActiveOptimization: (optimization: NexoyaOptimizationV2) => void;
  resetOptimizations: () => void;
};

export const useOptimizationStore = create<OptimizationStore>((set) => ({
  optimizations: [],
  setOptimizations: (optimizations) => set({ optimizations }),

  performanceChartOptimization: null,
  setPerformanceChartOptimization: (optimization) => set({ performanceChartOptimization: optimization }),

  activeOptimization: null,
  setActiveOptimization: (activeOptimization) => set({ activeOptimization }),
  resetOptimizations: () =>
    set({
      optimizations: [],
      activeOptimization: null,
    }),
}));
