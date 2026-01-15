import { create } from 'zustand';
import { NexoyaImpactGroupRule } from 'types';

interface ImpactGroupRulesStore {
  impactGroupRules: NexoyaImpactGroupRule[];
  setImpactGroupRules: (rules: NexoyaImpactGroupRule[]) => void;
  filter: {
    addRule: (rule: NexoyaImpactGroupRule) => boolean | void;
    removeRule: (rule: NexoyaImpactGroupRule) => void;
    reset: () => void;
    impactGroupRulesFilter: NexoyaImpactGroupRule[];
  };
  reset: () => void;
}

export const useImpactGroupRulesStore = create<ImpactGroupRulesStore>((set, get) => ({
  impactGroupRules: [],
  setImpactGroupRules: (rules) => set({ impactGroupRules: rules }),
  filter: {
    addRule: (rule) => {
      const { filter } = get();
      if (filter.impactGroupRulesFilter.find((r) => r.impactGroupRuleId === rule.impactGroupRuleId)) {
        return false;
      }
      set({
        filter: {
          ...filter,
          impactGroupRulesFilter: [...filter.impactGroupRulesFilter, rule],
        },
      });
    },
    removeRule: (rule) => {
      const { filter } = get();
      const newRules = filter.impactGroupRulesFilter.filter((r) => r.impactGroupRuleId !== rule.impactGroupRuleId);
      set({
        filter: {
          ...filter,
          impactGroupRulesFilter: newRules,
        },
      });
    },
    reset: () => {
      const { filter } = get();
      set({
        filter: {
          ...filter,
          impactGroupRulesFilter: [],
        },
      });
    },
    impactGroupRulesFilter: [],
  },
  reset: () =>
    set({
      impactGroupRules: [],
    }),
}));
