import React from 'react';

import { FormControlContext } from './FormControlProvider';

function useInternalFormControlState() {
  const context = React.useContext(FormControlContext);
  const { disabled, error, focused, required, filled, variant } = context || {};
  // const onFocus = React.useCallback(() => setFocused(() => true), [setFocused]);
  // const onBlur = React.useCallback(() => setFocused(() => false), [setFocused]);
  return {
    fcProviderExists: Boolean(context),
    disabled,
    error,
    focused,
    required,
    variant,
    filled, // onFocus,
    // onBlur,
    // withProvider,
  };
}

export { useInternalFormControlState };
