import { create } from 'zustand';
import { NexoyaPortfolioAttributionPerformance } from '../types';

interface AttributionPerformanceState {
  attributionPerformanceData: NexoyaPortfolioAttributionPerformance | null;
  setAttributionPerformanceData: (data: NexoyaPortfolioAttributionPerformance | null) => void;
}

export const useAttributionPerformanceStore = create<AttributionPerformanceState>((set) => ({
  // Initial state
  attributionPerformanceData: null,
  // Attribution performance actions
  setAttributionPerformanceData: (data) => set({ attributionPerformanceData: data }),
}));
