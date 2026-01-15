import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import theme from '../../theme/theme';

import Fade from '../Fade';
import { classes } from './classes';
import { BackdropDark, BackdropLight } from './styles';

interface BackdropProps {
  isOpen: boolean;
  duration: number;
  onClick?: (ev: React.SyntheticEvent<HTMLElement>) => void;
  invisible?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}

const BackdropStyled = styled.div`
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: ${theme.layers.base};
  position: fixed;
  touch-action: none;
`;
const variantComponent = {
  light: BackdropLight,
  dark: BackdropDark,
};
const Backdrop = React.forwardRef<React.ReactNode, BackdropProps>((props, ref) => {
  const { isOpen, duration, onClick, invisible = false, variant = 'dark', className, ...rest } = props;
  const Component = variantComponent[variant];
  return (
    <Fade in={isOpen} duration={duration} {...rest}>
      <BackdropStyled
        as={Component}
        className={clsx(className, classes.root)}
        aria-hidden
        invisible={invisible}
        onClick={onClick}
        ref={ref}
      />
    </Fade>
  );
});
export default Backdrop;
