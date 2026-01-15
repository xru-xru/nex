import { create } from 'zustand';
import {
  NexoyaBudgetDeltaHandlingPolicy,
  NexoyaFeatureFlag,
  NexoyaFunnelStepV2,
  NexoyaImpactGroup,
  NexoyaOptimizationType,
  NexoyaPortfolioDashboardUrl,
  NexoyaPortfolioLabel,
  NexoyaPortfolioTargetItem,
  NexoyaPortfolioType,
  NexoyaTargetBiddingApplyMode,
} from '../types';

interface PortfolioMeta {
  budgetDeltaHandlingPolicy?: NexoyaBudgetDeltaHandlingPolicy;
  budgetProposalTargetBiddingApplyMode?: NexoyaTargetBiddingApplyMode;
  createdByUserId?: number;
  defaultOptimizationTarget?: NexoyaFunnelStepV2;
  description?: string;
  end?: Date;
  featureFlags?: NexoyaFeatureFlag[];
  impactGroups: NexoyaImpactGroup[];
  labels: NexoyaPortfolioLabel[];
  latestAchievedTargetItem?: NexoyaPortfolioTargetItem;
  optimizationRiskLevel?: number;
  optimizationType?: NexoyaOptimizationType;
  portfolioDashboardUrls?: NexoyaPortfolioDashboardUrl[];
  portfolioId: number;
  skipTrainingDays?: number;
  start?: Date;
  targetItems: NexoyaPortfolioTargetItem[];
  teamId: number;
  title: string;
  type: NexoyaPortfolioType;
  isAttributed: boolean;
}

type PortfolioMetaStore = {
  portfolioMeta: PortfolioMeta;
  setPortfolioMeta: (data: PortfolioMeta) => void;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const usePortfolioMetaStore = create<PortfolioMetaStore>((set) => ({
  portfolioMeta: {
    impactGroups: [],
    labels: [],
    targetItems: [],
    portfolioId: 0,
    teamId: 0,
    title: '',
    type: null,
    isAttributed: false,
  },
  setPortfolioMeta: (data) => set({ portfolioMeta: data }),
  error: null,
  setError: (error) => set({ error }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default usePortfolioMetaStore;
