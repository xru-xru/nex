import {
  NexoyaBiddingStrategyType,
  NexoyaBudgetProposalData,
  NexoyaFunnelStepV2,
  NexoyaImpactGroup,
  NexoyaLifetimeBudgetSegment,
  NexoyaOptimizedContentStatus,
  NexoyaOptimizedFunnelStep,
  NexoyaOptimizedTarget,
  NexoyaPortfolioLabel,
} from 'types';

interface OptimizedFunnelStep
  extends Omit<NexoyaFunnelStepV2, '__typename'>,
    Omit<NexoyaOptimizedFunnelStep, '__typename'> {
  __typename: string;
}

export interface IRowBiddingStrategy {
  value?: number;
  type?: NexoyaBiddingStrategyType;
}

export interface IRowProposedBiddingStrategy extends IRowBiddingStrategy {
  applicationDelta?: number;
  currentTcpa?: number;
  currentTroas?: number;
  dailyBudgetChange?: number;
  realizedRoas?: number;
  troasDelta?: number;
  realizedCpa?: number;
  tcpaDelta?: number;
}

export interface IOptimizedContentStatusWithID extends NexoyaOptimizedContentStatus {
  contentId?: number;
}

export interface RowRaw {
  isExcluded: boolean;
  providerId?: number;
  contentId?: number;
  title?: string;
  titleLink?: string;
  isPerforming?: boolean;
  status: NexoyaOptimizedContentStatus;
  initialBudgetDaily: number;
  lifetimeBudgetSegments?: NexoyaLifetimeBudgetSegment[];
  initialBiddingStrategy?: IRowBiddingStrategy;
  proposedBiddingStrategy?: IRowProposedBiddingStrategy;
  biddingStrategyChangePercent?: number;
  budgetWillBeApplied?: boolean;
  biddingStrategyWillBeApplied?: boolean;
  previousDailyBudget?: number;
  proposedDailyBudget?: number;
  proposedDailyBudgetChange?: number;
  target?: NexoyaOptimizedTarget;
  funnelSteps: NexoyaOptimizedFunnelStep[];
  impactGroup: NexoyaImpactGroup;
  label?: NexoyaPortfolioLabel;
  budgetProposalData?: NexoyaBudgetProposalData;
}
