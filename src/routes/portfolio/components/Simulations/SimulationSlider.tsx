import React, { cloneElement, ReactElement, useEffect, useState } from "react";

import { maxBy, minBy } from "lodash";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";
import { NumberParam, useQueryParam } from "use-query-params";

import FormattedCurrency from "../../../../components/FormattedCurrency";
import SvgSliderHandle from "../../../../components/icons/SliderHandle";

import { nexyColors } from "../../../../theme";

const HiddenSpan = styled.span`
  display: none;
`;

const SliderStyled = styled(Slider)<{ baseScenarioIndex: number }>`
  .rc-slider-handle {
    background: ${nexyColors.greenTeal};
    opacity: 1;
    border: none;
    width: 48px;
    height: 48px;
    top: -392%;
    box-shadow: 0 3px 5px 0 rgba(14, 199, 106, 0.2);

    transition: all 0.25s ease-in-out;
  }

  .rc-slider-dot {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    fill: #fff;
    border: 2px solid #05a8fa;
    top: -100%;
  }

  .rc-slider-dot:nth-child(${({ baseScenarioIndex }) => baseScenarioIndex + 1}) {
    background: ${nexyColors.purpleishBlue}; /* assuming this is a valid color in your theme */
    border: none;
  }

  .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging {
    box-shadow: 0 3px 5px 0 rgba(14, 199, 106, 0.3);
  }
`;

const FormattedCurrencyStyled = styled(FormattedCurrency)`
  color: #585a6a;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 145%; /* 11.6px */
  letter-spacing: 0.16px;
  gap: 4px;
  opacity: 0.5;
  margin-top: 24px;
`;

const FormattedCurrencyTooltipStyled = styled(FormattedCurrencyStyled)`
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 145%; /* 20.3px */
  letter-spacing: 0.28px;
  opacity: 1;
  margin-top: 0;
`;

const BulletStyled = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 145%; /* 20.3px */
  letter-spacing: 0.28px;
  opacity: 1;
`;

const TooltipHandlerContainer = styled.span<{ readonly color: string }>`
  ${BulletStyled}, ${FormattedCurrencyTooltipStyled} {
    color: ${({ color }) => color};
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
`;

const CustomHandle = ({ selectedScenario, ...rest }: { selectedScenario: ScenarioSliderBudget }) => {
  return (
    <div {...rest} style={{ visibility: 'visible', width: 48, height: 48 }}>
      <TooltipHandlerContainer color={selectedScenario?.isBaseScenario ? nexyColors.purpleishBlue : nexyColors.azure}>
        <FormattedCurrencyTooltipStyled showDecimals={false} amount={selectedScenario?.budget} />
        <BulletStyled>
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" viewBox="0 0 9 8" fill="none">
            <circle cx="4.5" cy="4" r="4" fill="currentColor" />
          </svg>
        </BulletStyled>
      </TooltipHandlerContainer>
      <SvgSliderHandle />
    </div>
  );
};

export type ScenarioSliderBudget = { scenarioId: number; budget: number; isBaseScenario: boolean };

export type SimulationSliderProps = {
  scenarioBudgets: ScenarioSliderBudget[];
};

export function SimulationSlider({ scenarioBudgets }: SimulationSliderProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useQueryParam('selectedScenarioId', NumberParam);

  const [selectedScenarioBudget, setSelectedScenarioBudget] = useState<ScenarioSliderBudget>(
    selectedScenarioId
      ? scenarioBudgets?.find((b) => b.scenarioId === selectedScenarioId)
      : scenarioBudgets?.find((b) => b.isBaseScenario) || scenarioBudgets[0]
  );

  useEffect(() => {
    if (selectedScenarioId) {
      setSelectedScenarioBudget(scenarioBudgets.find((b) => b.scenarioId === selectedScenarioId));
    }

    if (selectedScenarioId && !scenarioBudgets.find((b) => b.scenarioId === selectedScenarioId)) {
      const scenarioSliderBudget = scenarioBudgets.find((b) => b.isBaseScenario);
      setSelectedScenarioBudget(scenarioSliderBudget);
      setSelectedScenarioId(scenarioSliderBudget.scenarioId);
    }
  }, [selectedScenarioId]);

  const maxBudgetScenario = minBy(scenarioBudgets, 'budget');
  const minBudgetScenario = maxBy(scenarioBudgets, 'budget');

  const marks = scenarioBudgets.reduce((acc, { scenarioId, budget }) => {
    if (scenarioId === maxBudgetScenario.scenarioId || scenarioId === minBudgetScenario.scenarioId) {
      acc[budget] = <FormattedCurrencyStyled showDecimals={false} amount={budget} />;
    } else {
      acc[budget] = <HiddenSpan />;
    }
    return acc;
  }, {});

  const customRender = (handle: ReactElement) => {
    return cloneElement(
      handle,
      {
        style: {
          ...handle.props.style,
          visibility: 'hidden',
        },
      },
      <CustomHandle selectedScenario={selectedScenarioBudget} />
    );
  };

  return (
    <div style={{ margin: '0 32px' }}>
      <SliderStyled
        styles={{
          rail: { borderRadius: 4, background: 'rgba(5, 168, 250, 0.20)' },
        }}
        baseScenarioIndex={scenarioBudgets.findIndex((b) => b.isBaseScenario)}
        handleRender={customRender}
        step={null}
        min={maxBudgetScenario?.budget}
        max={minBudgetScenario?.budget}
        marks={marks}
        included={false}
        value={selectedScenarioBudget?.budget}
        defaultValue={selectedScenarioBudget?.budget}
        onChange={(value) => {
          const scenarioSliderBudget = scenarioBudgets.find((b) => b.budget === value);
          setSelectedScenarioBudget(scenarioSliderBudget);
          setSelectedScenarioId(scenarioSliderBudget.scenarioId);
        }}
      />
    </div>
  );
}
