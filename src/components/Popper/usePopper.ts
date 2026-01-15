import React from 'react';

import PopperJS from 'popper.js';

import { PopperPlacement } from '../../types/types.custom';

import { useDiffedState } from '../../hooks/useDiffedState';

type Props = {
  referenceNode?: HTMLElement;
  popperNode?: HTMLElement | null;
  arrowNode?: HTMLElement;
  placement?: PopperPlacement;
  eventsEnabled?: boolean;
  enableScheduleUpdate?: boolean;
  positionFixed?: boolean;
  modifiers?: Record<string, any>;
  open?: boolean;
};
type PopperState = {
  styles: Record<string, any>;
  arrowStyles: Record<string, any>;
  hide: boolean;
  placement: PopperPlacement;
};
const initialMod = {};

function from3dTo2d(string) {
  const [x, y] = string.split('(')[1].split(', ');
  return `translate(${x}, ${y})`;
}

// Comment: We need to remove the `willChange` and transform the  `translate3d(x,y,z)`
// otherwise it causes the bug with google chrome where the item is blured
function removeAcceleration({ transform, willChange, ...styles }) {
  return { ...styles, transform: from3dTo2d(transform) };
}

function usePopperState(placement: PopperPlacement) {
  const [currentStyles, setStyles] = useDiffedState({
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
  });
  const [currentOutOfBoundaries, setOutOfBoundaries] = React.useState(false);
  const [currentPlacement, setPlacement] = React.useState(placement);
  const [currentArrowStyles, setArrowStyles] = useDiffedState({});

  function updatePopperState(updatedData: PopperState) {
    const { styles, arrowStyles, hide, placement: updatedPlacement } = updatedData;
    //@ts-expect-error
    setStyles(removeAcceleration(styles));
    setOutOfBoundaries(hide);
    setPlacement(updatedPlacement);
    setArrowStyles(arrowStyles);
  }

  const popperStyles = {
    styles: currentStyles,
    placement: currentPlacement,
    outOfBoundaries: currentOutOfBoundaries,
    arrowStyles: currentArrowStyles,
  };
  return [popperStyles, updatePopperState];
}

function usePopper({
  referenceNode,
  popperNode,
  arrowNode,
  placement = 'bottom',
  eventsEnabled = true,
  positionFixed = false,
  enableScheduleUpdate = false,
  modifiers = initialMod,
  open = true,
}: Props) {
  const popperInstance = React.useRef<any>(null);
  const [popperStyles, updatePopperState] = usePopperState(placement);
  React.useEffect(() => {
    if (popperInstance.current) {
      popperInstance.current.destroy();
      popperInstance.current = null;
    }

    if (!referenceNode || !popperNode || !open) {
      return;
    }

    popperInstance.current = new PopperJS(referenceNode, popperNode, {
      placement,
      positionFixed,
      modifiers: {
        ...modifiers,
        arrow: {
          ...(modifiers && modifiers.arrow),
          enabled: Boolean(arrowNode),
          element: arrowNode,
        },
        applyStyle: {
          enabled: false,
        },
        updateStateModifier: {
          enabled: true,
          order: 900,
          //@ts-expect-error
          fn: updatePopperState,
        },
      },
    });
    return () => {
      if (popperInstance.current) {
        popperInstance.current.destroy();
        popperInstance.current = null;
      }
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrowNode, referenceNode, popperNode, placement, positionFixed, modifiers]);
  // TODO: Look into whether this is the right way to schedule update
  // for items like a tooltip on the graph which needs to update
  // in case we are hovering above another element.
  React.useEffect(() => {
    if (!popperInstance.current || !enableScheduleUpdate) {
      return;
    }

    popperInstance.current.scheduleUpdate(); // eslint-disable-next-line react-hooks/exhaustive-deps
  });
  React.useEffect(() => {
    if (!popperInstance.current) {
      return;
    }

    if (eventsEnabled) {
      popperInstance.current.enableEventListeners();
    } else {
      popperInstance.current.disableEventListeners();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsEnabled, popperInstance.current]);
  return popperStyles;
}

export { usePopper };
