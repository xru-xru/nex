// src/store/budget-item.ts
import { create } from 'zustand';
import { NexoyaBudgetItem, NexoyaPacingType } from '../types';

interface BudgetItemState {
  budgetItemState: NexoyaBudgetItem;
  lastBudgetNumber: string | undefined;
  handleChangeValueByKey: (ev: { target: { name: string; value: any } }) => void;
  setLastBudgetNumber: (value: string | undefined) => void;
  resetState: () => void;
}

const initialFormValues: NexoyaBudgetItem = {
  status: undefined,
  budgetItemId: -1,
  name: '',
  startDate: null,
  endDate: null,
  budgetAmount: null,
  pacing: NexoyaPacingType.Fixed,
  budgetDailyItems: [],
};

export const useBudgetItemStore = create<BudgetItemState>((set) => ({
  budgetItemState: initialFormValues,
  lastBudgetNumber: undefined,

  handleChangeValueByKey: (ev) => {
    const { name, value } = ev.target;
    set((state) => ({
      budgetItemState: {
        ...state.budgetItemState,
        [name]: value,
      },
    }));
  },

  setLastBudgetNumber: (value) => set({ lastBudgetNumber: value }),

  resetState: () =>
    set({
      budgetItemState: initialFormValues,
      lastBudgetNumber: undefined,
    }),
}));
