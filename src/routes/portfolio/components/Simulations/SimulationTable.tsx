import React, { useEffect } from 'react';

import dayjs from 'dayjs';
import { toast } from 'sonner';
import { NumberParam, StringParam, useQueryParam, useQueryParams } from 'use-query-params';

import { NexoyaSimulation, NexoyaSimulationState } from '../../../../types';

import { useTeam } from '../../../../context/TeamProvider';
import { useArchiveSimulationMutation } from '../../../../graphql/simulation/mutationArchiveSimulation';
import { useRunSimulationMutation } from '../../../../graphql/simulation/mutationRunSimulation';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import { READABLE_FORMAT } from '../../../../utils/dates';
import { findAppliedScenario, getFormattedState } from '../../utils/simulation';

import { useDialogState } from '../../../../components/Dialog';
import FormattedCurrency from '../../../../components/FormattedCurrency';
import GridHeader from '../../../../components/GridHeader';
import GridWrap from '../../../../components/GridWrap';
import NumberValue from '../../../../components/NumberValue';
import * as Styles from '../../../../components/PerformanceTable/styles';
import Typography from '../../../../components/Typography';

import { TagStyled } from '../../styles/OptimizationProposal';

import { TypographyStyled, TypographyStyledAligned } from '../TargetItem/TargetItemsTable';
import SimulationArchiveDialog from './SimulationArchiveDialog';
import SimulationEdit from './SimulationEdit';
import SimulationReviewCreateDialog from './SimulationReviewCreateDialog';
import { SimulationTDM } from './SimulationTDM';
import { ClickableGridRow } from './styles';
import styled from 'styled-components';
import MultipleSwitch from '../../../../components/MultipleSwitchFluid';
import NoDataFound from '../../NoDataFound';
import SvgBudgetManualDefault from '../../../../components/icons/BudgetManualDefault';
import { SimulationMonitorUrlDialog } from './SimulationMonitorUrlDialog';
import { useSimulationSetMonitorUrlMutation } from '../../../../graphql/simulation/mutationSetMonitoringUrl';
import { SimulationChangeVisibilityDialog } from './SimulationChangeVisibilityDialog';
import { useMakeSimulationVisibleToAllUsers } from '../../../../graphql/simulation/mutationMakeVisibleToAllUsers';
import { useSimulationStore } from '../../../../store/simulation';

const SIMULATIONS_SWITCH_OPTIONS = [
  { id: 'current', text: 'Current' },
  { id: 'archived', text: 'Archived' },
];

export function SimulationTable({
  simulations,
  portfolioId,
}: {
  simulations: NexoyaSimulation[];
  portfolioId: number;
}) {
  const { selectedSimulation, setSelectedSimulation, filteredSimulations, setFilteredSimulations } =
    useSimulationStore();

  const [simulationSwitch = SIMULATIONS_SWITCH_OPTIONS[0].id, setSimulationSwitch] = useQueryParam(
    'simulationSwitch',
    StringParam,
  );

  const [, setQueryParams] = useQueryParams({
    simulationId: NumberParam,
    selectedScenarioId: NumberParam,
  });

  const { teamId } = useTeam();
  const {
    isOpen: isDialogStartSimulationOpen,
    openDialog: openRunDialog,
    closeDialog: closeRunDialog,
  } = useDialogState({
    initialState: false,
  });
  const {
    isOpen: isDialogArchiveOpen,
    openDialog: openArchiveDialog,
    closeDialog: closeArchiveDialog,
  } = useDialogState({
    initialState: false,
  });
  const {
    isOpen: isEditOpen,
    openDialog: openEdit,
    closeDialog: closeEdit,
  } = useDialogState({
    initialState: false,
  });
  const {
    isOpen: isSetMonitorUrlOpen,
    openDialog: openSetMonitorUrlDialog,
    closeDialog: closeSetMonitorUrlDialog,
  } = useDialogState({
    initialState: false,
  });

  const {
    isOpen: isChangeVisibilityDialogOpen,
    openDialog: openChangeVisibilityDialog,
    closeDialog: closeChangeVisibilityDialog,
  } = useDialogState({
    initialState: false,
  });

  const { runSimulation, loading: runSimulationLoading } = useRunSimulationMutation({ portfolioId });
  const { archiveSimulation, loading: archiveSimulationLoading } = useArchiveSimulationMutation({ portfolioId });
  const { setMonitorUrl, loading: setMonitorUrlLoading } = useSimulationSetMonitorUrlMutation({ portfolioId });
  const { changeSimulationVisibility, loading: changeVisibilityLoading } = useMakeSimulationVisibleToAllUsers({
    portfolioId,
  });

  useEffect(() => {
    switch (simulationSwitch) {
      case 'current':
        setFilteredSimulations(simulations.filter((simulation) => !simulation.isArchived));
        break;
      case 'archived':
        setFilteredSimulations(simulations.filter((simulation) => simulation.isArchived));
        break;
      default:
        setFilteredSimulations(simulations);
    }
  }, [simulationSwitch, simulations]);

  const handleStartSimulation = (simulationId: number) => {
    runSimulation({
      variables: {
        teamId: teamId,
        portfolioId: portfolioId,
        simulationId: simulationId,
      },
    })
      .then(() => {
        closeRunDialog();
        toast.success(`Simulation ${selectedSimulation.name} started`);
      })
      .catch((e) => toast.error(e.message));
  };

  const handleArchiveSimulation = (simulationId: number, isArchived: boolean) => {
    if (isArchived) {
      archiveSimulation({
        variables: {
          teamId: teamId,
          portfolioId: portfolioId,
          simulationId: simulationId,
          isArchived: false, // Unarchive
        },
      })
        .then(() => {
          closeArchiveDialog();
          toast.success(`Simulation ${selectedSimulation.name} unarchived`);
          track(EVENT.SIMULATION_UNARCHIVE);
        })
        .catch((e) => toast.error(e.message));
    } else {
      archiveSimulation({
        variables: {
          teamId: teamId,
          portfolioId: portfolioId,
          simulationId: simulationId,
          isArchived: true, // Archive
        },
      })
        .then(() => {
          closeArchiveDialog();
          toast.success(`Simulation ${selectedSimulation.name} archived`);
          track(EVENT.SIMULATION_ARCHIVE);
        })
        .catch((e) => toast.error(e.message));
    }
  };

  const handleSetMonitorUrl = (monitoringUrl: string) => {
    setMonitorUrl({
      variables: {
        teamId: teamId,
        portfolioId: portfolioId,
        simulationId: selectedSimulation.simulationId,
        monitoringUrl,
      },
    })
      .then(() => {
        closeSetMonitorUrlDialog();
        toast.success(`Monitoring URL set for simulation ${selectedSimulation.name}`);
      })
      .catch((e) => toast.error(e.message));
  };

  const handleSimulationClick = (simulation: NexoyaSimulation) => {
    switch (simulation.state) {
      case NexoyaSimulationState.Completed:
      case NexoyaSimulationState.Applied:
        const appliedScenarioId = simulation.scenarios.find((s) => s.isApplied)?.scenarioId || null;
        setQueryParams({ simulationId: simulation.simulationId, selectedScenarioId: appliedScenarioId });
        track(EVENT.SIMULATION_EXPLORE, {
          simulationId: simulation.simulationId,
          state: simulation.state,
        });
        break;
      case NexoyaSimulationState.Pending:
        setSelectedSimulation(simulation);
        openRunDialog();
        break;
    }
  };

  return (
    <div>
      <MultipleSwitch
        sections={SIMULATIONS_SWITCH_OPTIONS}
        initial={simulationSwitch}
        current={simulationSwitch}
        onToggle={(selectedOption) => {
          setSimulationSwitch(selectedOption);
          track(EVENT.SIMULATION_TAB_SWITCH(selectedOption));
        }}
      />
      {filteredSimulations?.length ? (
        <WrapStyled style={{ marginTop: '3rem' }}>
          <GridWrap>
            <GridHeader style={{ justifyItems: 'start' }}>
              <TypographyStyled>
                <span>Name</span>
              </TypographyStyled>
              <TypographyStyledAligned>
                <span>Range</span>
              </TypographyStyledAligned>
              <TypographyStyledAligned>
                <span>Steps between scenarios</span>
              </TypographyStyledAligned>
              <TypographyStyledAligned>
                <span>Timeframe</span>
              </TypographyStyledAligned>
              <TypographyStyledAligned>
                <span>Created at</span>
              </TypographyStyledAligned>
              <TypographyStyledAligned>
                <span>Applied at</span>
              </TypographyStyledAligned>
              <TypographyStyledAligned>
                <span>State</span>
              </TypographyStyledAligned>
            </GridHeader>

            {filteredSimulations?.map((simulation) => {
              const formattedState = getFormattedState(simulation.state);
              const appliedScenario = findAppliedScenario(simulation?.scenarios);
              return (
                <ClickableGridRow
                  disabled={simulation.state === NexoyaSimulationState.Running}
                  onClick={() => handleSimulationClick(simulation)}
                  style={{ justifyItems: 'start', padding: '12px 24px' }}
                  key={simulation.simulationId}
                >
                  <Styles.ContentRowStyled>
                    <Typography withTooltip={simulation.name.length > 30} withEllipsis style={{ maxWidth: 220 }}>
                      {simulation.name}
                    </Typography>
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled className="text-blueGrey">
                    <Typography>
                      <FormattedCurrency showDecimals={false} amount={simulation?.budget?.min} /> -{' '}
                      <FormattedCurrency showDecimals={false} amount={simulation?.budget?.max} />
                    </Typography>
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled className="text-blueGrey">
                    <Typography style={{ display: 'flex', gap: 4 }}>
                      <NumberValue value={simulation.budget.stepSize} /> ({simulation.budget.stepCount} scenarios)
                    </Typography>
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled className="text-blueGrey">
                    <Typography>
                      {dayjs(simulation.start).format(READABLE_FORMAT)} -{' '}
                      {dayjs(simulation.end).format(READABLE_FORMAT)}
                    </Typography>
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled className="text-blueGrey">
                    <Typography>{dayjs(simulation.createdAt).format(READABLE_FORMAT)}</Typography>
                  </Styles.ContentRowStyled>
                  {appliedScenario ? (
                    <Styles.ContentRowStyled className="text-blueGrey">
                      <Typography>
                        {dayjs(appliedScenario?.appliedAt).format(READABLE_FORMAT)}, Scenario{' '}
                        {simulation.scenarios.findIndex((s) => s.isApplied) + 1}
                      </Typography>
                    </Styles.ContentRowStyled>
                  ) : (
                    <Styles.ContentRowStyled className="text-neutral-200">
                      <Typography>No scenario applied</Typography>
                    </Styles.ContentRowStyled>
                  )}
                  <TagStyled bgColor={formattedState.color}>
                    <Typography style={{ fontWeight: 500 }}>{formattedState.label}</Typography>
                  </TagStyled>
                  <Styles.ContentRowStyled>
                    <div className="flex w-full justify-end">
                      <SimulationTDM
                        loading={runSimulationLoading || archiveSimulationLoading}
                        simulationId={simulation.simulationId}
                        state={simulation.state}
                        isArchived={simulation.isArchived}
                        endDate={simulation.end}
                        monitoringUrl={simulation.monitoringUrl}
                        onlyVisibleToSupportUsers={simulation?.onlyVisibleToSupportUsers}
                        handleExplore={(simulationId) => {
                          setQueryParams({ simulationId });
                          track(EVENT.SIMULATION_EXPLORE, {
                            simulationId: simulation.simulationId,
                            state: simulation.state,
                          });
                        }}
                        handleChangeVisibility={() => {
                          setSelectedSimulation(simulation);
                          openChangeVisibilityDialog();
                        }}
                        handleSetMonitorLink={() => {
                          setSelectedSimulation(simulation);
                          openSetMonitorUrlDialog();
                        }}
                        handleArchive={() => {
                          setSelectedSimulation(simulation);
                          openArchiveDialog();
                        }}
                        handleEdit={() => {
                          setSelectedSimulation(simulation);
                          openEdit();
                        }}
                        handleStart={() => {
                          setSelectedSimulation(simulation);
                          openRunDialog();
                        }}
                      />
                    </div>
                  </Styles.ContentRowStyled>
                </ClickableGridRow>
              );
            })}
          </GridWrap>
          {selectedSimulation && isDialogStartSimulationOpen ? (
            <SimulationReviewCreateDialog
              loading={runSimulationLoading}
              isOpen={isDialogStartSimulationOpen}
              onSaveForLater={null}
              onStartSimulation={() => handleStartSimulation(selectedSimulation.simulationId)}
              simulation={{
                end: selectedSimulation.end,
                start: selectedSimulation.start,
                min: selectedSimulation.budget.min,
                max: selectedSimulation.budget.max,
                name: selectedSimulation.name,
                budgetStepSize: selectedSimulation.budget.stepSize,
                scenarios: selectedSimulation.budget.stepCount,
                scenariosInput: {
                  // @ts-ignore
                  budgets: selectedSimulation.budget.steps.map((step) => ({
                    budget: step.budget,
                    isCustomScenario: step.isCustomScenario,
                  })),
                },
              }}
              onClose={closeRunDialog}
              onGoBack={closeRunDialog}
            />
          ) : null}
          {selectedSimulation && isDialogArchiveOpen ? (
            <SimulationArchiveDialog
              loading={archiveSimulationLoading}
              isOpen={isDialogArchiveOpen}
              onArchiveSimulation={() =>
                handleArchiveSimulation(selectedSimulation.simulationId, selectedSimulation.isArchived)
              }
              simulation={{
                end: selectedSimulation.end,
                start: selectedSimulation.start,
                min: selectedSimulation.budget.min,
                max: selectedSimulation.budget.max,
                name: selectedSimulation.name,
                budgetStepSize: selectedSimulation.budget.stepSize,
                scenarios: selectedSimulation.budget.stepCount,
                isArchived: selectedSimulation.isArchived,
                scenariosInput: {
                  // @ts-ignore
                  budgets: selectedSimulation.budget.steps.map((step) => ({
                    budget: step.budget,
                    isCustomScenario: step.isCustomScenario,
                    value: step.budget,
                  })),
                },
              }}
              onClose={closeArchiveDialog}
              onGoBack={closeArchiveDialog}
            />
          ) : null}
          {selectedSimulation && isSetMonitorUrlOpen ? (
            <SimulationMonitorUrlDialog
              currentMonitoringUrl={selectedSimulation.monitoringUrl}
              isOpen={isSetMonitorUrlOpen}
              onClose={closeSetMonitorUrlDialog}
              handleSave={(url) => handleSetMonitorUrl(url)}
              loading={setMonitorUrlLoading}
            />
          ) : null}
          {selectedSimulation && isChangeVisibilityDialogOpen ? (
            <SimulationChangeVisibilityDialog
              isOpen={isChangeVisibilityDialogOpen}
              onClose={closeChangeVisibilityDialog}
              loading={changeVisibilityLoading}
              handleSave={() =>
                changeSimulationVisibility({
                  variables: {
                    teamId: teamId,
                    portfolioId: portfolioId,
                    simulationId: selectedSimulation?.simulationId,
                  },
                })
                  .then(() => {
                    closeChangeVisibilityDialog();
                    toast.success(`Simulation ${selectedSimulation.name} was made visible to all users`);
                  })
                  .catch((e) => toast.error(e.message))
              }
            />
          ) : null}
          {selectedSimulation && isEditOpen ? (
            <SimulationEdit
              portfolioId={portfolioId}
              isSimulationEditOpen={isEditOpen}
              openSimulationEdit={openEdit}
              closeSimulationEdit={closeEdit}
              simulation={selectedSimulation}
            />
          ) : null}
        </WrapStyled>
      ) : (
        <div className="mt-4">
          <NoDataFound
            icon={<SvgBudgetManualDefault />}
            title={`No ${simulationSwitch} simulations found`}
            subtitle={`It looks like there are no ${simulationSwitch} simulations in this portfolio.`}
          />
        </div>
      )}
    </div>
  );
}

export const WrapStyled = styled.div<{
  extraColumn?: boolean;
}>`
  width: 100%;

  .NEXYCSSGrid {
    min-width: 100%;
    padding: 0 24px;
    grid-template-columns: 1fr 1fr 1fr 1fr 0.5fr 1fr 0.7fr 30px;
  }
`;
