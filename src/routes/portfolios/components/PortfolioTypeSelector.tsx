import React from 'react';

import styled from 'styled-components';

import { NexoyaPortfolioType } from '../../../types';

import { usePortfolio } from '../../../context/PortfolioProvider';

import Fieldset from '../../../components/Form/Fieldset';
import FormGroup from '../../../components/Form/FormGroup';
import Tooltip from '../../../components/Tooltip';
import Typography from '../../../components/Typography';
import SvgCashBag from '../../../components/icons/CashBag';
import SvgGoal from '../../../components/icons/Goal';

import { colorByKey } from '../../../theme/utils';

import { budgetOptimizationType } from '../../../configs/portfolio';
import { nexyColors } from '../../../theme';

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
`;

const PortfolioTypeItemStyled = styled.div<{ disabled: boolean }>`
  border: 1px solid rgba(223, 225, 237, 0.5);
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(42, 43, 46, 0.07);
  padding: 24px 24px 32px 24px;
  text-align: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : '')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  max-width: 390px;
  transition: background-color 0.1s ease-in;

  .NEXYH5 {
    margin-bottom: 8px;
    color: ${colorByKey('darkGrey')};
  }

  &.selectedPortfolioType {
    background-color: ${colorByKey('seasalt')};
  }

  svg {
    margin: 0 auto;
  }
`;

const PortfolioTypesWrapperStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;
`;

type PortfolioType = {
  type: NexoyaPortfolioType | 'target-based';
  icon: JSX.Element;
  title: string;
  disabled: boolean;
  featureFlag?: string;
  description: JSX.Element;
};

const PORTFOLIO_TYPES: PortfolioType[] = [
  {
    type: NexoyaPortfolioType.Budget,
    icon: <SvgCashBag style={{ width: 40, height: 40 }} />,
    title: 'Budget-based',
    disabled: false,
    description: (
      <>
        <p>Set fixed budgets to spend over a defined period of time and optimize with budget applications.</p>
        <br />
        <p>Best-suited to those who have a fixed budget to spend over a time period.</p>
      </>
    ),
  },
  {
    type: 'target-based' as any,
    title: 'Target-based',
    icon: <SvgGoal style={{ width: 40, height: 40, color: '#05A8FA' }} />,
    disabled: false,
    description: (
      <>
        <p>Set a goal using either Cost-per-Performance (CPA) or Return on Ad Spend (ROAS) as the target type.</p>
        <br />
        <p>Best-suited to those who want to achieve performance-based targets.</p>
      </>
    ),
  },
];

export const PortfolioTypeSelector = () => {
  const { meta, portfolioType } = usePortfolio();
  const selectedType = portfolioType.type === 'target-based' ? 'target-based' : meta.value.type;

  return (
    <WrapStyled>
      <Fieldset>
        <FormGroup>
          <PortfolioTypesWrapperStyled>
            {PORTFOLIO_TYPES.map((item) => {
              if (item.type === budgetOptimizationType.SKIP) return null;
              else
                return (
                  <Tooltip
                    key={item.type}
                    content={item.disabled ? 'Coming soon' : ''}
                    variant="dark"
                    popperProps={{
                      style: {
                        zIndex: 3300,
                      },
                    }}
                  >
                    <PortfolioTypeItemStyled
                      key={item.type}
                      disabled={item.disabled}
                      className={item.type === selectedType ? 'selectedPortfolioType' : ''}
                      data-cy={item.type}
                      style={{
                        width: '48%',
                      }}
                      onClick={() => {
                        if (item.disabled) {
                          return;
                        }
                        if (item.type === 'target-based') {
                          portfolioType.setType('target-based');
                        } else {
                          portfolioType.setType(null);
                          meta.handleChange({
                            target: {
                              name: 'type',
                              value: item.type,
                            },
                          });
                        }
                      }}
                    >
                      <Typography style={{ fontSize: 32, marginBottom: 18 }}>{item.icon}</Typography>
                      <Typography style={{ color: nexyColors.neutral900 }} variant="h5">
                        {item.title}
                      </Typography>
                      <Typography
                        variant="subtitlePill"
                        withEllipsis={false}
                        style={{
                          fontSize: 13,
                          fontWeight: '400',
                          letterSpacing: '0.24px',
                          color: nexyColors.secondaryText,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </PortfolioTypeItemStyled>
                  </Tooltip>
                );
            })}
          </PortfolioTypesWrapperStyled>
        </FormGroup>
      </Fieldset>
    </WrapStyled>
  );
};
