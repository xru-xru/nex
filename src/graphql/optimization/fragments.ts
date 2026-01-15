import { gql } from '@apollo/client';

export const OPTIMIZATION_LIST_FRAGMENT = gql`
  fragment OptimizationListFragment on OptimizationV2 {
    optimizationId
    title
    description
    start
    status
    end
    totalBudget
    usedBudgetProposalTargetBiddingApplyMode
    target
  }
`;

export const OPTIMIZATION_FRAGMENT = gql`
  fragment Optimization on OptimizationV2 {
    ...OptimizationListFragment
  }
  ${OPTIMIZATION_LIST_FRAGMENT}
`;

export const ACTIVE_OPTIMIZATION_FRAGMENT = gql`
  fragment ActiveOptimization on OptimizationV2 {
    optimizationId
    title
    description
    appliedAt
    start
    end
    totalBudget
    status
    target
    onlyVisibleToSupportUsers
    usedBudgetProposalTargetBiddingApplyMode
    isBaselinePredictionRescaled
    user {
      firstname
      lastname
    }
    tasks {
      FETCHING_DATA
      COMPUTING_BUDGET
      RUNNING_OPTIMIZATION
      GENERATING_BUDGET_PROPOSAL
      PROPOSAL_WAITING
      APPLYING_BUDGET_PROPOSAL
    }
  }
`;
