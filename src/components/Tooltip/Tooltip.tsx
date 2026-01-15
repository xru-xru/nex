import React from 'react';

import clsx from 'clsx';
import { get } from 'lodash';
import styled from 'styled-components';

import { PopperPlacement } from '../../types';

import Grow from '../Grow';
import Popper from '../Popper';

type TooltipSize = 'small' | 'medium' | 'large';

type Props = {
  container?: any;
  open?: boolean;
  placement?: PopperPlacement;
  children: any;
  className?: string;
  content?: any;
  id?: string;
  variant?: 'light' | 'dark';
  size?: TooltipSize;
  popperProps?: Record<string, any>;
  style?: Record<string, any>;
};
export const classes = {
  root: 'NEXYTooltip',
  open: 'tooltip-active',
};

interface TooltipStyledTooltipProps {
  variant: 'light' | 'dark';
  size: TooltipSize;
}

const getTooltipSizeCSS = (size: TooltipSize) => {
  switch (size) {
    case 'small':
      return {
        padding: '8px 12px',
        fontSize: '11px',
      };
    case 'medium':
      return {
        padding: '10px 14px',
        fontSize: '13px',
      };
    case 'large':
      return {
        padding: '16px',
        fontSize: '14px',
      };
    default:
      return {
        padding: '16px',
        fontSize: '14px',
      };
  }
};
const StyledTooltip = styled.div<TooltipStyledTooltipProps>`
  background: white;
  max-width: 300px;
  border-radius: 4px;
  box-shadow: 0px 3px 10px 0px rgba(10, 10, 10, 0.2);

  padding: ${({ size }) => getTooltipSizeCSS(size).padding};
  // TODO: 20px 24px looks good when the content is long, but weird when it's short -- 16px feels like a soft spot
  // padding: 20px 24px;
  font-size: ${({ size }) => getTooltipSizeCSS(size).fontSize};
  line-height: 21px;
  letter-spacing: 0.4px;

  word-break: break-all;
  background-color: ${({ variant }) => (variant === 'dark' ? '#2a2b2e' : 'white')};
  color: ${({ variant }) => (variant === 'dark' ? 'white' : 'inherit')};
`;

function Tooltip({
  children,
  className,
  container,
  content,
  id,
  open: openProp,
  placement = 'bottom',
  popperProps,
  variant = 'light',
  size = 'medium',
  ...rest
}: Props) {
  const [openState, setOpenState] = React.useState(false);
  const [childNode, setChildNode] = React.useState();
  const { current: isControlled } = React.useRef(openProp != null);
  const defaultId = React.useRef(null);
  // In case there is on "id" coming from props, let's add a defaultId ourselves
  React.useEffect(() => {
    if (!defaultId.current) {
      defaultId.current = `NEXY-tooltip-${Math.round(Math.random() * 1e5)}`;
    }
  }, [openProp]);

  function handleOpen() {
    if (!isControlled && !openState) {
      setOpenState(true);
    }
  }

  function handleClose() {
    if (!isControlled && openState) {
      setOpenState(false);
    }
  }

  function handleEnter(ev: any) {
    const onMouseOver = get(children, 'props.onMouseOver', null);

    if (onMouseOver) {
      onMouseOver(ev);
    }

    handleOpen();
  }

  function handleLeave(ev: any) {
    const onMouseLeave = get(children, 'props.onMouseLeave', null);

    if (onMouseLeave) {
      onMouseLeave(ev);
    }

    handleClose();
  }

  let open = isControlled ? openProp : openState;

  // We don't need to render tooltip if content is empty string.
  // There is nothing to show anyway.
  if (content === '') {
    open = false;
  }

  const childrenProps = {
    'aria-describedby': open ? id || defaultId.current : null,
    // title: typeof content === 'string' ? content : null,
    ...rest,
    ...children.props,
    className: clsx(className, children?.props?.className, {
      [classes.open]: open,
    }),
    onMouseOver: handleEnter,
    onMouseLeave: handleLeave,
  };
  return (
    <>
      {React.cloneElement(children, {
        ref: setChildNode,
        ...childrenProps,
      })}
      <Popper
        container={container}
        isOpen={open}
        anchorEl={childNode}
        placement={placement}
        id={childrenProps['aria-describedby']}
        popperProps={{
          modifiers: {
            offset: {
              offset: '0, 10',
            },
            preventOverflow: {
              boundariesElement: 'offsetParent',
            },
          },
          ...popperProps,
        }}
      >
        <Grow in={open}>
          <StyledTooltip size={size} variant={variant} className={classes.root} {...rest}>
            {content}
          </StyledTooltip>
        </Grow>
      </Popper>
    </>
  );
}

export default Tooltip;
