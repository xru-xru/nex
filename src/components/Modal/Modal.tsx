import React from 'react';

import { createChainedFunction, getHasTransition } from '../../utils/helpers';

import Backdrop from '../Backdrop';
import '../Dialog';
import { OnCloseFn } from '../Dialog/Dialog';
import Portal from '../Portal';
import FocusTrap from './FocusTrap';

type Props = {
  children: any;
  isOpen: boolean;
  hideBackdrop?: boolean;
  onClick?: OnCloseFn;
  onClose: (...args: any) => void;
  // TODO: Needs to establish API args for the function
  backdropProps: Record<string, any>;
  role?: string;
  className?: string;
  ref?: any;
};

const Modal = (props: Props) => {
  const { children, isOpen, hideBackdrop = false, onClose, backdropProps, ...rest } = props;
  const hasTransition = getHasTransition(props);
  const [exited, setExited] = React.useState(!isOpen);

  const handleExited = React.useCallback(() => {
    setExited(true);
  }, [setExited]);

  const handleEnter = React.useCallback(() => {
    setExited(false);
  }, [setExited]);

  React.useLayoutEffect(() => {
    if (!exited) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [exited]);

  const handleBackdropClick = React.useCallback(
    (ev: React.SyntheticEvent<HTMLElement>) => {
      if (ev.target !== ev.currentTarget) {
        return;
      }

      if (onClose) {
        onClose(ev, 'backdropClick');
      }
    },
    [onClose]
  );

  const handleKeyDown = (ev: React.SyntheticEvent<HTMLElement>) => {
    // @ts-ignore
    if (ev.key === 'Escape') {
      ev.stopPropagation();
    }
  };

  if (!isOpen && (!hasTransition || exited)) {
    return null;
  }

  const childProps = {};

  if (hasTransition) {
    // @ts-ignore
    childProps.onEnter = createChainedFunction(
      handleEnter // children.props.onEnter
    );
    // @ts-ignore
    childProps.onExited = createChainedFunction(handleExited, children.props.onExited);
  }

  return (
    <Portal>
      {/* @ts-expect-error */}
      <div
        style={{
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          // @ts-ignore
          zIndex: '1300',
          position: 'fixed',
        }}
        className="dialog"
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {hideBackdrop ? null : (
          <Backdrop onClick={handleBackdropClick} isOpen={isOpen} duration={175} {...backdropProps} />
        )}
        <FocusTrap>{React.cloneElement(children, childProps)}</FocusTrap>
      </div>
    </Portal>
  );
};

export default Modal;
