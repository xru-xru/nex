import { useForkRef } from '../../utils/reactHelpers';
import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import { nexyColors } from '../../theme';
import { FormControlContext } from '../FormControl/FormControlProvider';
import getFormControlState from '../FormControl/getFormControlState';
import { isFilled } from './utils';

type Props = {
  'aria-describedby'?: string;
  // renderPrefix,
  autFocus?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
  inputProps?: Record<string, any>;
  wrapProps?: Record<string, any>;
  defaultValue: any;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  id?: string;
  multiline?: boolean;
  inputRef?: React.Ref<any>;
  startAdornment?: any;
  endAdornment?: any;
  name: string;
  onBlur?: (ev?: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onChange?: (ev: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onClick?: (ev: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onFocus?: (ev: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onEmpty?: () => void;
  onFilled?: () => void;
  onKeyDown?: (ev: React.SyntheticEvent<any>) => void;
  onKeyUp?: (ev: React.SyntheticEvent<any>) => void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rows?: string | number;
  type?: string;
  value?: any;
};
export const classes = {
  root: 'NEXYInputWrap',
  input: 'NEXYInputBase',
  disabled: 'disabled',
  error: 'error',
  fullWidth: 'full-width',
  focused: 'focused',
  filled: 'filled',
  prefix: 'input-prefix',
  suffix: 'input-suffix',
};
const WrapStyled = styled.div`
  cursor: text;
  display: inline-flex;
  align-items: center;
  position: relative;

  &.full-width {
    width: 100%;
    flex: 1;
  }

  &.disabled {
    cursor: default;
    pointer-events: none;
    background: ${nexyColors.seasalt};
    box-shadow: none;
    input {
      color: ${nexyColors.coolGray};
    }
  }
`;
const InputBaseStyled = styled.input`
  background: none;
  border: 0;
  box-sizing: content-box;
  color: currentColor;
  display: block;
  font: inherit;
  margin: 0;
  min-width: 0;
  padding: 0;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  resize: none;

  &:disabled,
  &:disabled:hover,
  &.disabled,
  &.disabled:hover {
    cursor: default;
    pointer-events: none;
  }

  /*
  &:invalid {
    box-shadow: none;
  }
  */

  &::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  &[type='search'] {
    -moz-appearance: textfield;
    -webkit-appearance: textfield;
  }
`;
const InputBase = React.forwardRef<Props, any>(function InputBase(props, ref) {
  const {
    'aria-describedby': ariaDescribedby,
    // onEmpty,
    // onFilled,
    // renderPrefix,
    autoComplete,
    autoFocus = false,
    className,
    inputProps: inputPropsProp = {},
    wrapProps = {
      as: 'div',
    },
    defaultValue,
    disabled = false,
    error = false,
    fullWidth = false,
    id,
    multiline = false,
    name,
    onBlur,
    onChange,
    onClick,
    inputRef: inputRefProp,
    onFocus,
    onEmpty,
    onFilled,
    onKeyDown,
    onKeyUp,
    placeholder,
    readOnly = false,
    // required = false,
    startAdornment: startAdornmentProp,
    endAdornment: endAdornmentProp,
    rows,
    type = 'text',
    value,
    ...rest
  } = props;
  const ctxFormControl = React.useContext(FormControlContext);
  const [focused, setFocused] = React.useState(false);
  const { current: isControlled } = React.useRef(value != null);
  const inputRef = React.useRef(null);
  const handleInputRef = useForkRef(inputRef, inputRefProp);
  const fcs: any = getFormControlState({
    props,
    //@ts-ignore
    ctxFormControl,
    states: ['disabled', 'error', 'required', 'filled'],
  });
  fcs.focused = ctxFormControl ? ctxFormControl.focused : focused;
  // The blur won't fire when the disabled state is set on a focused input.
  // We need to book keep the focused state manually.
  React.useEffect(() => {
    if (!ctxFormControl && disabled && focused) {
      setFocused(false);

      if (onBlur) {
        onBlur();
      }
    }
  }, [ctxFormControl, disabled, focused, onBlur]);
  const checkDirty = React.useCallback(
    (obj) => {
      if (isFilled(obj)) {
        if (ctxFormControl && ctxFormControl.onFilled) {
          ctxFormControl.onFilled();
        }

        if (onFilled) {
          onFilled();
        }

        return;
      }

      if (ctxFormControl && ctxFormControl.onEmpty) {
        ctxFormControl.onEmpty();
      }

      if (onEmpty) {
        onEmpty();
      }
    },
    [ctxFormControl, onEmpty, onFilled]
  );
  React.useEffect(() => {
    if (isControlled) {
      checkDirty({
        value,
      });
    }
  }, [value, checkDirty, isControlled]);
  React.useEffect(() => {
    if (!isControlled) {
      checkDirty(inputRef.current);
    }
  }, [checkDirty, isControlled]);

  const handleFocus = (ev: React.SyntheticEvent<any>) => {
    if (fcs.disabled || disabled) {
      ev.stopPropagation();
      return;
    }

    if (onFocus) {
      onFocus(ev);
    }

    if (ctxFormControl && ctxFormControl.onFocus) {
      ctxFormControl.onFocus();
    } else {
      setFocused(true);
    }
  };

  const handleBlur = (ev: React.SyntheticEvent<any>) => {
    if (onBlur) {
      onBlur(ev);
    }

    if (ctxFormControl && ctxFormControl.onBlur) {
      ctxFormControl.onBlur();
    } else {
      setFocused(false);
    }
  };

  const handleChange = (ev: React.SyntheticEvent<any>, ...args) => {
    if (onChange) {
      onChange(ev, ...args);
    }
  };

  const handleClick = (ev: React.SyntheticEvent<any>) => {
    if (inputRef.current && ev.currentTarget === ev.target) {
      inputRef.current.focus();
    }

    if (onClick) {
      onClick(ev);
    }
  };

  const inputProps: any = {
    as: 'input',
    ...inputPropsProp,
  };
  inputProps.ref = handleInputRef;

  if (multiline || rows) {
    inputProps.as = 'textarea';
    inputProps.type = undefined;
  }

  const startAdornment = inputProps.startAdornment || startAdornmentProp;
  const endAdornment = inputProps.endAdornment || endAdornmentProp;
  return (
    <WrapStyled
      ref={ref}
      onClick={handleClick}
      className={clsx(className, classes.root, {
        [classes.disabled]: fcs.disabled,
        [classes.error]: fcs.error,
        [classes.fullWidth]: fullWidth,
        [classes.focused]: fcs.focused,
        [classes.filled]: fcs.filled,
        [classes.prefix]: startAdornment,
        [classes.suffix]: endAdornment,
      })}
      {...wrapProps}
    >
      {startAdornment}
      <FormControlContext.Provider value={undefined}>
        <InputBaseStyled
          className={clsx(classes.input, {
            [classes.disabled]: fcs.disabled,
            [classes.prefix]: startAdornment,
            [classes.suffix]: endAdornment,
          })}
          aria-describedby={ariaDescribedby}
          aria-invalid={error}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          disabled={fcs.disabled}
          id={id}
          name={name}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={rows}
          value={value}
          type={type}
          ref={inputRef}
          required={fcs.required}
          {...inputProps}
          {...rest}
        />
      </FormControlContext.Provider>
      {endAdornment}
    </WrapStyled>
  );
});
export default InputBase;
