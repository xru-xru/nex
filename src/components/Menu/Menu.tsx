import React from 'react';

import { PopperPlacement } from '../../types/types.custom';

import Grow from '../Grow';
import Paper from '../Paper';
import Popper from '../Popper';

type Props = {
  children: React.ReactNode;
  container?: any;
  onClose?: () => void;
  open?: boolean;
  anchorEl: any;
  placement?: PopperPlacement;
  popperProps?: Record<string, any>;
};
const Menu = React.forwardRef<Props, any>(function Menu(props, ref) {
  const { children, container, onClose, open, anchorEl, placement, popperProps, ...rest } = props;
  return (
    <Popper
      container={container}
      isOpen={open}
      anchorEl={anchorEl}
      ref={ref}
      placement={placement}
      onClose={onClose}
      popperProps={{
        modifiers: {
          offset: {
            offset: '0, 10',
          },
        },
        ...popperProps,
      }}
    >
      <Grow appear in={open} onExited={onClose}>
        <Paper elevation={2} {...rest}>
          {children}
        </Paper>
      </Grow>
    </Popper>
  );
});
export default Menu;
