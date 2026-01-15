import { VerticalStep } from '../components/VerticalStepper/Step';

export const portfolioCreationSteps: VerticalStep[] = [
  {
    id: 'portfolio-basic-details',
    name: 'Basic details',
    description: `Give your portfolio a name, set the duration and portfolio type.`,
  },
  {
    id: 'portfolio-select-content',
    name: 'Portfolio settings',
    description: 'Select the settings for your chosen portfolio type.',
  },
];
export const portfolioTabs = {
  PERFORMANCE: 'performance',
  OPTIMIZATION: 'optimization',
  BUDGET: 'budget',
  TARGET: 'target',
  VALIDATION: 'validation',
  CONTENT: 'content',
  SIMULATIONS: 'simulations',
  SETTINGS: 'settings',
};

export const settingsTabs = {
  GENERAL: 'general',
  FUNNEL: 'funnel',
  IMPACT_GROUPS: 'impact-groups',
  CONTENT_RULES: 'content-rules',
  ATTRIBUTION: 'attribution-rules',
  EVENTS: 'events',
};

export const contentTabs = {
  CONTENT: 'content',
  DISCOVERED_CONTENTS: 'discovered-contents',
  UNAPPLIED_RULES: 'unapplied-rules',
  REMOVED_CONTENTS: 'removed-contents',
};

export const portfoliosTabs = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
};
export const budgetOptimizationType = {
  AUTOMATIC: 'AUTO',
  MANUAL: 'MANUAL',
  SKIP: 'SKIP',
};
export const budgetRiskType = {
  CONSERVATIVE: 20,
  MODERATE: 50,
  AGGRESSIVE: 100,
};

export const TAB_TITLES = {
  [portfolioTabs.PERFORMANCE]: {
    title: 'Performance',
    subtitle: 'View and analyze performance data per funnel step and channel.',
  },
  [portfolioTabs.OPTIMIZATION]: {
    title: 'Optimize',
    subtitle: 'Launch and manage optimization proposals.',
  },
  [portfolioTabs.BUDGET]: {
    title: 'Budget',
    subtitle: 'Compare planned vs actual spend and manage budget items.',
  },
  [portfolioTabs.TARGET]: {
    title: 'Target',
    subtitle: 'Compare planned vs achieved targets and manage target items.',
  },
  [portfolioTabs.VALIDATION]: {
    title: 'Validation',
    subtitle: 'Compare predicted and actual data with detailed accuracy insights.',
  },
  [portfolioTabs.SIMULATIONS]: {
    title: 'Simulations',
    subtitle: 'Create and manage simulations.',
  },

  [portfolioTabs.SETTINGS]: {
    title: '',
    subtitle: '',
  },
};
