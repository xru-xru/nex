import { create } from 'zustand';
import { NexoyaDiscoveredContent } from '../types';

export interface SelectedRule {
  contentRuleId: string | null;
  impactGroupRuleId: string | null;
  attributionRuleId?: string | null;
}

interface DiscoveredContentStore {
  acceptedDiscoveredContents: NexoyaDiscoveredContent[];
  filteredContents: NexoyaDiscoveredContent[];
  selectedContentIds: number[];
  discoveredContentsActiveSwitch: 'rejected' | 'to-review';
  // For discovered content rules (renamed from selectedRules)
  selectedDiscoveredContentRules: Record<number, SelectedRule>;
  // For unapplied content rules (renamed from selectedContentRules)
  selectedUnappliedContentRules: Record<number, SelectedRule>;
  // This state is shared from the unapplied rules store.
  contentsWithUnappliedRules: NexoyaDiscoveredContent[];
  // New property to track update flags per tab.
  tabNewUpdates: {
    discoveredContents: boolean;
    unappliedRules: boolean;
    removedContents: boolean;
  };
  // Actions for discovered contents.
  setAcceptedDiscoveredContents: (contents: NexoyaDiscoveredContent[]) => void;
  setFilteredContents: (contents: NexoyaDiscoveredContent[]) => void;
  addSelectedContentId: (id: number) => void;
  removeSelectedContentId: (id: number) => void;
  resetSelectedContentIds: () => void;
  setDiscoveredContentsActiveSwitch: (switchId: string) => void;
  // Action for discovered content rules.
  setSelectedDiscoveredContentRules: (
    contentId: number,
    ruleType: 'metricId' | 'impactGroupId' | 'contentRuleId' | 'impactGroupRuleId',
    value: string | null,
  ) => void;
  // Actions from the unapplied rules store.
  setContentsWithUnappliedRules: (contents: NexoyaDiscoveredContent[]) => void;
  setSelectedUnappliedContentRules: (
    contentId: number,
    ruleType: 'contentRuleId' | 'impactGroupRuleId' | 'attributionRuleId',
    value: string | null,
  ) => void;
  resetSelectedUnappliedContentRules: () => void;
  // New actions for update flags.
  setTabNewUpdates: (tab: 'discoveredContents' | 'unappliedRules', value: boolean) => void;
  resetTabNewUpdates: () => void;

  removedContents: NexoyaDiscoveredContent[];
  setRemovedContents: (contents: NexoyaDiscoveredContent[]) => void;
}

export const useDiscoverContentsStore = create<DiscoveredContentStore>((set) => ({
  acceptedDiscoveredContents: [],
  filteredContents: [],
  selectedContentIds: [],
  discoveredContentsActiveSwitch: 'to-review',

  selectedDiscoveredContentRules: {},

  selectedUnappliedContentRules: {},

  removedContents: [],

  contentsWithUnappliedRules: [],
  tabNewUpdates: {
    discoveredContents: false,
    unappliedRules: false,
    removedContents: false,
  },

  setAcceptedDiscoveredContents: (contents) => set(() => ({ acceptedDiscoveredContents: contents })),
  setFilteredContents: (contents) => set(() => ({ filteredContents: contents })),
  addSelectedContentId: (id) => set((state) => ({ selectedContentIds: [...state.selectedContentIds, id] })),
  removeSelectedContentId: (id) =>
    set((state) => ({
      selectedContentIds: state.selectedContentIds.filter((contentId) => contentId !== id),
    })),
  resetSelectedContentIds: () => set(() => ({ selectedContentIds: [] })),
  setDiscoveredContentsActiveSwitch: (switchId: 'rejected' | 'to-review') =>
    set(() => ({ discoveredContentsActiveSwitch: switchId })),

  setSelectedDiscoveredContentRules: (contentId, ruleType, value) =>
    set((state) => ({
      selectedDiscoveredContentRules: {
        ...state.selectedDiscoveredContentRules,
        [contentId]: {
          ...state.selectedDiscoveredContentRules[contentId],
          [ruleType]: value,
        },
      },
    })),

  setContentsWithUnappliedRules: (contents) => set(() => ({ contentsWithUnappliedRules: contents })),
  setSelectedUnappliedContentRules: (contentId, ruleType, value) =>
    set((state) => ({
      selectedUnappliedContentRules: {
        ...state.selectedUnappliedContentRules,
        [contentId]: {
          ...state.selectedUnappliedContentRules[contentId],
          [ruleType]: value,
        },
      },
    })),
  resetSelectedUnappliedContentRules: () => set(() => ({ selectedUnappliedContentRules: {} })),

  setRemovedContents: (contents) => set(() => ({ removedContents: contents })),

  setTabNewUpdates: (tab, value) =>
    set((state) => ({
      tabNewUpdates: { ...state.tabNewUpdates, [tab]: value },
    })),
  resetTabNewUpdates: () =>
    set(() => ({
      tabNewUpdates: { discoveredContents: false, unappliedRules: false, removedContents: false },
    })),
}));
