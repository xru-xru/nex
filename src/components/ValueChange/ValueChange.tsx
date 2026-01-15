import styled from 'styled-components';

import useCustomTheme from '../../hooks/useCustomTheme';
import { formatNumber } from '../../utils/formater';

import { colorByKey } from '../../theme/utils';

import Typography from '../Typography';

type Props = {
  value: number;
};
const ValueChangeWrapStyled = styled.div<{
  readonly colorScheme: Record<string, any>;
  readonly valueChangePercentage: number;
}>`
  .valueChangePercentage {
    color: ${({ colorScheme }) => colorScheme.fallback};

    span {
      font-weight: 600;
      margin-right: 5px;
      letter-spacing: 0.8px;
      color: ${({ valueChangePercentage, colorScheme }) =>
        valueChangePercentage === 0 ? 'default' : valueChangePercentage < 0 ? colorScheme.error : colorScheme.success};
    }
  }
`;

function ValueChange({ value }: Props) {
  const { hasTheme, customTheme } = useCustomTheme();
  const success = hasTheme ? customTheme.colors[6] : colorByKey('greenTeal');
  const error = hasTheme ? customTheme.colors[2] : colorByKey('orangeyRed');
  const fallback = hasTheme ? customTheme.colors[4] : colorByKey('cloudyBlue');
  if (typeof value !== 'number') return null;
  return (
    <ValueChangeWrapStyled
      valueChangePercentage={value}
      colorScheme={{
        success,
        error,
        fallback,
      }}
    >
      <Typography className="valueChangePercentage">
        <span>
          {value > 0 ? '+' : null}
          {formatNumber(value)}%
        </span>
        vs last period
      </Typography>
    </ValueChangeWrapStyled>
  );
}

export default ValueChange;
