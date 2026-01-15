import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import theme from '../../theme/theme';

import Grow from '../Grow';
import Portal from '../Portal';
import SnackbarContent from '../SnackbarContent';

type Props = {
  autoHideDuration?: number;
  children: any;
  className?: string;
  disableWindowBlurListener?: boolean;
  message?: string;
  onClose?: () => void;
  onMouseEnter?: (ev: any) => void;
  onMouseLeave?: (ev: any) => void;
  open?: boolean;
  resumeHideDuration?: number;
  TransitionComponent?: any;
  transitionDuration?: number;
};
export const classes = {
  root: 'NEXYSnackbar',
};
const WrapStyled = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.layers.dialog};

  left: 50%;
  right: auto;
  bottom: 24px;
  transform: translateX(-50%);
`;

const Snackbar = React.forwardRef<Props, any>(function Snackbar(props, ref) {
  const {
    autoHideDuration = 3000,
    children,
    className,
    disableWindowBlurListener = false,
    message,
    onClose,
    onMouseEnter,
    onMouseLeave,
    open,
    resumeHideDuration,
    TransitionComponent = Grow,
    transitionDuration = 220,
    ...rest
  } = props;
  const timerAutoHide = React.useRef<any>();
  const [exited, setExited] = React.useState(true);
  const setAutoHideTimer = React.useCallback(
    (autoHideDurationParam = null) => {
      const autoHideDurationBefore = autoHideDurationParam != null ? autoHideDurationParam : autoHideDuration;

      if (!onClose || autoHideDuration == null) {
        return;
      }

      clearTimeout(timerAutoHide.current);
      timerAutoHide.current = setTimeout(() => {
        const autoHideDurationAfter = autoHideDurationParam != null ? autoHideDurationParam : autoHideDuration;

        if (!onClose || autoHideDurationAfter == null) {
          return;
        }

        onClose();
      }, autoHideDurationBefore);
    },
    [autoHideDuration, onClose]
  );
  React.useEffect(() => {
    if (open) {
      setAutoHideTimer();
    }

    return () => {
      clearTimeout(timerAutoHide.current);
    };
  }, [open, setAutoHideTimer]);

  function handlePause() {
    clearTimeout(timerAutoHide.current);
  }

  const handleResume = React.useCallback(() => {
    if (typeof autoHideDuration === 'number') {
      if (typeof resumeHideDuration === 'number') {
        setAutoHideTimer(resumeHideDuration);
        return;
      }

      setAutoHideTimer(autoHideDuration * 0.5);
    }
  }, [autoHideDuration, resumeHideDuration, setAutoHideTimer]);

  function handleMouseEnter(ev: any) {
    if (onMouseEnter) {
      onMouseEnter(ev);
    }

    handlePause();
  }

  function handleMouseLeave(ev: any) {
    if (onMouseLeave) {
      onMouseLeave(ev);
    }

    handleResume();
  }

  function handleExited() {
    setExited(true);
  }

  function handleEnter() {
    setExited(false);
  }

  React.useEffect(() => {
    if (!disableWindowBlurListener && open) {
      window.addEventListener('focus', handleResume);
      window.addEventListener('blur', handlePause);
      return () => {
        window.removeEventListener('focus', handleResume);
        window.removeEventListener('blur', handlePause);
      };
    }

    return undefined;
  }, [disableWindowBlurListener, handleResume, open]);

  // So we only render active snackbars.
  if (!open && exited) {
    return null;
  }

  return (
    <Portal>
      <WrapStyled
        className={clsx(className, classes.root)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        {...rest}
      >
        <TransitionComponent
          appear
          in={open}
          onEnter={handleEnter}
          onExited={handleExited}
          duration={transitionDuration}
        >
          {children || <SnackbarContent message={message} />}
        </TransitionComponent>
      </WrapStyled>
    </Portal>
  );
});
export default Snackbar;
