import React from 'react';

import styled from 'styled-components';

import { NexoyaPortfolioType } from '../../../types';

import { usePortfolio } from '../../../context/PortfolioProvider';

import { riskTypes } from '../../../utils/portfolioEdit';

import Tooltip from '../../../components/Tooltip';
import Typography from '../../../components/Typography';
import SvgQuestionCircle from '../../../components/icons/QuestionCircle';
import SvgRiskAggressive from '../../../components/icons/RiskAggressive';
import SvgRiskConservative from '../../../components/icons/RiskConservative';
import SvgRiskModerate from '../../../components/icons/RiskModerate';

import { colorByKey } from '../../../theme/utils';

import { budgetOptimizationType, budgetRiskType } from '../../../configs/portfolio';
import { nexyColors } from '../../../theme';
import { useTenantName } from '../../../hooks/useTenantName';

const H4Container = styled.div`
  display: inline-flex;
  align-items: center;
`;
export const BudgetOptimizationItem = styled.div`
  border: 1px solid rgba(223, 225, 237, 0.5);
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(42, 43, 46, 0.07);
  padding: 24px;
  text-align: center;
  cursor: pointer;

  .NEXYH5 {
    font-size: 16px;
    margin-bottom: 12px;
    color: ${colorByKey('darkGrey')};
  }

  &.selectedOptimization {
    background-color: ${colorByKey('paleGrey40')};
  }

  svg {
    margin: 0 auto;
  }
`;

export const mapRiskIcon = {
  [budgetRiskType.AGGRESSIVE]: (
    <SvgRiskAggressive
      style={{
        fontSize: 173,
      }}
    />
  ),
  [budgetRiskType.CONSERVATIVE]: (
    <SvgRiskConservative
      style={{
        fontSize: 173,
      }}
    />
  ),
  [budgetRiskType.MODERATE]: (
    <SvgRiskModerate
      style={{
        fontSize: 173,
      }}
    />
  ),
};

export function PortfolioRisk() {
  const {
    meta: {
      value: { optimizationType, optimizationRiskLevel, type },
      handleChange,
    },
  } = usePortfolio();
  const tenantName = useTenantName();

  const portfolioRiskType = type === NexoyaPortfolioType.Budget ? 'BUDGET' : 'TARGET';

  return optimizationType !== budgetOptimizationType.SKIP ? (
    <>
      <H4Container>
        <Typography variant="h4">Budget reallocation risk level</Typography>
        <Tooltip
          variant="dark"
          style={{ maxWidth: 400, wordBreak: 'break-word' }}
          popperProps={{ style: { zIndex: 3300 } }}
          content={`The risk level sets limits on budget shifts the ${tenantName} optimizer will propose for every budget application.`}
        >
          <div>
            <SvgQuestionCircle style={{ width: 16, height: 16, color: nexyColors.cloudyBlue, margin: '0 0 8px 8px' }} />
          </div>
        </Tooltip>
      </H4Container>
      <Typography variant="paragraph" withEllipsis={false}>
        What risk level would you like {tenantName} to perform budget reallocations at?
      </Typography>
      <Typography className="headerNote" variant="subtitlePill" withEllipsis={false}>
        Note: You can change your selection at any time.
      </Typography>
      <div
        style={{
          display: 'flex',
          marginBottom: 20,
          gap: 24,
        }}
      >
        {riskTypes[portfolioRiskType].map((item, index) => (
          <BudgetOptimizationItem
            key={index}
            className={item.value === optimizationRiskLevel ? 'selectedOptimization' : ''}
            data-cy={item.title}
            style={{
              width: '30%',
            }}
            onClick={() =>
              handleChange({
                target: {
                  name: 'optimizationRiskLevel',
                  value: item.value,
                },
              })
            }
          >
            {mapRiskIcon[item.value]}
            <Typography variant="h5">{item.title}</Typography>
            <Typography variant="subtitlePill" withEllipsis={false}>
              {item.description}
            </Typography>
          </BudgetOptimizationItem>
        ))}
      </div>
    </>
  ) : null;
}
