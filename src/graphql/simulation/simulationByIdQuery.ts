import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { SCENARIO_FRAGMENT, SCENARIO_FUNNEL_STEP, SCENARIO_METRICS, SCENARIO_TOTAL_METRICS } from './fragments';

const SIMULATION_BY_ID_QUERY = gql`
  query SimulationById($teamId: Int!, $portfolioId: Int!, $simulationId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      simulation(simulationId: $simulationId) {
        simulationId
        start
        end
        state
        createdAt
        name
        isArchived
        monitoringUrl
        portfolioEvents {
          portfolioEventId
          name
          start
          end
          category
          impact
          contentIds
        }
        budget {
          max
          min
          stepCount
        }
        scenarios {
          ...ScenarioFragment
        }
        ignoreContentBudgetLimits
        skipNonOptimizedContentBudgets
        budgetPacing
        onlyVisibleToSupportUsers
      }
    }
  }
  ${SCENARIO_FRAGMENT}
  ${SCENARIO_FUNNEL_STEP}
  ${SCENARIO_METRICS}
  ${SCENARIO_TOTAL_METRICS}
`;

type Options = {
  portfolioId: number;
  simulationId: number;
};

function useSimulationByIdQuery({ portfolioId, simulationId }: Options): any {
  const { teamId } = useTeam();

  const query = useQuery(SIMULATION_BY_ID_QUERY, {
    variables: {
      teamId,
      portfolioId,
      simulationId,
    },
  });
  return query;
}

export { SIMULATION_BY_ID_QUERY, useSimulationByIdQuery };
