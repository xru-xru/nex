import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const SIMULATIONS_QUERY = gql`
  query Simulations($teamId: Int!, $portfolioId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      simulations {
        simulationId
        createdAt
        start
        end
        name
        state
        isArchived
        monitoringUrl
        ignoreContentBudgetLimits
        skipNonOptimizedContentBudgets
        budgetPacing
        onlyVisibleToSupportUsers
        scenarios {
          scenarioId
          isApplied
          appliedAt
        }
        budget {
          min
          max
          stepCount
          stepSize
          steps {
            budget
            isCustomScenario
          }
        }
      }
    }
  }
`;

type Options = {
  portfolioId: number;
};

function useSimulationsQuery({ portfolioId }: Options): any {
  const { teamId } = useTeam();

  const query = useQuery(SIMULATIONS_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      teamId,
      portfolioId,
    },
  });
  return query;
}

export { SIMULATIONS_QUERY, useSimulationsQuery };
