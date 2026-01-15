import styled from 'styled-components';

import { NexoyaBudgetDeltaHandlingPolicy, NexoyaTargetBiddingApplyMode } from '../types';

import SvgBdBudgetApplication from '../components/icons/BdBudgetApplication';
import SvgBdEndOfMonth from '../components/icons/BdEndOfMonth';
import SvgBdMonthlyNoRollover from '../components/icons/BdMonthlyNoRollover';
import SvgBdPortfolioLifetime from '../components/icons/BdPortfolioLifetime';

import { budgetOptimizationType, budgetRiskType } from '../configs/portfolio';
import { nexyColors } from '../theme';

const List = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const StyledLi = styled.li`
  width: 100%;
  max-width: 300px;
  text-align: left;
  font-size: 12px;
  line-height: 150%; /* 18px */
  letter-spacing: 0.36px;
  color: ${nexyColors.secondaryText};

  display: flex;
  justify-content: space-between;
`;

interface RiskType {
  title: string;
  description: string | JSX.Element;
  value: number;
}

export const getOptimizationTypes = (tenantName: string) => [
  {
    type: budgetOptimizationType.AUTOMATIC,
    title: 'Automatically',
    description: `${tenantName} automatically shifts the budget across all ad-sets and portfolios to achieve the best possible result.`,
  },
  {
    type: budgetOptimizationType.MANUAL,
    title: 'Manually',
    description: `${tenantName} sends you budget allocation proposals which you can review and manually apply.`,
  },
  {
    type: budgetOptimizationType.SKIP,
    title: 'Skip',
    description: '',
  },
];

// Keep the old export for backward compatibility
export const optimizationTypes = getOptimizationTypes('Nexoya');

export const getBudgetProposalTargetBiddingApplyTypes = (tenantName: string) => [
  {
    type: NexoyaTargetBiddingApplyMode.BudgetOnly,
    title: 'Budget only',
    proposalDescription: `${tenantName} will automatically apply the budget changes of all your campaigns.`,
    description: 'This mode automatically applies changes to the budget – nothing else is altered.',
  },
  {
    type: NexoyaTargetBiddingApplyMode.BiddingStrategyOnly,
    title: 'Bidding strategy only',
    proposalDescription: `${tenantName} will automatically update campaign targets where set; for campaigns without targets, budgets are applied instead.`,
    description:
      'This mode automatically adjusts the bidding strategy for contents that have one. Otherwise, it automatically applies changes to the budget.',
  },
  {
    type: NexoyaTargetBiddingApplyMode.BudgetAndBiddingStrategy,
    title: 'Budget & bidding strategy',
    proposalDescription: `${tenantName} will automatically apply the budget and target changes of all your campaigns.`,
    description: 'This mode automatically adjusts both changes to the budget and bidding strategy (where available).',
  },
];

// Keep the old export for backward compatibility
export const budgetProposalTargetBiddingApplyTypes = getBudgetProposalTargetBiddingApplyTypes('Nexoya');
export const riskTypes: { BUDGET: RiskType[]; TARGET: RiskType[] } = {
  BUDGET: [
    {
      title: 'Conservative',
      description: 'Maximum budget shift ±20%',
      value: budgetRiskType.CONSERVATIVE,
    },

    {
      title: 'Moderate',
      description: 'Maximum budget shift ±50%',
      value: budgetRiskType.MODERATE,
    },
    {
      title: 'Aggressive',
      description: 'Maximum budget shift ±100%',
      value: budgetRiskType.AGGRESSIVE,
    },
  ],
  TARGET: [
    {
      title: 'Conservative',
      description: (
        <List>
          <StyledLi>
            <div>Maximum budget shift per content:</div> <div>±25%</div>
          </StyledLi>
          <StyledLi>
            <div>Maximum total budget shift:</div> <div>±10%</div>
          </StyledLi>
        </List>
      ),
      value: budgetRiskType.CONSERVATIVE,
    },
    {
      title: 'Moderate',
      description: (
        <List>
          <StyledLi>
            <div>Maximum budget shift per content:</div> <div>±50%</div>
          </StyledLi>
          <StyledLi>
            <div>Maximum total budget shift:</div> <div>±20%</div>
          </StyledLi>
        </List>
      ),

      value: budgetRiskType.MODERATE,
    },
    {
      title: 'Aggressive',
      description: (
        <List>
          <StyledLi>
            <div>Maximum budget shift per content:</div> <div>±75%</div>
          </StyledLi>
          <StyledLi>
            <div>Maximum total budget shift:</div> <div>±50%</div>
          </StyledLi>
        </List>
      ),
      value: budgetRiskType.AGGRESSIVE,
    },
  ],
};

export const BUDGET_DELTA_OPTIONS = [
  {
    id: NexoyaBudgetDeltaHandlingPolicy.BudgetApplication,
    title: 'Budget application',
    description:
      'Allocate total delta budget evenly within the period of a new budget application. Delta budget since beginning of portfolio lifetime',
    image: <SvgBdBudgetApplication width={100} height={55} />,
  },
  {
    id: NexoyaBudgetDeltaHandlingPolicy.EndOfMonth,
    title: 'End of Month',
    description:
      'Allocate total delta budget evenly until the end of the month. Delta budget since beginning of portfolio lifetime.',
    image: <SvgBdEndOfMonth width={100} height={55} />,
  },
  {
    id: NexoyaBudgetDeltaHandlingPolicy.WithinCurrentMonth,
    title: 'End of Month Reset',
    description:
      'Allocate delta budget evenly until the end of the month. Delta budget since beginning of current month.',
    image: <SvgBdMonthlyNoRollover width={100} height={55} />,
  },
  {
    id: NexoyaBudgetDeltaHandlingPolicy.PortfolioLifetime,
    title: 'Portfolio Lifetime',
    description:
      'Allocate total delta budget evenly until the end of the portfolio lifetime. Delta budget since beginning of portfolio lifetime.',
    image: <SvgBdPortfolioLifetime width={100} height={55} />,
  },
];
