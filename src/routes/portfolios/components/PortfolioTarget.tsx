import React from 'react';

import styled from 'styled-components';

import { NexoyaPortfolioType } from '../../../types';

import { usePortfolio } from '../../../context/PortfolioProvider';

import Fieldset from '../../../components/Form/Fieldset/Fieldset';
import FormGroup from '../../../components/Form/FormGroup';
import Typography from '../../../components/Typography';
import SvgCostPerSymbol from '../../../components/icons/CostPerSymbol';
import SvgRoasSymbol from '../../../components/icons/RoasSymbol';
import SvgTarget from '../../../components/icons/Target';

import { colorByKey } from '../../../theme/utils';

import { nexyColors } from '../../../theme';
import { PortfolioRisk } from './PortfolioRisk';

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

export const PortfolioTarget = () => {
  const { meta } = usePortfolio();

  return (
    <WrapStyled>
      <Typography style={{ marginBottom: 32 }} variant="h3">
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <SvgTarget style={{ marginRight: 4 }} /> Target-based portfolio settings
        </div>
      </Typography>
      <Typography variant="h4" style={{ marginBottom: 8 }}>
        Set a target type for this portfolio
      </Typography>
      <Typography withEllipsis={false} variant="subtitle" style={{ fontSize: 14, fontWeight: 400, maxWidth: 600 }}>
        What target type would you like to set for your target-based portfolio?
      </Typography>
      <Typography variant="subtitle" style={{ marginTop: 8, fontSize: 12 }}>
        This selection cannot be changed later on.
      </Typography>
      <Fieldset>
        <FormGroup style={{ marginBottom: 64 }}>
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
        </FormGroup>
        <FormGroup>
          <PortfolioRisk />
        </FormGroup>
      </Fieldset>
    </WrapStyled>
  );
};
