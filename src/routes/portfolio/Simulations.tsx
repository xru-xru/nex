import React from 'react';

import { NumberParam, useQueryParams } from 'use-query-params';

import { useSimulationsQuery } from '../../graphql/simulation/simulationsQuery';

import { Simulation } from './components/Simulations/Simulation';
import { SimulationTableSkeleton } from './components/Simulations/SimulationSkeleton';
import { SimulationTable } from './components/Simulations/SimulationTable';
import { orderBy } from 'lodash';
import useUserStore from '../../store/user';

type Props = {
  portfolioId: number;
};

export function Simulations({ portfolioId }: Props) {
  const { data, loading } = useSimulationsQuery({
    portfolioId,
  });

  const { isSupportUser } = useUserStore();
  const simulations = orderBy(
    data?.portfolioV2?.simulations || [],
    [
      // Sort: applied date descending (nulls last)
      (simulation) => (simulation?.scenario?.appliedAt ? new Date(simulation?.scenario?.appliedAt).getTime() : null),
      // Secondary: creation date descending
      (simulation) => new Date(simulation.createdAt).getTime(),
    ],
    ['desc', 'desc'], // Descending order for both
  );

  const [queryParams] = useQueryParams({
    simulationId: NumberParam,
  });

  if (loading) return <SimulationTableSkeleton />;

  return queryParams.simulationId ? (
    <Simulation simulationId={queryParams.simulationId} portfolioId={portfolioId} />
  ) : (
    <SimulationTable
      simulations={isSupportUser ? simulations : simulations?.filter((s) => !s.onlyVisibleToSupportUsers)}
      portfolioId={portfolioId}
    />
  );
}
