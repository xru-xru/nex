import React from 'react';

// import ReactDOM from 'react-dom';
interface Props {
  children: React.ReactNode;
}

// TODO: needs to expand this to work properly. Not sure if a library
// or a simple solution is a better option
const FocusTrap = ({ children }: Props) => {
  // const lastFocus = React.useRef(null);
  const rootRef = React.useRef(null);
  // const handleRefs = (...args: any) => {
  // }();
  React.useEffect(() => {
    // console.log(children.ref);
  }, []);
  return (
    <>
      <div tabIndex={0} />
      {/* @ts-expect-error */}
      {React.cloneElement(children, {
        ref: rootRef,
      })}
      <div tabIndex={0} />
    </>
  );
};

export default FocusTrap;
