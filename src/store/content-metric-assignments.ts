// store/useContentMappingStore.ts
import { create } from 'zustand';
import { NexoyaConversion, NexoyaMeasurement } from 'types';

interface ContentMappingStore {
  measurementsByProvider: Record<number, NexoyaMeasurement[]>;
  conversionsByProvider: Record<number, NexoyaConversion[]>;

  // Our “setter”
  setMeasurementsByProvider(providerId: number, measurements: NexoyaMeasurement[]): void;
  setConversionsByProvider(providerId: number, conversions: NexoyaConversion[]): void;

  reset: () => void;
}

export const useContentMappingStore = create<ContentMappingStore>((set) => ({
  measurementsByProvider: {},
  conversionsByProvider: {},
  reset: () => set({ measurementsByProvider: {}, conversionsByProvider: {} }),

  setMeasurementsByProvider(providerId, measurements) {
    set((state) => ({
      measurementsByProvider: {
        ...state.measurementsByProvider,
        [providerId]: measurements,
      },
    }));
  },
  setConversionsByProvider(providerId, conversions) {
    set((state) => ({
      conversionsByProvider: {
        ...state.conversionsByProvider,
        [providerId]: conversions,
      },
    }));
  },
}));
