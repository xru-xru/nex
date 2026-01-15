import React, { useEffect } from 'react';

import { capitalize } from 'lodash';
import styled from 'styled-components';
import { NumericArrayParam, StringParam, useQueryParam, useQueryParams } from 'use-query-params';

import { ExtendedNexoyaSimulationScenario, NexoyaFunnelStepType, NexoyaScenarioFunnelStep } from '../../../../types';

import { shortenNumber } from '../../../../utils/number';
import { getAccuracyColorByLabel, getCostPerTitleBasedOnType } from '../../utils/simulation';

import FormattedCurrency from '../../../../components/FormattedCurrency';
import MultipleSwitch from '../../../../components/MultipleSwitchFluid';
import { classes } from '../../../../components/MultipleSwitchFluid/MultipleSwitch';
import NumberValue from '../../../../components/NumberValue';
import Switch from '../../../../components/Switch';
import Tooltip from '../../../../components/Tooltip';
import Typography from '../../../../components/Typography';
import SvgArrowLeft from '../../../../components/icons/ArrowLeft';
import SvgChevronDown from '../../../../components/icons/ChevronDown';
import SvgClose from '../../../../components/icons/Close';
import SvgTarget from '../../../../components/icons/Target';

import { TagStyled } from '../../styles/OptimizationProposal';

import { nexyColors } from '../../../../theme';
import { ApplyScenario } from './ApplyScenario';
import { ScenarioTDM } from './ScenarioTDM';
import { UncertaintyRangeTooltipContent } from './UncertaintyRangeTooltipContent';
import SvgInfo from '../../../../components/icons/Info';

export const METRIC_SWITCHES = [
  {
    id: 'values',
    text: 'Values',
  },
  {
    id: 'cost-per',
    text: 'Cost-per',
  },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: 24px;
`;

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 30px auto auto;
  max-width: 400px;
  align-items: center;
  gap: 4px;
`;

const SwitchContainerStyled = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const MetricPanelTypography = styled(Typography)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%; /* 20.3px */
  letter-spacing: 0.28px;
  color: ${nexyColors.neutral600};

  transition: all 0.2s;
`;

const MetricPanelRowContainer = styled.div`
  border: 1px solid #e3e4e8;
  padding: 10px 6px;
  border-radius: 5px;
`;

const ReliabilityContainer = styled.div`
  border-radius: 5px;
  padding: 14px 12px;

  border: 1px solid #e3e4e8;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricPanelRowStyled = styled.div<{ active: boolean; shouldShowChangePercent: boolean }>`
  display: grid;
  grid-template-columns: ${({ shouldShowChangePercent }) =>
    shouldShowChangePercent ? '1fr auto 60px auto' : '1fr auto auto'};
  align-items: center; // Align items vertically in the center
  gap: 12px; // Add a gap between grid items if needed

  border-radius: 5px;
  padding: 4px 6px;

  transition: background-color 0.2s;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#f6f6f7' : 'transparent')};

  ${MetricPanelTypography}, .NEXYNumberValue {
    color: ${({ active }) => (active ? nexyColors.neutral900 : nexyColors.neutral600)};
  }

  &:hover {
    background-color: #f6f6f7;
  }
`;

const MetricsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MultipleSwitchStyled = styled(MultipleSwitch)`
  .${classes.section} {
    width: 100%;
    justify-content: center;
  }
`;

const TypographyTableHeader = styled(Typography)`
  color: ${nexyColors.neutral900};
  font-size: 9px;
  font-style: normal;
  font-weight: 500;
  line-height: 145%; /* 11.6px */
  letter-spacing: 0.16px;
`;

const MetricTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid #e3e4e8;

  ${MetricPanelRowContainer} {
    border: none;
    border-bottom: 1px solid rgba(227, 228, 232, 0.5);
    border-radius: 0;
  }
`;

const MetricTableHeader = styled.div<{ showDiff: boolean }>`
  display: grid;
  grid-template-columns: ${({ showDiff }) => (showDiff ? '1fr 60px 60px auto' : '1fr 60px auto')};
  padding: 10px 12px;
  border-bottom: 1px solid rgba(227, 228, 232, 0.5);
`;

const MetricPanelRow = ({
  label,
  value,
  changePercent,
  shouldShowChangePercent,
  isCostPerSelected = false,
  lowerIsBetter = false,
  isTarget = false,
  funnelStepType,
}: {
  label: string;
  value: JSX.Element | number | string;
  changePercent: number;
  isCostPerSelected?: boolean;
  lowerIsBetter?: boolean;
  shouldShowChangePercent: boolean;
  isTarget?: boolean;
  funnelStepType?: NexoyaFunnelStepType;
}) => {
  const [queryParams, setQueryParams] = useQueryParams({
    scenarioSelectedMetric: StringParam,
  });

  const isActive = queryParams.scenarioSelectedMetric === label;
  return (
    <MetricPanelRowContainer>
      <MetricPanelRowStyled
        shouldShowChangePercent={shouldShowChangePercent}
        active={isActive}
        onClick={() => {
          setQueryParams({
            scenarioSelectedMetric: isActive ? null : label,
          });
        }}
      >
        <MetricPanelTypography style={{ justifyContent: 'flex-start' }}>
          {isActive ? <SvgArrowLeft /> : null}
          {isCostPerSelected ? getCostPerTitleBasedOnType(funnelStepType) : null}
          {label}
          {isTarget ? (
            <SvgTarget
              style={{
                width: 18,
                height: 18,
              }}
            />
          ) : null}
        </MetricPanelTypography>
        <MetricPanelTypography>{value ? value : 'N/A'}</MetricPanelTypography>
        {shouldShowChangePercent ? (
          <MetricPanelTypography>
            {changePercent ? (
              <NumberValue
                textWithColor
                showChangePrefix
                value={changePercent}
                lowerIsBetter={lowerIsBetter}
                variant={changePercent > 0 ? 'positive' : 'negative'}
                datatype={{
                  suffix: true,
                  symbol: '%',
                }}
              />
            ) : null}
          </MetricPanelTypography>
        ) : null}
        {isActive ? (
          <SvgClose style={{ width: 10, height: 10 }} />
        ) : (
          <SvgChevronDown style={{ width: 10, height: 12, transform: 'rotate(-90deg)' }} />
        )}
      </MetricPanelRowStyled>
    </MetricPanelRowContainer>
  );
};

const MetricTable = ({ showDiff, children }) => {
  return (
    <MetricTableContainer>
      <MetricTableHeader showDiff={showDiff}>
        <TypographyTableHeader className="!flex items-center">
          <Tooltip
            style={{
              overflowY: 'auto',
              wordBreak: 'break-word',
            }}
            size="small"
            placement="top"
            variant="dark"
            content="The numbers in the performance table might change if the portfolio structure changes."
          >
            <span className="mr-2">
              <SvgInfo style={{ color: nexyColors.coolGray, width: 12, height: 12 }} />
            </span>
          </Tooltip>
          Metric
        </TypographyTableHeader>
        <TypographyTableHeader>Value</TypographyTableHeader>
        {showDiff ? <TypographyTableHeader withTooltip>% diff. from base</TypographyTableHeader> : null}
      </MetricTableHeader>
      {children}
    </MetricTableContainer>
  );
};

export function ScenarioMetricsPanel({
  simulationHasBaseScenario,
  portfolioId,
  simulationId,
  scenario,
  start,
  end,
}: {
  simulationHasBaseScenario: boolean;
  portfolioId: number;
  simulationId: number;
  scenario: ExtendedNexoyaSimulationScenario;
  start: Date;
  end: Date;
}) {
  const [comparisonIds, setComparisonIds] = useQueryParam('comparisonIds', NumericArrayParam);
  const [queryParams, setQueryParams] = useQueryParams({
    scenarioMetricSwitch: StringParam,
  });

  useEffect(() => {
    setQueryParams({
      scenarioMetricSwitch: METRIC_SWITCHES[0].id,
    });
  }, []);

  const handleComparisonToggle = (id: number) => {
    if (comparisonIds?.includes(id)) {
      setComparisonIds(comparisonIds.filter((comparisonId) => comparisonId !== id));
    } else {
      setComparisonIds(comparisonIds ? [...comparisonIds, id] : [id]);
    }
  };

  const isCostPerSelected = queryParams.scenarioMetricSwitch === 'cost-per';
  const getStepBasedOnMetricSelection = (step: NexoyaScenarioFunnelStep) =>
    step[isCostPerSelected ? 'costPer' : 'total'];

  return (
    <Container>
      <HeaderContainer>
        <ScenarioTDM
          scenarioId={scenario.scenarioId}
          simulationId={simulationId}
          portfolioId={portfolioId}
          scenarioIdx={scenario.idx}
          isBaseScenario={scenario?.isBaseScenario}
        />
        <Typography
          variant="h3"
          style={{
            color: scenario.isBaseScenario
              ? nexyColors.purpleishBlue
              : scenario.isApplied
                ? nexyColors.azure
                : nexyColors.raisinBlack,
            minWidth: 176,
          }}
        >
          Scenario {scenario.idx}
          {scenario.isApplied ? ': Applied' : scenario.isBaseScenario ? ': Base' : null}
        </Typography>
        <SwitchContainerStyled>
          <Typography style={{ fontSize: 12, fontWeight: 500 }}>Add to comparison</Typography>
          <Switch
            disabled={scenario.isBaseScenario}
            onToggle={() => handleComparisonToggle(scenario.scenarioId)}
            isOn={scenario.isBaseScenario ? true : comparisonIds?.includes(scenario.scenarioId) || false}
          />
        </SwitchContainerStyled>
      </HeaderContainer>
      <MetricsContainer>
        <MetricPanelRow
          label="Budget"
          value={<FormattedCurrency amount={scenario.budget.totals.currentScenarioTotal} />}
          changePercent={scenario.budget.totals.changePercentTotal}
          shouldShowChangePercent={simulationHasBaseScenario ? !scenario.isBaseScenario : false}
        />
        {scenario.targetFunnelStep.roas ? (
          <Tooltip
            key={scenario.targetFunnelStep.funnelStep.funnelStepId}
            variant="dark"
            placement="right"
            popperProps={{
              style: {
                minWidth: 300,
                maxWidth: 450,
                height: 156,
              },
            }}
            content={
              <UncertaintyRangeTooltipContent
                performance={scenario.targetFunnelStep.roas.currentScenario}
                highChangePercent={scenario.targetFunnelStep.roas.currentScenarioPredictionRange.highChangePercent}
                lowChangePercent={scenario.targetFunnelStep.roas.currentScenarioPredictionRange.lowChangePercent}
                high={scenario.targetFunnelStep.roas.currentScenarioPredictionRange.high}
                low={scenario.targetFunnelStep.roas.currentScenarioPredictionRange.low}
                suffix="%"
                title="Portfolio ROAS"
              />
            }
          >
            <div>
              <MetricPanelRow
                label="Portfolio ROAS"
                value={<NumberValue symbol="%" value={scenario.targetFunnelStep.roas.currentScenario} />}
                changePercent={scenario.targetFunnelStep.roas.changePercent}
                shouldShowChangePercent={simulationHasBaseScenario ? !scenario.isBaseScenario : false}
              />
            </div>
          </Tooltip>
        ) : null}
      </MetricsContainer>
      <MultipleSwitchStyled
        sections={METRIC_SWITCHES}
        initial={queryParams.scenarioMetricSwitch || METRIC_SWITCHES[0].id}
        current={queryParams.scenarioMetricSwitch || METRIC_SWITCHES[0].id}
        onToggle={(selectedOption) => {
          setQueryParams({
            scenarioMetricSwitch: selectedOption,
          });
        }}
      />
      <MetricTable showDiff={simulationHasBaseScenario ? !scenario.isBaseScenario : false}>
        {scenario.funnelSteps.map((step) => {
          const title = step.funnelStep.title;
          const costPerPrefix = isCostPerSelected ? getCostPerTitleBasedOnType(step.funnelStep.type) : '';
          const tooltipTitle = isCostPerSelected ? `${costPerPrefix} ${title}`.trim() : title;
          return (
            <Tooltip
              key={step.funnelStep.funnelStepId}
              variant="dark"
              placement="right"
              popperProps={{
                style: {
                  minWidth: 300,
                  maxWidth: 450,
                  height: 156,
                },
              }}
              content={
                <UncertaintyRangeTooltipContent
                  performance={getStepBasedOnMetricSelection(step)?.currentScenario}
                  highChangePercent={
                    getStepBasedOnMetricSelection(step)?.currentScenarioPredictionRange.highChangePercent
                  }
                  lowChangePercent={
                    getStepBasedOnMetricSelection(step)?.currentScenarioPredictionRange.lowChangePercent
                  }
                  high={getStepBasedOnMetricSelection(step)?.currentScenarioPredictionRange.high}
                  low={getStepBasedOnMetricSelection(step)?.currentScenarioPredictionRange.low}
                  title={tooltipTitle}
                />
              }
            >
              <div>
                <MetricPanelRow
                  label={title}
                  value={shortenNumber(getStepBasedOnMetricSelection(step)?.currentScenario || null)}
                  changePercent={getStepBasedOnMetricSelection(step)?.changePercent}
                  lowerIsBetter={getStepBasedOnMetricSelection(step)?.lowerIsBetter}
                  shouldShowChangePercent={simulationHasBaseScenario ? !scenario.isBaseScenario : false}
                  isCostPerSelected={isCostPerSelected}
                  isTarget={step.isTarget}
                  funnelStepType={step.funnelStep.type}
                />
              </div>
            </Tooltip>
          );
        })}
      </MetricTable>
      {scenario.reliabilityLabel ? (
        <ReliabilityContainer>
          <MetricPanelTypography>Scenario reliability</MetricPanelTypography>
          <TagStyled bgColor={getAccuracyColorByLabel(scenario.reliabilityLabel)}>
            {capitalize(scenario.reliabilityLabel)}
          </TagStyled>
        </ReliabilityContainer>
      ) : null}
      <ApplyScenario
        simulationId={simulationId}
        scenarioId={scenario.scenarioId}
        budget={scenario.budget.totals}
        isApplied={scenario.isApplied}
        start={start}
        end={end}
      />
    </Container>
  );
}
