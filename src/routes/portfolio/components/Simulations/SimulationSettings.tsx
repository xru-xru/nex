import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { CirclePlus, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useRouteMatch } from 'react-router';

import { useLazyQuery } from '@apollo/client';
import { ScrollArea } from 'components-ui/ScrollArea';
import dayjs from 'dayjs';
import { cn } from 'lib/utils';
import { sortBy, toNumber } from 'lodash';
import styled from 'styled-components';

import {
  NexoyaNewSimulationSummary,
  NexoyaSimulationBudgetPacing,
  NexoyaSimulationBudgetPreview,
  NexoyaSimulationState,
} from '../../../../types';

import { useTeam } from '../../../../context/TeamProvider';
import { NexoyaLocalSimulationInput, ScenarioCreationBudget } from '../../../../controllers/SimulationController';
import { QUERY_SIMULATION_SUMMARY } from '../../../../graphql/simulation/querySimulationSummary';

import { GLOBAL_DATE_FORMAT } from '../../../../utils/dates';
import { formatNumber } from '../../../../utils/formater';
import { hasCustomScenarioDuplicates, isEditSimulationDisabled } from '../../utils/simulation';

import MenuList from '../../../../components/ArrayMenuList/ArrayMenuList';
import Button from '../../../../components/Button';
import ButtonAdornment from '../../../../components/ButtonAdornment';
import ButtonLoader from '../../../../components/ButtonLoader';
import Dialog, { useDialogState } from '../../../../components/Dialog';
import DialogContent from '../../../../components/DialogContent';
import DialogTitle from '../../../../components/DialogTitle';
import Fieldset from '../../../../components/Form/Fieldset';
import FormGroup from '../../../../components/Form/FormGroup';
import { useMenu } from '../../../../components/Menu';
import MenuItem from '../../../../components/MenuItem';
import NumberValue from '../../../../components/NumberValue';
import Panel from '../../../../components/Panel';
import TextField from '../../../../components/TextField';
import Tooltip from '../../../../components/Tooltip';
import Typography from '../../../../components/Typography';
import SvgCaretDown from '../../../../components/icons/CaretDown';
import SvgCheckCircle from '../../../../components/icons/CheckCircle';
import SvgInfoCircle from '../../../../components/icons/InfoCircle';
import SvgQuestionCircle from '../../../../components/icons/QuestionCircle';
import DialogActions from 'components/DialogActions';

import { TooltipLimitedContainer, TooltipLimitedTextContainer } from '../../styles/OptimizationProposal';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components-ui/AlertDialog';
import { Button as ShadcnButton } from '../../../../components-ui/Button';
import { nexyColors } from '../../../../theme';
import { StatusWrapperStyled } from '../LaunchOptimization/styles';
import Checkbox from '../../../../components/Checkbox';
import PortfolioFeatureSwitch from 'components/PortfolioFeatureSwitch';
import { PORTFOLIO_FEATURE_FLAGS } from 'constants/featureFlags';
import { useCurrencyStore } from 'store/currency-selection';
import { useTenantName } from '../../../../hooks/useTenantName';

const WrapStyled = styled.div`
  .NEXYH3 {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    svg {
      display: inline-block;
      font-size: 32px;
      margin-right: 12px;
    }
  }

  .NEXYButtonBase {
    width: 100%;
    padding: 12px 16px;
    justify-content: flex-start;
    font-weight: 400;

    .NEXYButtonLabel {
      display: flex;
      gap: 6px;
    }

    &:disabled {
      background: ${nexyColors.seasalt};
      box-shadow: none;
      opacity: 1;
      color: ${nexyColors.coolGray};
    }
  }

  .NEXYButtonAdornment.end {
    margin-left: auto;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  padding: 0 !important;
  label {
    color: ${nexyColors.neutral500};

    font-size: 12px;
    font-weight: 500;
    text-align: left;
  }

  .label {
    span {
      min-width: 16px;
      width: 28px;
      height: 16px;
    }
  }
`;

const StyledMenuItem = styled(MenuItem)`
  .NEXYButtonLabel {
    display: flex;
    gap: 6px;
  }
`;

const BudgetRangeContainer = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 16px;
`;

const StepScenariosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 400px;
  padding: 8px;
  border-radius: 5px;
  background: ${nexyColors.seasalt};
  margin-top: 20px;
`;

const TypographyWithTooltipContainer = styled.div`
  display: inline-flex;
  align-items: center;
`;

const TooltipContentContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  color: #e3e4e8;

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 18px */
  letter-spacing: 0.36px;
`;

const StyledTextField = styled(TextField)<{
  hasError: boolean;
}>`
  .NEXYInputWrap {
    padding: 8px 16px;
    box-shadow: ${({ hasError }) => (hasError ? `${nexyColors.orangeyRed} 0px 0px 0px 1px` : '')};
  }
`;

interface Props {
  handleChangeValueByKey: (ev: { target: { name: string; value: unknown } }) => void;
  handleChangeBudgetRange: (ev: { target: { name: string; value: unknown } }) => void;
  simulation: NexoyaLocalSimulationInput;
  setSimulationState: (state: any) => void;
}

export const SimulationSettings = ({
  simulation,
  setSimulationState,
  handleChangeValueByKey,
  handleChangeBudgetRange,
}: Props) => {
  const { teamId } = useTeam();
  const tenantName = useTenantName();

  const closeDelayRef = useRef<number | null>(null);
  const match = useRouteMatch();

  const { currency, numberFormat, setMissingCurrencyCoverage } = useCurrencyStore();

  const portfolioId = parseInt(match.params.portfolioID, 10);
  const [simulationSteps, setSimulationSteps] = useState<NexoyaSimulationBudgetPreview[]>([]);
  const [newSimulationSummary, setNewSimulationSummary] = useState<NexoyaNewSimulationSummary>();
  const [selectedSimulationSteps, setSelectedSimulationSteps] = useState<NexoyaSimulationBudgetPreview>();

  const [loadNewSimulationSummary, { loading }] = useLazyQuery(QUERY_SIMULATION_SUMMARY);

  const { anchorEl, open, toggleMenu, closeMenu } = useMenu();
  const { anchorEl: tooltipAnchorEl, open: tooltipOpen, closeMenu: closeTooltip, openMenu: openTooltip } = useMenu();
  const {
    anchorEl: baseScTooltipAnchorEl,
    open: baseScIsTooltipOpen,
    closeMenu: baseScCloseTooltip,
    openMenu: baseScOpenTooltip,
  } = useMenu();
  const {
    isOpen: isMoreDetailsDialogOpen,
    openDialog: openMoreDetailsDialog,
    closeDialog: closeMoreDetailsDialog,
  } = useDialogState();

  const { min, max, budgetStepSize, start, end, budgetRange, scenariosInput, ignoreContentBudgetLimits } = simulation;

  const [localCustomScenarios, setLocalCustomScenarios] = useState<ScenarioCreationBudget[]>(
    scenariosInput?.budgets
      ?.filter((scb) => scb.isCustomScenario)
      ?.map((scb) => ({
        ...scb,
        isPersisted: true,
        value: scb.budget,
        formattedValue: toNumber(scb.budget).toLocaleString(numberFormat, {
          maximumFractionDigits: 2,
          currency,
          style: 'currency',
        }),
        isFocused: false,
      })) || [
      {
        budget: undefined,
        value: undefined,
        formattedValue: '',
        isFocused: false,
        isCustomScenario: true,
        isBaseScenario: false,
      },
    ],
  );

  const baseScenarioBudget = selectedSimulationSteps?.budgets?.find((b) => b.isBaseScenario)?.budget;

  useEffect(() => {
    if (simulationSteps.length) {
      setSelectedSimulationSteps(simulationSteps.find((step) => step.stepSize === budgetStepSize));
    } else {
      setSelectedSimulationSteps(simulation.scenariosInput);
    }
  }, [simulationSteps, budgetStepSize]);

  useEffect(() => {
    if (selectedSimulationSteps?.budgets) {
      setSimulationState((prevState) => ({
        ...prevState,
        scenariosInput: selectedSimulationSteps,
      }));
    }
  }, [selectedSimulationSteps]);

  useEffect(() => {
    if (
      (simulation.min && typeof simulation.min === 'number') ||
      (simulation.max && typeof simulation.max === 'number')
    ) {
      numberToText({ propertyKey: 'min', numberToConvert: min });
      numberToText({ propertyKey: 'max', numberToConvert: max });
    }
    return () => {
      if (closeDelayRef.current !== null) {
        clearTimeout(closeDelayRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      budgetRange?.min &&
      budgetRange?.max &&
      (!simulation.state || simulation.state === NexoyaSimulationState.Pending)
    ) {
      loadNewSimulationSummary({
        fetchPolicy: 'network-only',
        variables: {
          budgetMin: toNumber(budgetRange.min),
          budgetMax: toNumber(budgetRange.max),
          start: dayjs(start).format(GLOBAL_DATE_FORMAT),
          end: dayjs(end).format(GLOBAL_DATE_FORMAT),
          simulationId: simulation.simulationId,
          portfolioId,
          teamId,
        },
      }).then(({ data }) => {
        setMissingCurrencyCoverage(data?.newSimulationSummary?.missingCurrencyCoverage.length > 0);
        setSimulationSteps(data?.newSimulationSummary?.budgetPreviews || []);
        setNewSimulationSummary(data?.newSimulationSummary || []);
        setSimulationState((prevState) => ({
          ...prevState,
          skipNonOptimizedContentBudgets: false,
          ignoreContentBudgetLimits: false,
        }));
      });
    }
  }, [budgetRange]);

  // Function to handle adding a new scenario
  const addScenario = () => {
    setLocalCustomScenarios((prevState) => [
      ...prevState,
      {
        value: undefined,
        formattedValue: '',
        isFocused: false,
        budget: undefined,
        isBaseScenario: false,
        isCustomScenario: true,
      },
    ]);
  };

  // Function to handle deleting a scenario
  const deleteScenario = (idx) => {
    setLocalCustomScenarios((prevState) => prevState.filter((_, i) => i !== idx));
  };

  // Function to handle scenario value change
  const handleScenarioChange = (idx, value) => {
    const newValue = parseFloat(value.replace(/\D/g, '')) || undefined;
    setLocalCustomScenarios((prevState) =>
      prevState.map((scenario, i) =>
        i === idx
          ? {
              ...scenario,
              value: newValue || undefined,
              isPersisted: scenario.isPersisted || false,
              formattedValue: newValue
                ? toNumber(newValue).toLocaleString(numberFormat, {
                    maximumFractionDigits: 2,
                    currency,
                    style: 'currency',
                  })
                : '',
            }
          : scenario,
      ),
    );
  };

  // Function to handle scenario focus
  const handleScenarioFocus = (idx) => {
    setLocalCustomScenarios((prevState) =>
      prevState.map((scenario, i) => (i === idx ? { ...scenario, isFocused: true } : scenario)),
    );
  };

  // Function to handle scenario blur
  const handleScenarioBlur = (idx) => {
    setLocalCustomScenarios((prevState) =>
      prevState.map((scenario, i) => (i === idx ? { ...scenario, isFocused: false } : scenario)),
    );
  };

  // Function to handle adding/updating scenarios to selectedSimulationSteps
  const updateScenarios = () => {
    if (!selectedSimulationSteps) {
      return;
    }

    const newScenarios = localCustomScenarios
      .filter((c) => c.value)
      .map((c) => ({
        budget: c.value,
        isBaseScenario: false,
        isCustomScenario: true,
        isPersisted: c.isPersisted || false, // Ensure isPersisted is carried over
      }));

    setSelectedSimulationSteps((prevState) => {
      if (!prevState) {
        return {
          ...selectedSimulationSteps,
          budgets: newScenarios,
        };
      }

      const updatedBudgets = [...prevState.budgets.filter((b) => !b.isCustomScenario), ...newScenarios];

      return {
        ...prevState,
        budgets: updatedBudgets,
      };
    });

    // Update local state to mark scenarios as persisted
    setLocalCustomScenarios((prevState) =>
      prevState.map((scenario) => ({
        ...scenario,
        isPersisted: true,
      })),
    );
  };

  const handleCloseWithDelay = () => {
    if (closeDelayRef.current !== null) {
      clearTimeout(closeDelayRef.current);
    }
    closeDelayRef.current = window.setTimeout(() => {
      closeTooltip();
      baseScCloseTooltip();
    }, 100); // Delay close to allow the user to click on "See details"
  };

  const handleMouseEnter = (callback: () => void) => {
    if (closeDelayRef.current !== null) {
      clearTimeout(closeDelayRef.current);
      closeDelayRef.current = null;
    }
    callback();
  };

  const textToNumber = ({ propertyKey, lastNumber }) => {
    handleChangeValueByKey({ target: { name: propertyKey, value: lastNumber } });
  };

  const numberToText = ({ numberToConvert, propertyKey }: { numberToConvert: any; propertyKey: any }) => {
    if (numberToConvert === null || numberToConvert === '') {
      handleChangeBudgetRange({
        target: {
          name: propertyKey,
          value: null,
        },
      });
      handleChangeValueByKey({ target: { name: propertyKey, value: null } });
      return;
    }

    if (isNaN(numberToConvert)) {
      const numericValue = numberToConvert ? numberToConvert.replace(/[^\d]/g, '') : '';
      numberToConvert = numericValue;
    }

    handleChangeBudgetRange({
      target: {
        name: propertyKey,
        value: numberToConvert?.toString() || '',
      },
    });

    handleChangeValueByKey({
      target: {
        name: propertyKey,
        value: (+numberToConvert).toLocaleString(numberFormat, {
          maximumFractionDigits: 2,
          currency,
          style: 'currency',
        }),
      },
    });
  };

  const disableUpdateCustomScenarios = localCustomScenarios.some((c, idx) =>
    hasCustomScenarioDuplicates(c, selectedSimulationSteps, idx, localCustomScenarios),
  );

  return (
    <>
      <WrapStyled
        style={{
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Fieldset>
          <FormGroup>
            <Typography variant="h3">Budget range</Typography>
            <Typography
              variant="subtitle"
              withEllipsis={false}
              style={{ fontSize: 12, marginBottom: 16, maxWidth: 400, color: nexyColors.paleSlateGray }}
            >
              What budget range would you like to simulate?
            </Typography>
            <BudgetRangeContainer>
              <TextField
                disabled={isEditSimulationDisabled(simulation.state)}
                labelVariant="light"
                label="from"
                id="budget-limit-input"
                name="min"
                placeholder="Enter min. budget"
                step={0.01}
                value={min ?? ''}
                onFocus={() => textToNumber({ propertyKey: 'min', lastNumber: budgetRange.min })}
                onBlur={() => {
                  numberToText({ propertyKey: 'min', numberToConvert: min });
                  handleChangeValueByKey({
                    target: { name: 'budgetStepSize', value: null },
                  });
                  handleChangeValueByKey({
                    target: { name: 'budgetStepCount', value: null },
                  });
                }}
                onChange={handleChangeValueByKey}
                error={true}
              />
              <TextField
                disabled={isEditSimulationDisabled(simulation.state)}
                labelVariant="light"
                label="to"
                id="budget-limit-input"
                name="max"
                placeholder="Enter max. budget"
                step={0.01}
                value={max ?? ''}
                onFocus={() => textToNumber({ propertyKey: 'max', lastNumber: budgetRange.max })}
                onBlur={() => {
                  numberToText({ propertyKey: 'max', numberToConvert: max });
                  handleChangeValueByKey({
                    target: { name: 'budgetStepSize', value: null },
                  });
                  handleChangeValueByKey({
                    target: { name: 'budgetStepCount', value: null },
                  });
                }}
                onChange={handleChangeValueByKey}
                error={true}
              />
            </BudgetRangeContainer>
            {toNumber(budgetRange?.min) > toNumber(budgetRange?.max) ? (
              <Typography style={{ color: nexyColors.orangeyRed, fontSize: 13, marginTop: 8, marginLeft: 2 }}>
                The min. budget must be lower than the max. budget
              </Typography>
            ) : null}
          </FormGroup>
          <FormGroup style={{ marginTop: 48 }}>
            <TypographyWithTooltipContainer>
              <Typography variant="h3">Budget steps between scenarios</Typography>
              <Panel
                color="dark"
                onMouseLeave={handleCloseWithDelay}
                onMouseEnter={() => handleMouseEnter(openTooltip)}
                open={tooltipOpen}
                variant="dark"
                anchorEl={tooltipAnchorEl.current}
                placement="right-start"
                style={{ maxHeight: 250, width: 475 }}
                popperProps={{ enableScheduleUpdate: true, style: { zIndex: 1305 } }}
              >
                <TooltipLimitedContainer style={{ color: 'white', padding: 12 }}>
                  <TooltipLimitedTextContainer>
                    <TooltipContentContainer>
                      <div>This selection determines the number of scenarios {tenantName} will create.</div>
                      <div>
                        Note: The portfolio has a planned budget of {formatNumber(baseScenarioBudget)} during your
                        selected timeframe for this simulation. This value will be used for the base scenario for this
                        simulation.
                      </div>
                      <Button
                        onClick={() => {
                          openMoreDetailsDialog();
                          closeTooltip();
                        }}
                        style={{ textDecoration: 'underline', color: nexyColors.white }}
                      >
                        More details
                      </Button>
                    </TooltipContentContainer>
                  </TooltipLimitedTextContainer>
                </TooltipLimitedContainer>
              </Panel>
              {baseScenarioBudget ? (
                <div
                  onMouseEnter={() => handleMouseEnter(openTooltip)}
                  onMouseLeave={handleCloseWithDelay}
                  ref={tooltipAnchorEl}
                >
                  <SvgQuestionCircle
                    style={{ width: 16, height: 16, color: nexyColors.cloudyBlue, margin: '0 0 16px 8px' }}
                  />
                </div>
              ) : null}
            </TypographyWithTooltipContainer>
            <Typography
              variant="subtitle"
              withEllipsis={false}
              style={{ fontSize: 12, marginBottom: 16, maxWidth: 400, color: nexyColors.paleSlateGray }}
            >
              Select the steps between your minimum and maximum budget within the budget range.
            </Typography>
            <Button
              id="budgetStepSelector"
              active={open}
              variant="contained"
              color="secondary"
              flat
              type="button"
              onClick={toggleMenu}
              loading={loading}
              disabled={
                isEditSimulationDisabled(simulation.state) ||
                !min ||
                !max ||
                loading ||
                toNumber(budgetRange?.min) > toNumber(budgetRange?.max)
              }
              ref={anchorEl}
              endAdornment={
                <ButtonAdornment position="end">
                  <SvgCaretDown
                    style={{
                      transform: `rotate(${open ? '180' : '0'}deg)`,
                    }}
                  />
                </ButtonAdornment>
              }
            >
              {selectedSimulationSteps ? (
                <>
                  <NumberValue value={selectedSimulationSteps?.stepSize} numberFormatProp="en-US" />(
                  {selectedSimulationSteps?.stepCount} scenarios)
                </>
              ) : loading ? (
                <ButtonLoader color="secondary" variant="contained" />
              ) : (
                'Select budget steps'
              )}
            </Button>
            <Panel
              container={anchorEl.current}
              anchorEl={anchorEl.current}
              open={open}
              onClose={closeMenu}
              placement="bottom"
              popperProps={{
                style: {
                  width: '100%',
                  zIndex: 35000,
                },
              }}
              style={{
                minWidth: '100%',
              }}
            >
              <MenuList color="dark">
                {simulationSteps?.map((simulationBudgetPreview, idx) => (
                  <StyledMenuItem
                    key={idx + 'handle-change-simulation'}
                    onClick={() => {
                      handleChangeValueByKey({
                        target: { name: 'budgetStepSize', value: simulationBudgetPreview.stepSize },
                      });
                      handleChangeValueByKey({
                        target: { name: 'budgetStepCount', value: simulationBudgetPreview?.stepCount },
                      });
                      toggleMenu();
                    }}
                    color="dark"
                  >
                    <NumberValue
                      style={{ color: nexyColors.white }}
                      value={simulationBudgetPreview.stepSize}
                      numberFormatProp="en-US"
                    />
                    <div>({simulationBudgetPreview?.stepCount} scenarios)</div>
                  </StyledMenuItem>
                ))}
              </MenuList>
            </Panel>
            {selectedSimulationSteps ? (
              <StepScenariosContainer>
                <ScrollArea className="max-h-32 w-full">
                  {sortBy(selectedSimulationSteps.budgets, 'budget')?.map((scenarioCreationBudget, idx) => (
                    <div
                      key={scenarioCreationBudget.budget}
                      className={cn('flex flex-row gap-1 pb-0.5 pl-3 decoration-1')}
                    >
                      &#8226; Scenario {idx + 1}:
                      {scenarioCreationBudget.isBaseScenario ? (
                        <span
                          onMouseEnter={() => handleMouseEnter(baseScOpenTooltip)}
                          onMouseLeave={handleCloseWithDelay}
                          ref={baseScTooltipAnchorEl}
                          style={{ color: nexyColors.lilac, display: 'flex', gap: 4, alignItems: 'center' }}
                        >
                          <NumberValue value={scenarioCreationBudget.budget} numberFormatProp="en-US" />
                          (base scenario) <SvgInfoCircle style={{ width: 12, height: 12, color: nexyColors.lilac }} />
                        </span>
                      ) : (
                        <NumberValue value={scenarioCreationBudget.budget} numberFormatProp="en-US" />
                      )}
                    </div>
                  ))}
                  <Panel
                    color="dark"
                    onMouseLeave={handleCloseWithDelay}
                    onMouseEnter={() => handleMouseEnter(baseScOpenTooltip)}
                    open={baseScIsTooltipOpen}
                    variant="dark"
                    anchorEl={baseScTooltipAnchorEl.current}
                    placement="right"
                    style={{ maxHeight: 250, width: 475 }}
                    popperProps={{ enableScheduleUpdate: true, style: { zIndex: 1300 } }}
                  >
                    <TooltipLimitedContainer style={{ color: 'white', padding: 12 }}>
                      <TooltipLimitedTextContainer>
                        <TooltipContentContainer>
                          <div>
                            This budget amount has been automatically flagged as the base scenario for this
                            simulation.{' '}
                          </div>
                          <div>
                            The budget of {formatNumber(baseScenarioBudget)} corresponds to the planned budget for this
                            simulation’s selected timeframe.
                          </div>
                          <Button
                            onClick={() => {
                              openMoreDetailsDialog();
                              closeTooltip();
                            }}
                            style={{ textDecoration: 'underline', color: nexyColors.white }}
                          >
                            More details
                          </Button>
                        </TooltipContentContainer>
                      </TooltipLimitedTextContainer>
                    </TooltipLimitedContainer>
                  </Panel>
                </ScrollArea>
              </StepScenariosContainer>
            ) : null}
            {selectedSimulationSteps ? (
              <AlertDialog>
                <AlertDialogTrigger disabled={isEditSimulationDisabled(simulation.state)}>
                  <Button disabled={isEditSimulationDisabled(simulation.state)} variant="text">
                    <span className="underline">Manually add scenarios</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Manually add more scenarios</AlertDialogTitle>
                    <AlertDialogDescription>
                      <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
                        Add a budget amount between {min} and {max}
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <ScrollArea className="max-h-[500px]">
                    {localCustomScenarios.length === 0 ? (
                      <div className="m-2 flex justify-center">
                        <Button
                          variant="contained"
                          size="small"
                          color="secondary"
                          style={{ width: '100%' }}
                          onClick={addScenario}
                        >
                          Add Scenario
                        </Button>
                      </div>
                    ) : (
                      localCustomScenarios.map((customScenario, idx) => {
                        const isDuplicate =
                          selectedSimulationSteps.budgets.some(
                            (s) => !s.isCustomScenario && s.budget === toNumber(customScenario.value),
                          ) || localCustomScenarios.some((s, i) => i !== idx && s.value === customScenario.value);
                        return (
                          <React.Fragment key={idx}>
                            <div className="mx-1 my-2 flex gap-4">
                              <div className="align-center flex w-full gap-2">
                                <Tooltip
                                  open={isDuplicate}
                                  size="small"
                                  variant="dark"
                                  content={isDuplicate ? "There's already a scenario with this number" : ''}
                                  popperProps={{ style: { zIndex: 3400 } }}
                                  placement="bottom-start"
                                >
                                  <StyledTextField
                                    hasError={isDuplicate}
                                    inputProps={{ style: { padding: 0 } }}
                                    style={{ width: '100%' }}
                                    labelVariant="light"
                                    label={`Additional scenario ${idx + 1}`}
                                    id="budget-limit-input"
                                    type="text"
                                    name="additionalScenario"
                                    placeholder="Enter budget amount"
                                    step={0.01}
                                    value={
                                      customScenario.isFocused ? customScenario.value : customScenario.formattedValue
                                    }
                                    onChange={(e) => handleScenarioChange(idx, e.target.value)}
                                    onFocus={() => handleScenarioFocus(idx)}
                                    onBlur={() => handleScenarioBlur(idx)}
                                  />
                                </Tooltip>
                                <div style={{ marginTop: 18 }}>
                                  <div style={{ display: 'flex', gap: '2px' }}>
                                    <ShadcnButton
                                      disabled={!customScenario.value}
                                      onClick={addScenario}
                                      variant="ghost"
                                      size="icon"
                                    >
                                      <CirclePlus className="h-[24px] w-[24px] text-neutral-300" />
                                    </ShadcnButton>
                                    <ShadcnButton onClick={() => deleteScenario(idx)} variant="ghost" size="icon">
                                      <Trash2 className="h-[24px] w-[24px] text-neutral-300" />
                                    </ShadcnButton>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })
                    )}
                  </ScrollArea>

                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <Button size="small" variant="contained" color="secondary">
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={updateScenarios} disabled={disableUpdateCustomScenarios}>
                      <Button disabled={disableUpdateCustomScenarios} size="small" variant="contained" color="primary">
                        {selectedSimulationSteps.budgets.some((b) => b.isCustomScenario)
                          ? 'Update scenarios'
                          : 'Add scenarios'}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
            {newSimulationSummary ? (
              <div className="flex-column mt-6 flex flex-wrap gap-5">
                {/*<StyledCheckbox*/}
                {/*  name="skipNonOptimizedContentBudgets"*/}
                {/*  disabled={isEditSimulationDisabled(simulation.state)}*/}
                {/*  checked={simulation?.skipNonOptimizedContentBudgets}*/}
                {/*  onChange={(_: Event, value: boolean) => {*/}
                {/*    handleChangeValueByKey({*/}
                {/*      target: {*/}
                {/*        name: 'skipNonOptimizedContentBudgets',*/}
                {/*        value,*/}
                {/*      },*/}
                {/*    });*/}
                {/*  }}*/}
                {/*  label="The budget should also include the total costs from content pieces which are disabled (skip) from the*/}
                {/*  optimization."*/}
                {/*/>*/}
                <StyledCheckbox
                  name="ignoreContentBudgetLimits"
                  disabled={isEditSimulationDisabled(simulation.state)}
                  checked={simulation?.ignoreContentBudgetLimits}
                  onChange={(_: Event, value: boolean) => {
                    handleChangeValueByKey({
                      target: {
                        name: 'ignoreContentBudgetLimits',
                        value,
                      },
                    });
                  }}
                  label="Budget constraints, such as min./max/fixed budget limits for content pieces should be ignored for the simulation."
                />
                <PortfolioFeatureSwitch
                  features={[PORTFOLIO_FEATURE_FLAGS.SIMULATION_DATA_DRIVEN_BUDGET_PACING]}
                  renderNew={() => {
                    return (
                      <StyledCheckbox
                        name="budgetPacing"
                        disabled={isEditSimulationDisabled(simulation.state)}
                        checked={simulation?.budgetPacing === NexoyaSimulationBudgetPacing.Dynamic}
                        onChange={(_: Event, value: boolean) => {
                          handleChangeValueByKey({
                            target: {
                              name: 'budgetPacing',
                              value: value ? NexoyaSimulationBudgetPacing.Dynamic : NexoyaSimulationBudgetPacing.Static,
                            },
                          });
                        }}
                        label={`Automated budget strategy: let ${tenantName} automatically find the best budget allocation during the simulation timeframe. The current budget plan will be ignored.`}
                      />
                    );
                  }}
                  renderOld={() => null}
                />
              </div>
            ) : null}
          </FormGroup>
        </Fieldset>
        {!ignoreContentBudgetLimits ? (
          <StatusWrapperStyled style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgCheckCircle style={{ color: nexyColors.greenTeal, width: 24, height: 24 }} />
            <Typography withEllipsis={false} variant="paragraph" style={{ fontSize: 12 }}>
              This simulation takes all restrictions on portfolio and content level into account.
            </Typography>
          </StatusWrapperStyled>
        ) : null}
      </WrapStyled>
      <Dialog
        paperProps={{ style: { zIndex: 99999, width: 640 } }}
        isOpen={isMoreDetailsDialogOpen}
        hideCloseButton
        onClose={() => {
          closeMoreDetailsDialog();
        }}
      >
        <DialogTitle style={{ padding: '20px 24px 16px 24px' }}>
          <Typography variant="h3">What is a base scenario?</Typography>
        </DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 24px 20px 24px' }}>
          <Typography style={{ color: nexyColors.paleSlateGray }} withEllipsis={false}>
            A base scenario is the scenario with a budget value that matches the planned budget within the simulation
            timeframe.{' '}
          </Typography>
          <Typography style={{ color: nexyColors.paleSlateGray }} withEllipsis={false}>
            {baseScenarioBudget ? (
              <>
                The portfolio has a planned budget of <b>{formatNumber(baseScenarioBudget)}</b> during the simulation
                timeframe.
              </>
            ) : null}{' '}
            The budget scenario with this budget value will be automatically flagged as the base scenario for this
            simulation.
          </Typography>
          <Typography style={{ color: nexyColors.darkGrey, fontWeight: 500 }} withEllipsis={false}>
            What is the purpose of the base scenario?
          </Typography>
          <Typography style={{ color: nexyColors.paleSlateGray }} withEllipsis={false}>
            The base scenario allows you to easily see how other scenarios as part of the simulation perform compared
            the current planned budget. You will be able to compare them once the simulation is ready to explore.
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button onClick={closeMoreDetailsDialog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
