import React from 'react';
import styled from 'styled-components';

import { NexoyaPortfolioType } from '../../../types';
import { usePortfolio } from '../../../context/PortfolioProvider';
import Typography from '../../../components/Typography';
import { nexyColors } from '../../../theme';
import SvgCostPerSymbol from '../../../components/icons/CostPerSymbol';
import SvgRoasSymbol from '../../../components/icons/RoasSymbol';
import { colorByKey } from '../../../theme/utils';

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

  &.selectedTargetType {
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

const PORTFOLIO_TARGET_TYPES = [
  {
    type: NexoyaPortfolioType.CostPer,
    title: 'Cost-per Target (CPA)',
    disabled: false,
    icon: (
      <SvgCostPerSymbol
        style={{
          width: 200,
          height: 65,
          marginBottom: 16,
        }}
      />
    ),

    description: (
      <>
        <p>Set performance-based target amounts and leverage maximum budget limits to achieve your goal. </p>
        <br />
        <p>This option is well-suited for goals including lead generation and lowering acquisition costs.</p>
      </>
    ),
  },
  {
    type: NexoyaPortfolioType.Roas,
    title: 'Return on Ad Spend (ROAS)',
    disabled: false,
    icon: (
      <SvgRoasSymbol
        style={{
          width: 200,
          height: 65,
          marginBottom: 16,
        }}
      />
    ),
    description: (
      <>
        <p>Set performance-based target amounts and leverage maximum budget limits to achieve your goal. </p>
        <br />
        <p>This option is well-suited for maximising your ad returns and e-commerce goals.</p>
      </>
    ),
  },
];

export const PortfolioTargetTypeSelector = () => {
  const { meta } = usePortfolio();

  return (
    <PortfolioTypesWrapperStyled>
      {PORTFOLIO_TARGET_TYPES.map((item) => {
        return (
          <PortfolioTypeItemStyled
            key={item.type}
            disabled={item.disabled}
            className={item.type === meta.value.type ? 'selectedTargetType' : ''}
            data-cy={item.type}
            style={{
              width: '48%',
            }}
            onClick={() => {
              if (item.disabled) {
                return;
              }
              meta.handleChange({
                target: {
                  name: 'type',
                  value: item.type,
                },
              });
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
                letterSpacing: '0.36px',
                color: nexyColors.secondaryText,
              }}
            >
              {item.description}
            </Typography>
          </PortfolioTypeItemStyled>
        );
      })}
    </PortfolioTypesWrapperStyled>
  );
};
