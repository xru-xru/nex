import React from 'react';

import { isEqual } from 'lodash';

function useDiffedState(initVal: any) {
  const [storedValue, setStoredValue] = React.useState(initVal);

  function setValue(value: any) {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue((prevState) => {
      if (isEqual(prevState, valueToStore)) {
        return prevState;
      }

      return valueToStore;
    });
  }

  return [storedValue, setValue];
}

export { useDiffedState };
