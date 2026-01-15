import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
  container?: HTMLElement;
  children: React.ReactNode;
  onRendered?: () => void;
}

const Portal = ({ container, children, onRendered }: Props) => {
  // const [, forceUpdate] = React.useState(false);
  const [mountNode, setMountNode] = React.useState(null);
  // const node = React.useRef(null);
  React.useLayoutEffect(() => {
    setMountNode(container || document.body);
  }, [container]);
  React.useLayoutEffect(() => {
    if (onRendered && mountNode) {
      onRendered();
    }
  }, [onRendered, mountNode]);
  return mountNode ? ReactDOM.createPortal(children, mountNode) : mountNode;
};

export default Portal;
