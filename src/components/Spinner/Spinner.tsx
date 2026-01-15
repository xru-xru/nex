import { ReactElement } from 'react';

import styled, { keyframes } from 'styled-components';

import '../../theme/theme';

const loaderRotate = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`;
interface SpinnerIconProps {
  size: string;
  variant: 'dark' | 'light';
}
const SpinnerIcon = styled.div<SpinnerIconProps>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-width: 2px;
  border-style: solid;
  border-color: ${({ variant }) => {
    if (variant === 'dark') return 'rgba(192, 200, 208, 0.39)';
    if (variant === 'light') return 'rgba(192, 200, 208, 0.39)';
    return '';
  }};
  border-top-color: ${({ variant, theme }) => {
    if (variant === 'dark') return theme.colors.primary;
    if (variant === 'light') return '#fff';
    return '';
  }};
  border-radius: 50%;
  position: relative;
  animation: ${loaderRotate} 600ms linear infinite;
  margin: 0 auto;
`;
type Props = {
  size?: string;
  variant?: 'dark' | 'light';
  style?: Record<string, any>;
};

const Spinner = ({ size = '36px', variant = 'dark', ...rest }: Props): ReactElement => (
  <SpinnerIcon size={size} variant={variant} {...rest} />
);

export default Spinner;
