import React from 'react';

import styled from 'styled-components';

import { PopperPlacement } from '../../types/types.custom';

import Grow from '../Grow';
import Paper from '../Paper';
import Popper from '../Popper/Popper';

type Props = {
  anchorEl: any;
  open?: boolean;
  onClose?: () => void;
  children: any;
  container?: any;
  popperProps?: Record<string, any>;
  placement?: PopperPlacement;
  className?: string;
};
export const classes = {
  root: 'NEXYPanel',
};
const PaperStyled = styled(Paper)`
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 16px;
  min-width: 16px;
  max-height: 200px;
  border-radius: 5px;
`;
const Panel = React.forwardRef<Props, any>(function Panel(props, ref) {
  const { open, anchorEl, container, onClose, children, popperProps, placement, className, ...rest } = props;
  return (
    <>
      <Popper
        isOpen={open}
        anchorEl={anchorEl}
        placement={placement}
        role={null}
        onClose={onClose}
        ref={ref}
        container={container}
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
          <PaperStyled // className={clsx(className, classes.root)}
            elevation={2}
            {...rest}
          >
            {children}
          </PaperStyled>
        </Grow>
      </Popper>
    </>
  );
});
export default Panel;
