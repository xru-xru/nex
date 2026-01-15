import React from 'react';

import { capitalize } from 'lodash';

import { ExtendedNexoyaSimulationScenario } from '../../../../../types';

import { getAccuracyColorByLabel } from '../../../utils/simulation';

import Flex from '../../../../../components/Flex';
import FormattedCurrency from '../../../../../components/FormattedCurrency';
import NumberValue from '../../../../../components/NumberValue';
import Typography from '../../../../../components/Typography';

import { NumberWrapperStyled, TagStyled } from '../../../styles/OptimizationProposal';

import { nexyColors } from '../../../../../theme';
import { isConversionValueFunnelStep } from '../../OptimizationProposal/columns';
import { ScenarioTDM } from '../ScenarioTDM';

export const getData = ({
  portfolioId,
  simulationId,
  scenarios,
  comparisonIds,
}: {
  portfolioId: number;
  simulationId: number;
  scenarios: ExtendedNexoyaSimulationScenario[];
  comparisonIds: number[];
}) => {
  return scenarios
    .filter((s) => s.isBaseScenario || comparisonIds?.includes(s.scenarioId))
    .map((scenario) => {
      return {
        ...scenario,
        funnelSteps: scenario.funnelSteps,
        actionsRow: !scenario.isBaseScenario ? (
          <div style={{ marginRight: '0' }}>
            <ScenarioTDM
              scenarioId={scenario.scenarioId}
              portfolioId={portfolioId}
              simulationId={simulationId}
              scenarioIdx={scenario.idx}
            />
          </div>
        ) : null,
        name: (
          <Flex
            key={'Scenario ' + scenario.scenarioId}
            style={{
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: '100%',
            }}
          >
            <Typography
              style={{ fontWeight: 500, color: scenario.isBaseScenario ? nexyColors.purpleishBlue : 'inherit' }}
              variant="paragraph"
            >
              Scenario {scenario.idx}
              {scenario.isApplied ? ': Applied' : scenario.isBaseScenario ? ': Base' : ''}
            </Typography>
          </Flex>
        ),
        reliability: (
          <Flex
            key={'Scenario ' + scenario.scenarioId}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <TagStyled bgColor={getAccuracyColorByLabel(scenario.reliabilityLabel)}>
              {capitalize(scenario.reliabilityLabel)}
            </TagStyled>
          </Flex>
        ),
        currentScenarioTotal: (
          <NumberWrapperStyled key={scenario.budget?.totals?.currentScenarioTotal}>
            <FormattedCurrency amount={scenario.budget.totals?.currentScenarioTotal} />
          </NumberWrapperStyled>
        ),
        changePercentTotal: !scenario.isBaseScenario && (
          <NumberWrapperStyled key={scenario?.budget.totals?.changePercentTotal}>
            <NumberValue
              value={scenario?.budget.totals?.changePercentTotal}
              showChangePrefix
              textWithColor
              variant={
                scenario?.budget.totals?.changePercentTotal > 0
                  ? 'positive'
                  : scenario?.budget.totals?.changePercentTotal === 0
                    ? 'default'
                    : 'negative'
              }
              datatype={{
                suffix: true,
                symbol: '%',
              }}
            />
          </NumberWrapperStyled>
        ),
        ...scenario.funnelSteps
          .map((funnelStep) => ({
            [`funnelStepCostPer_${funnelStep.funnelStep.funnelStepId}`]: (
              <NumberWrapperStyled key={funnelStep?.costPer?.currentScenario || 0}>
                {typeof funnelStep?.costPer?.currentScenario === 'undefined' ? (
                  '-'
                ) : isConversionValueFunnelStep(funnelStep.funnelStep.type) ? (
                  <NumberValue value={funnelStep?.costPer?.currentScenario ?? 0} lowerIsBetter />
                ) : (
                  <FormattedCurrency amount={funnelStep?.costPer?.currentScenario} withColor={true} />
                )}
              </NumberWrapperStyled>
            ),
            [`funnelStepCostPer_${funnelStep.funnelStep.funnelStepId}_change`]: !scenario.isBaseScenario && (
              <NumberWrapperStyled key={funnelStep?.costPer?.changePercent || 0}>
                {typeof funnelStep?.costPer?.changePercent === 'undefined' ? (
                  '-'
                ) : (
                  <NumberValue
                    textWithColor
                    showChangePrefix
                    variant={funnelStep?.costPer?.changePercent > 0 ? 'positive' : 'negative'}
                    value={funnelStep?.costPer?.changePercent ?? 0}
                    datatype={{
                      suffix: true,
                      symbol: '%',
                    }}
                    lowerIsBetter
                  />
                )}
              </NumberWrapperStyled>
            ),
            [`funnelStepValue_${funnelStep.funnelStep.funnelStepId}`]: (
              <NumberWrapperStyled key={funnelStep?.total?.currentScenario || 0}>
                {typeof funnelStep?.total?.currentScenario === 'undefined' ? (
                  '-'
                ) : (
                  <NumberValue value={funnelStep?.total?.currentScenario ?? 0} />
                )}
              </NumberWrapperStyled>
            ),
            [`funnelStepValue_${funnelStep.funnelStep.funnelStepId}_change`]: !scenario.isBaseScenario && (
              <NumberWrapperStyled key={funnelStep?.total?.changePercent || 0}>
                {typeof funnelStep?.total?.changePercent === 'undefined' ? (
                  '-'
                ) : (
                  <NumberValue
                    textWithColor
                    showChangePrefix
                    variant={funnelStep?.total?.changePercent > 0 ? 'positive' : 'negative'}
                    value={funnelStep?.total?.changePercent ?? 0}
                    datatype={{
                      suffix: true,
                      symbol: '%',
                    }}
                  />
                )}
              </NumberWrapperStyled>
            ),
          }))
          .reduce((acc, goal) => ({ ...acc, ...goal }), {}),
      };
    });
};
