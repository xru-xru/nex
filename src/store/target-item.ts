import { create } from 'zustand';

type FormValues = {
  targetItemName: string;
  value: string;
  maxBudget: string;
  start: Date | null;
  end: Date | null;
};

interface TargetItemState {
  targetItemState: FormValues;
  lastTargetNumber: any;
  lastMaxBudgetNumber: any;
  handleChangeValueByKey: (ev: { target: { name: string; value: any } }) => void;
  setLastTargetNumber: (value: string | undefined) => void;
  setLastMaxBudgetNumber: (value: string | undefined) => void;
  resetState: () => void;
}

const initialFormValues: FormValues = {
  targetItemName: '',
  start: null,
  end: null,
  value: '',
  maxBudget: '',
};

export const useTargetItemStore = create<TargetItemState>((set) => ({
  targetItemState: initialFormValues,
  lastTargetNumber: undefined,
  lastMaxBudgetNumber: undefined,

  handleChangeValueByKey: (ev) => {
    const { name, value } = ev.target;
    set((state) => ({
      targetItemState: {
        ...state.targetItemState,
        [name]: value,
      },
    }));
  },

  setLastTargetNumber: (value) => set({ lastTargetNumber: value }),

  setLastMaxBudgetNumber: (value) => set({ lastMaxBudgetNumber: value }),

  resetState: () =>
    set({
      targetItemState: initialFormValues,
      lastTargetNumber: undefined,
      lastMaxBudgetNumber: undefined,
    }),
}));
