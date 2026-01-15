import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import CloseButton from '../CloseButton/CloseButton';
import Fade from '../Fade';
import Grow from '../Grow';
import Modal from '../Modal';
import Paper from '../Paper';
import Pop from '../Pop/Pop';

export type OnCloseFn = (ev: React.SyntheticEvent<any>, type: string) => void;

type Props = {
  children: React.ReactNode;
  isOpen?: boolean;
  hideCloseButton?: boolean;
  onClose?: OnCloseFn;
  position?: 'top' | 'center';
  backdropProps?: Record<string, any>;
  onExited?: () => void;
  duration?: number;
  paperProps?: Record<string, any>;
  className?: string;
  transition?: 'fade' | 'pop' | 'grow';
};
export const classes = {
  root: 'NEXYDialog',
};
const PaperStyled = styled(Paper)`
  display: flex;
  flex-direction: column;
  margin: 48px;
  position: relative;
  overflow-y: auto;
  flex: 0 1 auto;
  max-height: calc(100% - 96px);
  max-width: 800px;

  @media print {
    overflow-y: visible;
    box-shadow: none;
  }
`;
const Dialog = React.forwardRef<React.ReactNode, Props>((props, ref) => {
  const {
    isOpen = false,
    hideCloseButton = false,
    onClose,
    position = 'center',
    children,
    onExited,
    duration,
    backdropProps,
    className,
    paperProps = {},
    transition = 'fade',
    ...rest
  } = props;
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
  const handleKeyDown = React.useCallback((ev: React.SyntheticEvent<HTMLElement>) => {
    // @ts-ignore
    if (ev.key === 'Escape') {
      ev.stopPropagation();
    }
  }, []);
  const renderModalContent = () => (
    <div
      role="document"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown} // onMouseDown={handleMouseDown}
      tabIndex={0}
      style={{
        display: 'flex',
        alignItems: position === 'top' ? 'start' : 'center',
        justifyContent: 'center',
        height: '100%',
        outline: 'none',
      }}
    >
      <PaperStyled {...paperProps}>
        {!hideCloseButton && <CloseButton onClose={onClose} />}
        {children}
      </PaperStyled>
    </div>
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      role="dialog"
      ref={ref}
      backdropProps={backdropProps}
      className={clsx(className, classes.root)}
      {...rest}
    >
      {transition === 'fade' ? (
        <Fade in={isOpen} onExited={onExited} duration={duration}>
          {renderModalContent()}
        </Fade>
      ) : transition === 'pop' ? (
        <Pop in={isOpen} onExited={onExited} duration={duration}>
          {renderModalContent()}
        </Pop>
      ) : transition === 'grow' ? (
        <Grow in={isOpen} onExited={onExited} duration={duration}>
          {renderModalContent()}
        </Grow>
      ) : (
        <Fade in={isOpen} onExited={onExited} duration={duration}>
          {renderModalContent()}
        </Fade>
      )}
    </Modal>
  );
});
export default Dialog;
