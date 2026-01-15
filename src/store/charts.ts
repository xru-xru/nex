import { create } from 'zustand';

interface ChartsState {
  initialDateRange: { dateFrom: string; dateTo: string } | null;
  setInitialDateRange: (range: { dateFrom: string; dateTo: string }) => void;
  resetInitialDateRange: () => void;
}

export const useChartsStore = create<ChartsState>((set) => ({
  initialDateRange: null,
  setInitialDateRange: (range) => set({ initialDateRange: range }),
  resetInitialDateRange: () => set({ initialDateRange: null }),
})); 