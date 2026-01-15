import { create } from 'zustand';
import {
  NexoyaAttributionRule,
  NexoyaContentRule,
  NexoyaImpactGroup,
  NexoyaImpactGroupRule,
  NexoyaPortfolioLabel,
  NexoyaPortfolioParentContentsSortField,
  NexoyaProvider,
  NexoyaSortOrder,
} from '../types';

const DEFAULT_PAGE_SIZE = 50;

export interface ContentFilterState {
  labelsFilter: NexoyaPortfolioLabel[];
  impactGroupsFilter: NexoyaImpactGroup[];
  contentRulesFilter: NexoyaContentRule[];
  attributionRulesFilter: NexoyaAttributionRule[];
  impactGroupRulesFilter: NexoyaImpactGroupRule[];
  providersFilter: NexoyaProvider[];
  titleContains?: string;
  isIncludedInOptimization?: boolean;
  isRuleManaged?: boolean;

  sortField?: NexoyaPortfolioParentContentsSortField;
  sortOrder?: NexoyaSortOrder;

  // Title methods
  handleChangeTitleContains: (title: string) => void;

  // Provider methods
  handleAddProvider: (provider: NexoyaProvider) => void;
  handleRemoveProvider: (provider: NexoyaProvider) => void;

  // Booleans
  handleSetIsIncludedInOptimization: (value: boolean) => void;
  handleSetIsRuleManaged: (value: boolean) => void;

  // Label methods
  handleAddLabel: (label: NexoyaPortfolioLabel) => void;
  handleRemoveLabel: (label: NexoyaPortfolioLabel) => void;

  // Impact group methods
  handleAddImpactGroup: (impactGroup: NexoyaImpactGroup) => void;
  handleRemoveImpactGroup: (impactGroup: NexoyaImpactGroup) => void;

  // Content rules methods
  handleAddContentRule: (contentRule: NexoyaContentRule) => void;
  handleRemoveContentRule: (contentRule: NexoyaContentRule) => void;

  // Attribution rules methods
  handleAddAttributionRule: (attributionRule: NexoyaAttributionRule) => void;
  handleRemoveAttributionRule: (attributionRule: NexoyaAttributionRule) => void;

  // Impact group rules methods
  handleAddImpactGroupRule: (impactGroupRule: NexoyaImpactGroupRule) => void;
  handleRemoveImpactGroupRule: (impactGroupRule: NexoyaImpactGroupRule) => void;

  // Sorting methods
  handleChangeSortField: (field: NexoyaPortfolioParentContentsSortField) => void;
  handleChangeSortOrder: (order: NexoyaSortOrder) => void;

  pageSize: number;
  setPageSize: (pageSize: number) => void;

  // Reset methods
  resetAllFilters: (
    type?: 'providers' | 'labelsFilter' | 'impactGroups' | 'contentRules' | 'attributionRules' | 'impactGroupRules',
  ) => void;
}

export const useContentFilterStore = create<ContentFilterState>((set) => ({
  labelsFilter: [],
  providersFilter: [],
  impactGroupsFilter: [],
  contentRulesFilter: [],
  attributionRulesFilter: [],
  impactGroupRulesFilter: [],
  titleContains: '',

  isIncludedInOptimization: true,
  isRuleManaged: undefined,

  pageSize: DEFAULT_PAGE_SIZE,
  setPageSize: (pageSize) => set({ pageSize }),

  sortField: undefined,
  sortOrder: undefined,

  // Title methods
  handleChangeTitleContains: (title) => set({ titleContains: title }),

  // Provider methods
  handleAddProvider: (provider) =>
    set((state) => ({
      providersFilter: [...state.providersFilter, provider],
    })),

  handleRemoveProvider: (provider) =>
    set((state) => ({
      providersFilter: state.providersFilter.filter((p) => p.provider_id !== provider.provider_id),
    })),

  // Boolean filters
  handleSetIsIncludedInOptimization: (value) => set({ isIncludedInOptimization: value }),
  handleSetIsRuleManaged: (value) => set({ isRuleManaged: value }),

  // Label methods
  handleAddLabel: (label) =>
    set((state) => ({
      labelsFilter: [...state.labelsFilter, label],
    })),

  handleRemoveLabel: (label) =>
    set((state) => ({
      labelsFilter: state.labelsFilter.filter((l) => l.labelId !== label.labelId),
    })),

  // Impact group methods
  handleAddImpactGroup: (impactGroup) =>
    set((state) => ({
      impactGroupsFilter: [...state.impactGroupsFilter, impactGroup],
    })),

  handleRemoveImpactGroup: (impactGroup) =>
    set((state) => ({
      impactGroupsFilter: state.impactGroupsFilter.filter((ig) => ig.impactGroupId !== impactGroup.impactGroupId),
    })),

  // Content rules methods
  handleAddContentRule: (contentRule) =>
    set((state) => ({
      contentRulesFilter: [...state.contentRulesFilter, contentRule],
    })),

  handleRemoveContentRule: (contentRule) =>
    set((state) => ({
      contentRulesFilter: state.contentRulesFilter.filter((cr) => cr.contentRuleId !== contentRule.contentRuleId),
    })),

  // Attribution rules methods
  handleAddAttributionRule: (attributionRule) =>
    set((state) => ({
      attributionRulesFilter: [...state.attributionRulesFilter, attributionRule],
    })),

  handleRemoveAttributionRule: (attributionRule) =>
    set((state) => ({
      attributionRulesFilter: state.attributionRulesFilter.filter(
        (cr) => cr.attributionRuleId !== attributionRule.attributionRuleId,
      ),
    })),

  // Impact group rules methods
  handleAddImpactGroupRule: (impactGroupRule) =>
    set((state) => ({
      impactGroupRulesFilter: [...state.impactGroupRulesFilter, impactGroupRule],
    })),

  handleRemoveImpactGroupRule: (impactGroupRule) =>
    set((state) => ({
      impactGroupRulesFilter: state.impactGroupRulesFilter.filter(
        (igr) => igr.impactGroupRuleId !== impactGroupRule.impactGroupRuleId,
      ),
    })),

  handleChangeSortField: (field) => set({ sortField: field }),
  handleChangeSortOrder: (order) => set({ sortOrder: order }),

  // Reset methods
  resetAllFilters: (type) =>
    set(() => {
      if (!type) {
        return {
          providersFilter: [],
          labelsFilter: [],
          impactGroupsFilter: [],
          contentRulesFilter: [],
          attributionRulesFilter: [],
          impactGroupRulesFilter: [],
          titleContains: '',
          isIncludedInOptimization: true,
          isRuleManaged: undefined,
        };
      }

      const resetMap = {
        providers: { providersFilter: [] },
        labelsFilter: { labelsFilter: [] },
        impactGroups: { impactGroupsFilter: [] },
        contentRules: { contentRulesFilter: [] },
        attributionRules: { attributionRulesFilter: [] },
        impactGroupRules: { impactGroupRulesFilter: [] },
      };

      return resetMap[type] || {};
    }),
}));
