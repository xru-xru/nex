import { gql, useMutation } from '@apollo/client';

import {
  NexoyaBudgetDeltaHandlingPolicy,
  NexoyaPortfolioDashboardUrl,
  NexoyaTargetBiddingApplyMode,
} from '../../types';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import DOMPurify from 'dompurify';

// 	updatePortfolio(teamId: Int!, portfolioId: Int!, title: String, description: String, startDate: DateTime, endDate: DateTime): Portfolio
const UPDATE_PORTFOLIO_MUTATION = gql`
  mutation updatePortfolio(
    $teamId: Int!
    $portfolioId: Int!
    $title: String
    $startDate: DateTime
    $endDate: DateTime
    $optimizationRiskLevel: Int
    $portfolioDashboardUrls: [PortfolioDashboardUrlInput!]
    $budgetDeltaHandlingPolicy: BudgetDeltaHandlingPolicy
    $budgetProposalTargetBiddingApplyMode: TargetBiddingApplyMode
    $skipTrainingDays: Int
  ) {
    updatePortfolio(
      teamId: $teamId
      portfolioId: $portfolioId
      title: $title
      startDate: $startDate
      endDate: $endDate
      optimizationRiskLevel: $optimizationRiskLevel
      portfolioDashboardUrls: $portfolioDashboardUrls
      budgetDeltaHandlingPolicy: $budgetDeltaHandlingPolicy
      budgetProposalTargetBiddingApplyMode: $budgetProposalTargetBiddingApplyMode
      skipTrainingDays: $skipTrainingDays
    ) {
      portfolioId
    }
  }
`;
type Options = {
  portfolioId: number;
  title?: string;
  createdByUserId?: number;
  startDate?: Date;
  endDate?: Date;
  optimizationRiskLevel?: number;
  budgetDeltaHandlingPolicy?: NexoyaBudgetDeltaHandlingPolicy;
  budgetProposalTargetBiddingApplyMode?: NexoyaTargetBiddingApplyMode;
  portfolioDashboardUrls?: NexoyaPortfolioDashboardUrl[];
  skipTrainingDays?: number;
};

function useUpdatePortfolioMutation({
  portfolioId,
  title = null,
  startDate = null,
  endDate = null,
  optimizationRiskLevel = null,
  budgetDeltaHandlingPolicy = null,
  budgetProposalTargetBiddingApplyMode = null,
  portfolioDashboardUrls = [],
  skipTrainingDays = null,
}: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(UPDATE_PORTFOLIO_MUTATION, {
    awaitRefetchQueries: true,
    variables: {
      teamId,
      portfolioId,
      title: DOMPurify.sanitize(title, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
      startDate,
      endDate,
      optimizationRiskLevel,
      portfolioDashboardUrls,
      budgetDeltaHandlingPolicy,
      budgetProposalTargetBiddingApplyMode,
      skipTrainingDays,
    },
    onCompleted: () => {
      track(EVENT.PORTFOLIO_UPDATE);
      setTimeout(() => window.location.reload(), 500);
    },
  });
  return [mutation, state];
}

export { UPDATE_PORTFOLIO_MUTATION, useUpdatePortfolioMutation };
