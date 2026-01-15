import styled from 'styled-components';

import { NexoyaPacingType } from '../../../../types';

import Fieldset from '../../../../components/Form/Fieldset';
import FormGroup from '../../../../components/Form/FormGroup';
import Tooltip from '../../../../components/Tooltip';
import Typography from '../../../../components/Typography';
import SvgDataDriven from '../../../../components/icons/DataDriven';
import SvgFixed from '../../../../components/icons/Fixed';
import SvgRampUp from '../../../../components/icons/RampUp';
import SvgSmooth from '../../../../components/icons/Smooth';

import { colorByKey } from '../../../../theme/utils';

import { budgetOptimizationType } from '../../../../configs/portfolio';
import { useBudgetItemStore } from '../../../../store/budget-item';

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

const PacingTacticItemStyled = styled.div<{ disabled: boolean }>`
  border: 1px solid rgba(223, 225, 237, 0.5);
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(42, 43, 46, 0.07);
  padding: 24px 24px 32px 24px;
  text-align: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : '')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  position: relative;

  .NEXYH5 {
    margin-bottom: 8px;
    color: ${colorByKey('darkGrey')};
  }

  &.selectedPacingTactic {
    background-color: ${colorByKey('paleGrey40')};
  }

  svg {
    margin: 0 auto;
  }
`;

const PacingTypesWrapperStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  max-width: 700px;
  margin-top: 48px;
`;

export const PACING_TYPES = [
  {
    type: NexoyaPacingType.Fixed,
    title: 'Fixed',
    disabled: false,
    description:
      'The budget item will start and stop in line with your chosen timeframe. \n' +
      '\n' +
      'Linear budget pacing, ideal for short flights',
  },
  {
    type: NexoyaPacingType.RampUp,
    title: 'Ramp-up',
    disabled: true,
    description:
      'Slow ramp-up of your budget within the timeframe.\n' +
      '\n' +
      'Full pacing at peak. Ideal for small budget limit adaptations.',
  },
  {
    type: NexoyaPacingType.Smooth,
    title: 'Smooth',
    disabled: true,
    description:
      'Gradual budget ramp-up and down-winding. \n' +
      '\n' +
      'Ideal for 3-4 month budget increases and following decreases.',
  },
  {
    type: NexoyaPacingType.DataDriven,
    title: 'Data-driven',
    disabled: true,
    description:
      'Add-on: \n experts determine the most optimal monthly allocation by additional analysis of up to 3 years worth of data.',
  },
];

const mapOptimizationIcons = {
  [NexoyaPacingType.Fixed]: (
    <SvgFixed
      style={{
        width: 200,
        height: 65,
        marginBottom: 16,
      }}
    />
  ),
  [`${NexoyaPacingType.Smooth}`]: (
    <SvgSmooth
      style={{
        width: 200,
        height: 65,
        marginBottom: 16,
      }}
    />
  ),
  [NexoyaPacingType.RampUp]: (
    <SvgRampUp
      style={{
        width: 200,
        height: 65,
        marginBottom: 16,
      }}
    />
  ),
  [`${NexoyaPacingType.DataDriven}`]: (
    <SvgDataDriven
      style={{
        width: 200,
        height: 65,
        marginBottom: 16,
      }}
    />
  ),
};

export const BudgetItemPacingTactic = () => {
  const {
    budgetItemState: { pacing },
    handleChangeValueByKey,
  } = useBudgetItemStore();

  return (
    <WrapStyled>
      <Fieldset>
        <FormGroup>
          <Typography variant="h4">Select one of the pacing tactics below to apply to your new budget item.</Typography>
          <PacingTypesWrapperStyled>
            {PACING_TYPES.map((item) => {
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
                    <PacingTacticItemStyled
                      key={item.type}
                      disabled={item.disabled}
                      className={item.type === pacing ? 'selectedPacingTactic' : ''}
                      data-cy={item.type}
                      style={{
                        width: '48%',
                      }}
                      onClick={() => {
                        if (item.disabled) {
                          return;
                        }
                        handleChangeValueByKey({
                          target: {
                            name: 'pacing',
                            value: item.type,
                          },
                        });
                      }}
                    >
                      {mapOptimizationIcons[`${item.type}`]}
                      <Typography variant="h5">{item.title}</Typography>
                      <Typography
                        variant="subtitlePill"
                        withEllipsis={false}
                        style={{ fontSize: 13, fontWeight: '400' }}
                      >
                        {item.description}
                      </Typography>
                    </PacingTacticItemStyled>
                  </Tooltip>
                );
            })}
          </PacingTypesWrapperStyled>
        </FormGroup>
      </Fieldset>
    </WrapStyled>
  );
};
