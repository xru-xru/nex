import { gql, useMutation } from '@apollo/client';

import { NexoyaBudgetDeltaHandlingPolicy, NexoyaPortfolioType } from '../../types';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import removeApolloCacheKeys from '../../utils/removeApolloCacheKeys';
import { format } from '../../utils/dates';

import { PORTFOLIOS_QUERY } from './queryPortfolios';

const CREATE_PORTFOLIO_MUTATION = gql`
  mutation CreatePortfolio(
    $teamId: Int!
    $title: String!
    $createdByUserId: Int!
    $description: String
    $type: PortfolioType!
    $startDate: DateTime!
    $endDate: DateTime!
    $defaultOptimizationTarget: FunnelStepType!
    $contents: [Float!]
    $optimizationRiskLevel: Int!
    $optimizationType: OptimizationType!
    $budgetDeltaHandlingPolicy: BudgetDeltaHandlingPolicy!
    $isAttributed: Boolean
  ) {
    createPortfolio(
      teamId: $teamId
      title: $title
      createdByUserId: $createdByUserId
      description: $description
      type: $type
      startDate: $startDate
      endDate: $endDate
      defaultOptimizationTarget: $defaultOptimizationTarget
      contents: $contents
      optimizationRiskLevel: $optimizationRiskLevel
      optimizationType: $optimizationType
      budgetDeltaHandlingPolicy: $budgetDeltaHandlingPolicy
      isAttributed: $isAttributed
    ) {
      portfolioId
      title
      startDate
      endDate
    }
  }
`;
type Options = {
  title: string;
  description?: string;
  type: NexoyaPortfolioType;
  startDate: Date;
  endDate: Date;
  createdByUserId: number;
  defaultOptimizationTarget: string;
  budgetDeltaHandlingPolicy: NexoyaBudgetDeltaHandlingPolicy;
  contents: any;
  // TODO: Change
  optimizationType: string;
  optimizationRiskLevel: number;
  order?: string;
  search?: string;
  isAttributed?: boolean;
};

function useCreatePortfolioMutation({
  title,
  description = null,
  type,
  startDate,
  endDate,
  createdByUserId,
  defaultOptimizationTarget,
  contents,
  optimizationType,
  optimizationRiskLevel,
  budgetDeltaHandlingPolicy,
  order = 'ASC',
  search = '',
  isAttributed = false,
}: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(CREATE_PORTFOLIO_MUTATION, {
    variables: {
      teamId,
      title,
      description,
      type,
      startDate: format(startDate, 'utcStartMidnight'),
      endDate: format(endDate, 'utcEndMidnight'),
      createdByUserId,
      defaultOptimizationTarget,
      budgetDeltaHandlingPolicy,
      contents,
      optimizationRiskLevel,
      optimizationType,
      isAttributed,
    },
    onCompleted: () => track(EVENT.PORTFOLIO_CREATE),
    update: (cache) => removeApolloCacheKeys(cache, 'portfolios'),
    // refetch query here or
    // pass reference to refetch of portfolios query
    refetchQueries: [
      {
        query: PORTFOLIOS_QUERY,
        variables: {
          teamId,
          after: null,
          first: 10,
          offset: null,
          sortBy: {
            field: 'title',
            order,
          },
          where: {
            search,
          },
        },
      },
    ],
  });
  return [mutation, state];
}

export { CREATE_PORTFOLIO_MUTATION, useCreatePortfolioMutation };
