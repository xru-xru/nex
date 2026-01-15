import { create } from 'zustand';

type CustomizationStore = {
  // Chart customization settings
  isStackedAreaChartActive: boolean;
  setIsStackedAreaChartActive: (value: boolean) => void;

  conversionRateToggle: boolean;
  setConversionRateToggle: (value: boolean) => void;

  compareTo: boolean;
  setCompareTo: (value: boolean) => void;

  // Reset all settings
  resetCustomization: () => void;
};

export const useCustomizationStore = create<CustomizationStore>((set) => ({
  isStackedAreaChartActive: false,
  setIsStackedAreaChartActive: (value) => set({ isStackedAreaChartActive: value }),

  conversionRateToggle: false,
  setConversionRateToggle: (value) => set({ conversionRateToggle: value }),

  compareTo: true,
  setCompareTo: (value) => set({ compareTo: value }),

  resetCustomization: () =>
    set({
      isStackedAreaChartActive: false,
      conversionRateToggle: false,
    }),
}));
