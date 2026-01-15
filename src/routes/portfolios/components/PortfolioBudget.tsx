import React from 'react';

import styled from 'styled-components';

import { NexoyaBudgetDeltaHandlingPolicy } from '../../../types';

import { usePortfolio } from '../../../context/PortfolioProvider';

import { BUDGET_DELTA_OPTIONS, getOptimizationTypes } from '../../../utils/portfolioEdit';

import Checkbox from '../../../components/Checkbox';
import Tooltip from '../../../components/Tooltip';
import Typography from '../../../components/Typography';
import SvgBudgetAutomaticDefault from '../../../components/icons/BudgetAutomaticDefault';
import SvgBudgetAutomaticHover from '../../../components/icons/BudgetAutomaticHover';
import SvgBudgetManualDefault from '../../../components/icons/BudgetManualDefault';
import SvgBudgetManualHover from '../../../components/icons/BudgetManualHover';
import SvgQuestionCircle from '../../../components/icons/QuestionCircle';
import SvgRiskAggressive from '../../../components/icons/RiskAggressive';
import SvgRiskConservative from '../../../components/icons/RiskConservative';
import SvgRiskModerate from '../../../components/icons/RiskModerate';

import { colorByKey } from '../../../theme/utils';

import { budgetOptimizationType, budgetRiskType } from '../../../configs/portfolio';
import { nexyColors } from '../../../theme';
import { useTenantName } from '../../../hooks/useTenantName';
import { BudgetDelaOptionsWrapper, BudgetDeltasWrapper, OptionCard } from '../../portfolio/PortfolioEditMetaSidepanel';
import { PortfolioRisk } from './PortfolioRisk';

const WrapStyled = styled.div`
  width: 100%;
  margin-top: 2px;
  padding-bottom: 1px;
`;

const BudgetOptimizationWrapper = styled.div`
  margin-bottom: 64px;

  .NEXYH4 {
    margin-bottom: 8px;
    color: ${colorByKey('darkGrey')};
    max-width: 700px;
  }

  .NEXYParagraph {
    margin-bottom: 8px;
    color: ${colorByKey('coolGray')};
    max-width: 700px;
  }

  .headerNote {
    margin-bottom: 24px;
    color: ${colorByKey('coolGray')};
    font-size: 12px;
    font-weight: 400;
    max-width: 700px;
  }
`;
const H4Container = styled.div`
  display: inline-flex;
  align-items: center;
`;
export const BudgetOptimizationItem = styled.div`
  border: 1px solid rgba(223, 225, 237, 0.5);
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(42, 43, 46, 0.07);
  padding: 24px 24px 32px 24px;
  text-align: center;
  cursor: pointer;

  width: 100%;

  .NEXYH5 {
    margin-bottom: 8px;
    color: ${colorByKey('darkGrey')};
  }

  &.selectedOptimization {
    background-color: ${colorByKey('paleGrey40')};
  }

  svg {
    margin: 0 auto;
  }
`;

export const mapOptimizationIcons = {
  [budgetOptimizationType.AUTOMATIC]: (
    <SvgBudgetAutomaticDefault
      style={{
        fontSize: 48,
        marginBottom: 16,
      }}
    />
  ),
  [`${budgetOptimizationType.AUTOMATIC}Active`]: (
    <SvgBudgetAutomaticHover
      style={{
        fontSize: 48,
        marginBottom: 16,
      }}
    />
  ),
  [budgetOptimizationType.MANUAL]: (
    <SvgBudgetManualDefault
      style={{
        fontSize: 48,
        marginBottom: 16,
      }}
    />
  ),
  [`${budgetOptimizationType.MANUAL}Active`]: (
    <SvgBudgetManualHover
      style={{
        fontSize: 48,
        marginBottom: 16,
      }}
    />
  ),
};
export const mapRiskIcon = {
  [budgetRiskType.AGGRESSIVE]: (
    <SvgRiskAggressive
      style={{
        fontSize: 128,
      }}
    />
  ),
  [budgetRiskType.CONSERVATIVE]: (
    <SvgRiskConservative
      style={{
        fontSize: 128,
      }}
    />
  ),
  [budgetRiskType.MODERATE]: (
    <SvgRiskModerate
      style={{
        fontSize: 128,
      }}
    />
  ),
};

function PortfolioBudget() {
  const [shouldScrollToTop, setShouldScrollToTop] = React.useState(true);
  const contentRef = React.createRef<HTMLDivElement>();
  const tenantName = useTenantName();
  const {
    meta: {
      value: { optimizationType, budgetDeltaHandlingPolicy },
      handleChange,
    },
  } = usePortfolio();

  React.useEffect(() => {
    if (shouldScrollToTop) {
      contentRef.current?.scrollIntoView();
    }
    setShouldScrollToTop(false);
  }, [contentRef, shouldScrollToTop]);
  return (
    <WrapStyled ref={contentRef}>
      <Typography style={{ marginBottom: 32 }} variant="h3">
        💰 Budget-based portfolio settings
      </Typography>
      <BudgetOptimizationWrapper>
        <Typography variant="h4">Would you like to optimize your budget?</Typography>
        <Typography variant="paragraph" withEllipsis={false}>
          How would you like to apply the budget proposals? You can choose to adjust it manually yourself or automated
          by {tenantName} (in beta). Alternatively the optimization can be skipped.
        </Typography>
        <Typography className="headerNote" variant="subtitlePill" withEllipsis={false}>
          Note: You can change your selection at any time.
        </Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          {getOptimizationTypes(tenantName).map((item) => {
            if (item.type === budgetOptimizationType.SKIP) return null;
            else
              return (
                <BudgetOptimizationItem
                  key={item.type}
                  className={item.type === optimizationType ? 'selectedOptimization' : ''}
                  data-cy={item.type}
                  style={{
                    width: '48%',
                  }}
                  onClick={() =>
                    handleChange({
                      target: {
                        name: 'optimizationType',
                        value: item.type,
                      },
                    })
                  }
                >
                  {mapOptimizationIcons[`${item.type}${item.type === optimizationType ? 'Active' : ''}`]}
                  <Typography variant="h5">{item.title}</Typography>
                  <Typography variant="subtitlePill" withEllipsis={false}>
                    {item.description}
                  </Typography>
                </BudgetOptimizationItem>
              );
          })}
        </div>
        <div style={{ color: nexyColors.blueyGrey }}>
          or{' '}
          <Checkbox
            data-cy="skipOptimization"
            disabled={false}
            label="No, skip the optimization"
            checked={optimizationType === budgetOptimizationType.SKIP}
            onClick={() => {
              if (optimizationType === budgetOptimizationType.SKIP) {
                handleChange({
                  target: {
                    name: 'optimizationType',
                    value: budgetOptimizationType.AUTOMATIC,
                  },
                });
              } else {
                handleChange({
                  target: {
                    name: 'optimizationType',
                    value: budgetOptimizationType.SKIP,
                  },
                });
              }
            }}
          />
        </div>
      </BudgetOptimizationWrapper>
      {optimizationType !== budgetOptimizationType.SKIP ? (
        <BudgetOptimizationWrapper>
          <PortfolioRisk />
          <BudgetDeltasWrapper>
            <H4Container>
              <Typography variant="h4">Budget delta</Typography>
              <Tooltip
                variant="dark"
                style={{ maxWidth: 340, wordBreak: 'break-word' }}
                popperProps={{ style: { zIndex: 3300 } }}
                content="A budget delta refers to the deviation between a planned budget and the budget spend during a certain timeframe."
              >
                <div>
                  <SvgQuestionCircle
                    style={{ width: 16, height: 16, color: nexyColors.cloudyBlue, margin: '0 0 8px 8px' }}
                  />
                </div>
              </Tooltip>
            </H4Container>
            <Typography variant="paragraph" withEllipsis={false}>
              How would you like {tenantName} to handle deltas between planned budget vs. spent during a budget
              allocation?
            </Typography>
            <Typography className="headerNote" variant="subtitlePill" withEllipsis={false}>
              Note: You can change your selection at any time. However, handling deltas will be done at every start of a
              new budget application. Changing the setting will have an impact from the next setting onwards.
            </Typography>
            <BudgetDelaOptionsWrapper>
              {BUDGET_DELTA_OPTIONS.map((budgetDeltaOption) => (
                <OptionCard
                  onClick={() =>
                    handleChange({
                      target: {
                        name: 'budgetDeltaHandlingPolicy',
                        value: budgetDeltaOption.id,
                      },
                    })
                  }
                  selected={budgetDeltaHandlingPolicy === budgetDeltaOption.id}
                  key={budgetDeltaOption.id}
                >
                  {budgetDeltaOption.image}
                  <Typography variant="paragraph" withEllipsis={false}>
                    {budgetDeltaOption.title}
                  </Typography>
                  <Typography style={{ fontSize: 13, fontWeight: 400 }} variant="subheadline" withEllipsis={false}>
                    {budgetDeltaOption.description}
                  </Typography>
                </OptionCard>
              ))}
            </BudgetDelaOptionsWrapper>
          </BudgetDeltasWrapper>
          <div style={{ color: nexyColors.blueyGrey }}>
            or{' '}
            <Checkbox
              disabled={false}
              data-cy="ignoreBudgetDelta"
              label="Ignore deltas. Don’t allocate budget."
              checked={budgetDeltaHandlingPolicy === NexoyaBudgetDeltaHandlingPolicy.Ignore}
              onClick={() => {
                handleChange({
                  target: {
                    name: 'budgetDeltaHandlingPolicy',
                    value: NexoyaBudgetDeltaHandlingPolicy.Ignore,
                  },
                });
              }}
            />
          </div>
        </BudgetOptimizationWrapper>
      ) : null}
    </WrapStyled>
  );
}

export default PortfolioBudget;
