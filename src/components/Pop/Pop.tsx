import React from 'react';
import Transition from 'react-transition-group/Transition';

import anime from 'animejs';

const transitionIn = (node: any) =>
  anime({
    targets: node,
    easing: 'spring(0.2, 100, 20, 1)',
    opacity: [0.9, 0.9, 1],
    scale: [0.9, 1.1, 1],
    duration: 550,
  });

const transitionOut = (node: any) =>
  anime({
    targets: node,
    easing: 'spring(0.2, 100, 20, 1)',
    opacity: [1, 0],
  });

type PopProps = {
  children?: React.ReactNode;
  in: boolean;
  onEnter?: (node: HTMLElement) => void;
  onExit?: (node: HTMLElement) => void;
  duration: number;
  onExited?: (node: HTMLElement) => void;
  onEntering?: (node: HTMLElement) => void;
  appear?: boolean;
  delay?: number;
};
const Pop = React.forwardRef<React.ReactNode, PopProps>((props, ref) => {
  const { children, in: inProp, onEnter, onExit, onExited, onEntering, delay, duration = 500, ...rest } = props;
  const handleEnter = React.useCallback(
    (node) => {
      transitionIn(node);
      if (onEnter) {
        onEnter(node);
      }
    },
    [onEnter],
  );
  const handleExit = React.useCallback(
    (node) => {
      transitionOut(node);
      if (onExit) {
        onExit(node);
      }
    },
    [onExit],
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
export default Pop;
