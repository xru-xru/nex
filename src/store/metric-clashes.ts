import { create } from 'zustand';
import { NexoyaDiscoveredContent } from '../types';

export interface SelectedRule {
  ruleId: string | null;
}

interface RuleClashStore {
  clashingDiscoveredContents: NexoyaDiscoveredContent[];
  selectedRules: Record<number, SelectedRule>;
  setClashingDiscoveredContents: (contents: NexoyaDiscoveredContent[]) => void;
  setSelectedRule: (contentId: number, ruleId: string | null) => void;
  resetSelectedRules: () => void;
}

export const useRuleClashStore = create<RuleClashStore>((set) => ({
  clashingDiscoveredContents: [],
  selectedRules: {},

  setClashingDiscoveredContents: (contents) =>
    set(() => ({
      clashingDiscoveredContents: contents,
    })),

  setSelectedRule: (contentId, ruleId) =>
    set((state) => ({
      selectedRules: {
        ...state.selectedRules,
        [contentId]: { ruleId },
      },
    })),

  resetSelectedRules: () =>
    set(() => ({
      selectedRules: {},
    })),
}));
