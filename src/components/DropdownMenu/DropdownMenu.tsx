import React from 'react';

import styled from 'styled-components';

import { PopperPlacement } from '../../types/types.custom';

import MenuList from '../ArrayMenuList';
import Grow from '../Grow';
import Paper from '../Paper';
import Popper from '../Popper';

type Props = {
  children: any;
  container?: any;
  onClose?: () => void;
  open?: boolean;
  anchorEl: any;
  placement?: PopperPlacement;
  popperProps?: Record<string, any>;
  color?: 'light' | 'dark';
  transitionProps?: Record<string, any>;
};
export const classes = {
  root: 'NEXYMenu',
};
const PaperStyled = styled(Paper)`
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 16px;
  min-width: 16px;
  max-height: 200px;
  border-radius: 5px;
`;
const Menu = React.forwardRef<Props, any>(function Menu(props, ref) {
  const {
    children,
    container,
    onClose,
    open,
    anchorEl,
    placement,
    popperProps,
    transitionProps,
    color = 'light',
    ...rest
  } = props;
  return (
    <Popper
      container={container}
      isOpen={open}
      anchorEl={anchorEl}
      ref={ref}
      placement={placement}
      onClose={onClose}
      role={null}
      className={classes.root}
      popperProps={{
        modifiers: {
          offset: {
            offset: '0, 10',
          },
        },
        ...popperProps,
      }}
    >
      <Grow appear in={open} onExited={onClose} {...transitionProps}>
        <PaperStyled elevation={2} {...rest}>
          <MenuList color={color}>{children}</MenuList>
        </PaperStyled>
      </Grow>
    </Popper>
  );
});
export default Menu;
