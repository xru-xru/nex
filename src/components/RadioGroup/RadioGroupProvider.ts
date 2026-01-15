import React from 'react';

type State = {
  name?: string;
  onChange?: (...args: any) => void;
  value?: any;
};
const RadioGroupContext = React.createContext<State | null>(null);

// function RadioGroupInternalProvider(props) {
//   const
//   return <RadioGroupContext.Provider value={} {...props} />
// }
function useRadioGroupInternal() {
  const context = React.useContext(RadioGroupContext);
  return context;
}

export { RadioGroupContext, useRadioGroupInternal };
