import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const QUERY_SIMULATION_SUMMARY = gql`
  query NewSimulationSummary(
    $budgetMax: Int!
    $budgetMin: Int!
    $end: Date!
    $portfolioId: Int!
    $start: Date!
    $teamId: Int!
    $simulationId: Float
  ) {
    newSimulationSummary(
      budgetMax: $budgetMax
      budgetMin: $budgetMin
      end: $end
      portfolioId: $portfolioId
      start: $start
      teamId: $teamId
      simulationId: $simulationId
    ) {
      hasContentsWithBudgetLimits
      hasDisabledContents
      missingCurrencyCoverage {
        teamCurrency
        contentCurrency
        missingRanges {
          from
          to
        }
      }
      budgetPreviews {
        isDefaultScenario
        stepCount
        stepSize
        budgets {
          budget
          isBaseScenario
          isCustomScenario
        }
      }
    }
  }
`;

function useNewSimulationSummary({
  budgetMax,
  budgetMin,
  end,
  portfolioId,
  start,
}: {
  budgetMax: number;
  budgetMin: number;
  end: Date;
  portfolioId: number;
  start: Date;
}) {
  const { teamId } = useTeam();

  const query = useQuery(QUERY_SIMULATION_SUMMARY, {
    variables: {
      budgetMax,
      budgetMin,
      end,
      portfolioId,
      start,
      teamId,
    },
  });
  return query;
}

export { QUERY_SIMULATION_SUMMARY, useNewSimulationSummary };
