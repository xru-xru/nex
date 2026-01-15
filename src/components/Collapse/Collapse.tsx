import React from 'react';
import Transition from 'react-transition-group/Transition';

import style from 'dom-helpers/css';

export const EXITED = 'exited';
export const ENTERING = 'entering';
export const ENTERED = 'entered';
export const EXITING = 'exiting';

type Props = {
  transitionTime?: number;
  in: boolean;
  children?: React.ReactNode;
};

function getHeight(elem) {
  const value = elem.offsetHeight;
  const margins = ['marginTop', 'marginBottom'];

  return (
    value +
    //@ts-expect-error
    parseInt(style(elem, margins[0]), 10) +
    //@ts-expect-error
    parseInt(style(elem, margins[1]), 10)
  );
}

function Collapse({ transitionTime = 250, children, ...rest }: Props) {
  const styles = {
    collapse: {
      display: 'none',
    },
    collapse_in: {
      display: 'block',
    },
    collapsing: {
      position: 'relative',
      height: 0,
      overflow: 'hidden',
      transition: `${transitionTime}ms ease-in-out`,
      transitionProperty: 'height, visibility',
    },
  };

  const collapseStyles = {
    [EXITED]: styles.collapse,
    [EXITING]: styles.collapsing,
    [ENTERING]: styles.collapsing,
    [ENTERED]: styles.collapse_in,
  };

  const nodeRef = React.createRef<HTMLDivElement>();
  const handleEnter = () => {
    nodeRef.current.style.height = '0';
  };
  const handleEntering = () => (nodeRef.current.style.height = `${nodeRef.current.scrollHeight}px`);
  const handleEntered = () => (nodeRef.current.style.height = null);
  const handleExit = () => {
    nodeRef.current.style.height = `${getHeight(nodeRef.current)}px`;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    nodeRef.current.offsetHeight;
  };
  const handleExiting = () => (nodeRef.current.style.height = '0');

  return (
    <Transition
      {...rest}
      timeout={transitionTime}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onEntered={handleEntered}
      onExit={handleExit}
      onExiting={handleExiting}
    >
      {(state) => (
        <div ref={nodeRef} style={{ ...collapseStyles[state] }}>
          {children}
        </div>
      )}
    </Transition>
  );
}

export default Collapse;
