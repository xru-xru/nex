import React from 'react';
import Transition from 'react-transition-group/Transition';

import anime from 'animejs';

const fadeIn = (node: any, delay: number, duration: number) =>
  anime({
    targets: node,
    opacity: {
      value: [0, 1],
      easing: 'linear',
    },
    duration,
    delay: delay ?? 0,
  });

const fadeOut = (node: any, duration: number) =>
  anime({
    targets: node,
    opacity: {
      value: [1, 0],
      easing: 'linear',
    },
    duration,
  });

type FadeProps = {
  children?: React.ReactNode;
  in: boolean;
  onEnter?: (node: HTMLElement) => void;
  onExit?: (node: HTMLElement) => void;
  duration?: number;
  onExited?: (node: HTMLElement) => void;
  onEntering?: (node: HTMLElement) => void;
  appear?: boolean;
  delay?: number;
};
const Fade = React.forwardRef<React.ReactNode, FadeProps>((props, ref) => {
  const { children, in: inProp, onEnter, onExit, onExited, onEntering, delay, duration = 300, ...rest } = props;
  const handleEnter = React.useCallback(
    (node) => {
      fadeIn(node, delay, duration);

      if (onEnter) {
        onEnter(node);
      }
    },
    [delay, duration, onEnter],
  );
  const handleExit = React.useCallback(
    (node) => {
      fadeOut(node, duration);

      if (onExit) {
        onExit(node);
      }
    },
    [onExit, duration],
  );
  return (
    <Transition
      appear
      in={inProp}
      onEnter={handleEnter}
      onExit={handleExit}
      onExited={onExited}
      onEntering={onEntering}
      timeout={duration}
      ref={ref}
      {...rest}
    >
      {children}
    </Transition>
  );
});
export default Fade;
