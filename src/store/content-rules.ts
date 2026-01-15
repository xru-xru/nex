import { create } from 'zustand';
import { NexoyaContentRule } from 'types';

interface ContentRulesStore {
  contentRules: NexoyaContentRule[];
  setContentRules: (rules: NexoyaContentRule[]) => void;
  filter: {
    addRule: (rule: NexoyaContentRule) => void;
    removeRule: (rule: NexoyaContentRule) => void;
    reset: () => void;
    contentRulesFilter: NexoyaContentRule[];
  };
  selectedContentRules: NexoyaContentRule[];
  setSelectedContentRules: (rules: NexoyaContentRule[]) => void;
  reset: () => void;
  resetSelectedContentRules: () => void;
}

export const useContentRulesStore = create<ContentRulesStore>((set, get) => ({
  contentRules: [],
  setContentRules: (rules) => set({ contentRules: rules }),
  selectedContentRules: [],
  setSelectedContentRules: (rules) => set({ selectedContentRules: rules }),
  filter: {
    addRule: (rule) => {
      const { filter } = get();
      if (filter?.contentRulesFilter.find((r) => r.contentRuleId === rule.contentRuleId)) {
        return false;
      }
      set({ filter: { ...filter, contentRulesFilter: [...filter.contentRulesFilter, rule] } });
    },
    removeRule: (rule) => {
      const { filter } = get();
      const newRules = filter?.contentRulesFilter.filter((r) => r.contentRuleId !== rule.contentRuleId);
      set({ filter: { ...filter, contentRulesFilter: newRules } });
    },
    reset: () => {
      const { filter } = get();
      set({
        filter: {
          ...filter,
          contentRulesFilter: [],
        },
      });
    },
    contentRulesFilter: [],
  },
  reset: () =>
    set({
      contentRules: [],
    }),
  resetSelectedContentRules: () =>
    set({
      selectedContentRules: [],
    }),
}));
