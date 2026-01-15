import { FormControlContextPropsKey, FormControlContextValue } from './FormControlProvider';

type Options = {
  props: Record<string, any>;
  states: FormControlContextPropsKey[];
  ctxFormControl?: FormControlContextValue;
};
export default function getFormControlState({ props, states, ctxFormControl }: Options) {
  return states.reduce((acc, state) => {
    acc[state] = props[state];

    if (ctxFormControl) {
      if (typeof props[state] === 'undefined') {
        acc[state] = ctxFormControl[state];
      }
    }

    return acc;
  }, {});
}
