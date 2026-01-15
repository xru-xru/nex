import { create } from 'zustand';
import { NexoyaAttributionRule } from 'types';

interface AttributionRulesStore {
  attributionRules: NexoyaAttributionRule[];
  setAttributionRules: (rules: NexoyaAttributionRule[]) => void;
  filter: {
    addRule: (rule: NexoyaAttributionRule) => boolean | void;
    removeRule: (rule: NexoyaAttributionRule) => void;
    reset: () => void;
    attributionRulesFilter: NexoyaAttributionRule[];
  };
  reset: () => void;
}

export const useAttributionRulesStore = create<AttributionRulesStore>((set, get) => ({
  attributionRules: [],
  setAttributionRules: (rules) => set({ attributionRules: rules }),
  filter: {
    addRule: (rule) => {
      const { filter } = get();
      if (filter.attributionRulesFilter.find((r) => r.attributionRuleId === rule.attributionRuleId)) {
        return false;
      }
      set({
        filter: {
          ...filter,
          attributionRulesFilter: [...filter.attributionRulesFilter, rule],
        },
      });
    },
    removeRule: (rule) => {
      const { filter } = get();
      const newRules = filter.attributionRulesFilter.filter((r) => r.attributionRuleId !== rule.attributionRuleId);
      set({
        filter: {
          ...filter,
          attributionRulesFilter: newRules,
        },
      });
    },
    reset: () => {
      const { filter } = get();
      set({
        filter: {
          ...filter,
          attributionRulesFilter: [],
        },
      });
    },
    attributionRulesFilter: [],
  },
  reset: () =>
    set({
      attributionRules: [],
    }),
}));
