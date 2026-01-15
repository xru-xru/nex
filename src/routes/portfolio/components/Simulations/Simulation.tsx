import React, { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { orderBy, sortBy } from 'lodash';
import { NumberParam, StringParam, useQueryParams } from 'use-query-params';

import { ExtendedNexoyaSimulationScenario, NexoyaSimulation, NexoyaSimulationBudgetPacing } from '../../../../types';

import { useSimulationByIdQuery } from '../../../../graphql/simulation/simulationByIdQuery';

import { READABLE_FORMAT } from '../../../../utils/dates';
import {
  createAxisOptions,
  getMetricTitle,
  getNumberType,
  getSelectedMetric,
  getValueBasedOnAxis,
} from '../../utils/simulation';

import Button from '../../../../components/Button';
import useDialogState from '../../../../components/Dialog/useDialogState';
import Typography from '../../../../components/Typography';

import { ScenarioMetricsPanel } from './ScenarioMetricsPanel';
import { SimulationSkeleton } from './SimulationSkeleton';
import { SimulationSlider } from './SimulationSlider';
import { AxisSelector } from './charts/AxisSelector';
import { MetricOverview } from './charts/MetricOverview';
import SimulationOverview from './charts/SimulationOverview';
import { ChartContainerStyled, Container, HeaderContainer, MetricsContainer } from './styles';
import { ComparisonTableDialog } from './table/ComparisonTableDialog';
import { BackButtonStyled } from '../../../../components/Sidebar/components/BackButton';
import Switch from '../../../../components/Switch';
import { SwitchContainerStyled } from '../Funnel/styles';
import { usePortfolio } from '../../../../context/PortfolioProvider';
import { useSimulationStore } from '../../../../store/simulation';

export function Simulation({ simulationId, portfolioId }) {
  const {
    performanceChart: { showEvents, setShowEvents },
  } = usePortfolio();

  const { selectedScenario, setSelectedScenario } = useSimulationStore();
  const [axisMetrics, setAxisMetrics] = useState<any>();
  const [queryParams, setQueryParams] = useQueryParams({
    scenarioSelectedMetric: StringParam,
    scenarioMetricSwitch: StringParam,
    selectedScenarioId: NumberParam,
    xAxis: StringParam,
    yAxis: StringParam,
  });

  const { data, loading, error } = useSimulationByIdQuery({
    portfolioId,
    simulationId,
  });

  const { isOpen, closeDialog, openDialog } = useDialogState({
    initialState: false,
  });

  const simulation: NexoyaSimulation = data?.portfolioV2?.simulation;
  // Adding the index so we can use it in the UI to display the scenario number instead of the scenario ID
  // this is helpful when hiding/showing the scenario to not lose the index
  const scenarios: ExtendedNexoyaSimulationScenario[] = orderBy(
    simulation?.scenarios,
    'budget.totals.currentScenarioTotal',
  ).map((sc, idx) => ({
    ...sc,
    idx: idx + 1,
  }));

  const axisOptions = useMemo(
    () => createAxisOptions({ funnelSteps: selectedScenario?.funnelSteps }),
    [selectedScenario],
  );

  useEffect(() => {
    let defaultScenario = scenarios?.find((sc) => sc.isBaseScenario) || scenarios?.[0];
    if (queryParams.selectedScenarioId) {
      defaultScenario = scenarios?.find((sc) => sc.scenarioId === queryParams.selectedScenarioId);
    }
    setSelectedScenario(defaultScenario);
  }, [queryParams.selectedScenarioId, simulation]);

  useEffect(() => {
    if (simulation && !loading) {
      setAxisMetrics(
        orderBy(
          scenarios?.map((sc) => {
            const xAxisValue = getValueBasedOnAxis({ scenario: sc, axis: queryParams.xAxis });
            const yAxisValue = getValueBasedOnAxis({ scenario: sc, axis: queryParams.yAxis });

            return {
              yAxis: {
                name: yAxisValue.name,
                scenarioId: sc.scenarioId,
                isBaseScenario: sc.isBaseScenario,
                isApplied: sc.isApplied,
                baseScenario: yAxisValue?.baseScenario,
                currentScenario: yAxisValue?.currentScenario,
                changePercent: yAxisValue?.changePercent,
                label: yAxisValue?.reliabilityLabel,
              },
              xAxis: {
                name: xAxisValue.name,
                scenarioId: sc.scenarioId,
                isBaseScenario: sc.isBaseScenario,
                isApplied: sc.isApplied,
                baseScenario: xAxisValue?.baseScenario,
                currentScenario: xAxisValue?.currentScenario,
                changePercent: xAxisValue?.changePercent,
                label: yAxisValue?.reliabilityLabel,
              },
            };
          }),
          ['xAxis.currentScenario', 'yAxis.currentScenario'],
          ['asc', 'asc'],
        ),
      );
    }
  }, [simulation, queryParams.xAxis, queryParams.yAxis]);

  if (loading) {
    return <SimulationSkeleton />;
  }

  if (error) {
    throw new Error("There's been an error while getting the simulation data");
  }

  const selectedMetric = getSelectedMetric(selectedScenario, queryParams?.scenarioSelectedMetric?.toLowerCase());

  const budgetPacingLabel =
    simulation?.budgetPacing === NexoyaSimulationBudgetPacing.Dynamic ? 'Automated budget strategy' : '';
  return (
    <Container>
      <div>
        <HeaderContainer>
          <div className="flex flex-col gap-2">
            <Typography variant="h3">
              {simulation?.name}: {dayjs(simulation?.start).format('D MMM')} -{' '}
              {dayjs(simulation?.end).format(READABLE_FORMAT)}
            </Typography>
            <Typography variant="subtitle">{budgetPacingLabel}</Typography>
          </div>
          <div className="flex gap-2">
            {simulation.monitoringUrl ? (
              <Button
                onClick={() => window.open(simulation.monitoringUrl, '_blank')}
                color="secondary"
                variant="contained"
              >
                Monitor simulation
              </Button>
            ) : null}
            <Button onClick={openDialog} color="primary" variant="contained">
              Compare scenarios
            </Button>
          </div>
        </HeaderContainer>
        <SimulationSlider
          scenarioBudgets={sortBy(
            scenarios?.map((sc) => ({
              scenarioId: sc.scenarioId,
              budget: sc.budget.totals.currentScenarioTotal,
              isBaseScenario: sc.isBaseScenario,
            })),
            'budget',
          )}
        />
      </div>
      <MetricsContainer>
        {selectedScenario ? (
          <ScenarioMetricsPanel
            simulationHasBaseScenario={scenarios.some((s) => s.isBaseScenario)}
            simulationId={simulationId}
            portfolioId={portfolioId}
            scenario={selectedScenario}
            start={simulation.start}
            end={simulation.end}
          />
        ) : null}
        <ChartContainerStyled>
          {queryParams?.scenarioSelectedMetric ? (
            <>
              <div className="flex justify-between">
                <BackButtonStyled
                  style={{ display: 'flex' }}
                  onClick={() => {
                    setQueryParams({
                      scenarioSelectedMetric: undefined,
                    });
                  }}
                >
                  <span>←</span>
                  Back to overview
                </BackButtonStyled>
                <div>
                  <SwitchContainerStyled>
                    <Typography style={{ fontSize: 12, fontWeight: 500 }}>Show events</Typography>
                    <Switch onToggle={() => setShowEvents(!showEvents)} isOn={showEvents} />
                  </SwitchContainerStyled>
                </div>
              </div>
              <MetricOverview
                dailyMetrics={selectedMetric}
                isBaseScenarioSelected={selectedScenario?.isBaseScenario}
                numberType={getNumberType(queryParams?.scenarioSelectedMetric)}
                metricSwitch={queryParams.scenarioMetricSwitch === 'cost-per' ? 'costPer' : 'value'}
                title={getMetricTitle(queryParams.scenarioMetricSwitch, queryParams.scenarioSelectedMetric)}
                portfolioEvents={simulation?.portfolioEvents}
              />
            </>
          ) : (
            <>
              <AxisSelector options={axisOptions} targetFunnelStep={selectedScenario?.targetFunnelStep} />
              {axisMetrics ? (
                <SimulationOverview
                  axisMetrics={axisMetrics || []}
                  selectedScenarioId={selectedScenario?.scenarioId}
                  appliedScenario={scenarios.find((s) => s.isApplied)}
                  simulationHasBaseScenario={scenarios.some((s) => s.isBaseScenario)}
                />
              ) : null}
            </>
          )}
        </ChartContainerStyled>
      </MetricsContainer>
      {isOpen ? (
        <ComparisonTableDialog
          simulationId={simulationId}
          portfolioId={portfolioId}
          isOpen={isOpen}
          onClose={closeDialog}
          scenarios={scenarios}
        />
      ) : null}
    </Container>
  );
}
