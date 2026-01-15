import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import CloseButton from '../CloseButton/CloseButton';
import Fade from '../Fade';
import Modal from '../Modal';
import Paper from '../Paper';

export type OnClickFn = (ev: React.SyntheticEvent<any>, type?: string) => void;
export type OnCloseFn = (ev: React.SyntheticEvent<any>, type?: string) => void;
type Props = {
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: OnClickFn;
  onClose?: OnCloseFn;
  position?: 'top' | 'center';
  backdropProps?: Record<string, any>;
  onExited?: () => void;
  duration?: number;
  paperProps?: Record<string, any>;
  className?: string;
};
export const classes = {
  root: 'NEXYDialog',
};
const PaperStyled = styled(Paper)`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  overflow-y: auto;
  flex: 0 1 auto;
  height: 100%;
  max-width: 95%;
  border-radius: 0px;

  @media print {
    overflow-y: visible;
    box-shadow: none;
  }
`;
const SidePanel = React.forwardRef<React.ReactNode, Props>((props, ref) => {
  const {
    isOpen = false,
    onClose,
    position = 'center',
    children,
    onExited,
    duration,
    backdropProps,
    className,
    paperProps = {},
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
    //@ts-expect-error
    if (ev.key === 'Escape') {
      ev.stopPropagation();
    }
  }, []);
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
      <Fade appear in={isOpen} onExited={onExited} duration={duration}>
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
            <CloseButton onClose={onClose} />
            {children}
          </PaperStyled>
        </div>
      </Fade>
    </Modal>
  );
});
export default SidePanel;
