import { useCallback } from 'react';

import anime from 'animejs';

export const expandIn = (node: any, duration: number) =>
  anime({
    targets: node,
    opacity: [0, 1],
    height: [0, node.getBoundingClientRect().height],
    easing: 'cubicBezier(0.250, 0.460, 0.450, 0.940)',
    duration,
  });
export const expandOut = (node: any, duration: number) =>
  anime({
    targets: node,
    opacity: [1, 0],
    height: [node.getBoundingClientRect().height, 0],
    easing: 'cubicBezier(0.250, 0.460, 0.450, 0.940)',
    duration,
  });
type Options = {
  animationDuration?: number;
  onExit?: () => void;
};
export function useExpandAnimation({ animationDuration = 200, onExit }: Options) {
  const handleEnter = useCallback(
    (node: any) => {
      expandIn(node, animationDuration);
    },
    [animationDuration]
  );
  const handleExit = useCallback(
    (node: any) => {
      if (onExit) {
        onExit();
      }

      expandOut(node, animationDuration);
    },
    [onExit, animationDuration]
  );
  return {
    handleEnter,
    handleExit,
  };
}
