import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const VALIDATION_QUERY = gql`
  query Validation(
    $portfolioId: Int!
    $teamId: Int!
    $funnelStepId: Int!
    $dateFrom: DateTime!
    $dateTo: DateTime!
    $baselineWindow: Int!
  ) {
    validation: portfolio(portfolioId: $portfolioId, teamId: $teamId) {
      validation(dateFrom: $dateFrom, dateTo: $dateTo, baselineWindow: $baselineWindow) {
        tooltip(funnelStepId: $funnelStepId) {
          funnelStep {
            funnel_step_id
          }
          validationDataTotal {
            totalAchieved
            gainLossTotal
          }
        }
        validationPerformance {
          funnelStep {
            title
            optimizationTargetType
            funnel_step_id
          }
          validationData {
            timestamp
            achieved
            optimized
            nonOptimized
          }
          validationDataTotal {
            totalAchieved
            totalOptimized
            totalNonOptimized
            costPerAchieved
            costPerOptimized
            costPerNonOptimized
            gainLossCostPer
            gainLossTotal
          }
        }
        validationReport {
          contentTitle
          parentContentTitle
          channelTitle
          spendings {
            proposed
            spent
            baseline
          }
          budgetChanges {
            suggestedPctChange
            appliedPctChange
            applicationDelta
          }
          valuesPerFunnel {
            funnelStepTitle
            funnelStepId
            costPer
            achieved
            optimized
            nonOptimized
          }
        }
      }
    }
  }
`;
type Options = {
  portfolioId: number;
  withBudget?: boolean;
  withOptimization?: boolean;
  withValidation?: boolean;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  skip?: boolean;
  funnelStepId?: number;
};

function useValidationQuery({
  portfolioId,
  withBudget = false,
  withOptimization = false,
  withValidation = false,
  skip = false,
  funnelStepId,
  dateFrom,
  dateTo,
}: Options) {
  const { teamId } = useTeam();
  const query = useQuery(VALIDATION_QUERY, {
    notifyOnNetworkStatusChange: true,
    skip,
    variables: {
      teamId,
      portfolioId,
      withBudget,
      withOptimization,
      withValidation,
      funnelStepId,
      dateFrom,
      dateTo,
      baselineWindow: 7,
    },
  });
  return query;
}

export { VALIDATION_QUERY, useValidationQuery };
