import React from 'react';

import { conditionalCb } from '../../utils/function';

type CallbackFn = () => void;
type Options = {
  initialValue?: number;
  end?: number;
};

function useStepper({ initialValue = 1, end }: Options = {}) {
  const [step, setStepState] = React.useState<number>(initialValue);
  const nextStep = React.useCallback(
    (cb?: CallbackFn) => {
      if (end && step > end) {
        return;
      }

      setStepState(step + 1);
      conditionalCb(cb);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, setStepState, end]
  );
  const previousStep = React.useCallback(
    (cb?: CallbackFn) => {
      if (step <= 1) {
        return;
      }

      setStepState(step - 1);
      conditionalCb(cb);
    },
    [step, setStepState]
  );
  const resetStep = React.useCallback(
    (cb?: CallbackFn) => {
      setStepState(initialValue);
      conditionalCb(cb);
    },
    [initialValue, setStepState]
  );
  const setStep = React.useCallback(
    (index: number, cb?: CallbackFn) => {
      if (index === step || index <= 0 || (end && index > end)) {
        return;
      }

      setStepState(index);
      conditionalCb(cb);
    },
    [step, setStepState, end]
  );
  return {
    step,
    resetStep,
    nextStep,
    previousStep,
    setStep,
    totalSteps: end,
  };
}

export default useStepper;
