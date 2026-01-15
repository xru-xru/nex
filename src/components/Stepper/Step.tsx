import clsx from 'clsx';
import styled from 'styled-components';

import { ThemeStyled } from '../../theme/theme';
import '../../theme/theme';

type Variant = 'finished' | 'active' | 'default';
type Props = {
  variant?: Variant;
  className?: string;
  onClick?: (ev: React.SyntheticEvent<HTMLElement>) => void;
};
export const classes = {
  root: 'NEXYStep',
  default: 'default',
  active: 'active',
  finished: 'finished',
};
const SpanStyled = styled.span<{
  readonly clickable?: boolean;
  readonly variant: 'default' | 'finished' | 'active';
  readonly theme: ThemeStyled;
}>`
  position: relative;
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')}
  background: ${({ variant, theme }) => {
    if (variant === 'finished') {
      return theme.colors.primary;
    } else if (variant === 'active') {
      return 'white';
    } else {
      return '#DFE1ED';
    }
  }};
  transition: background 0.1s;
  transition-delay: 0.175s;

  &:after {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    content: '';
    width: 8px;
    height: 8px;
    display: block;
    border-width: 2px;
    border-style: solid;
    border-color: ${({ variant, theme }) => (variant === 'active' ? theme.colors.primary : 'transparent')};
    transition: border-color 0.1s;
    transition-delay: 0.175s;
  }
`;

function Step({ variant = 'default', className, onClick, ...rest }: Props) {
  return (
    <SpanStyled
      variant={variant}
      clickable={!!onClick}
      onClick={onClick}
      className={clsx(className, classes.root, {
        [classes.active]: variant === 'active',
        [classes.default]: variant === 'default',
        [classes.finished]: variant === 'finished',
      })}
      {...rest}
    />
  );
}

export default Step;
