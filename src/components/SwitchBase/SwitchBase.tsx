import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import ButtonIcon from '../ButtonIcon';
import getFormControlState from '../FormControl/getFormControlState';
import { useInternalFormControlState } from '../FormControl/useInternalFormControl';

type Props = {
  autoFocus?: boolean;
  checked?: boolean;
  checkedIcon: React.ReactNode;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  id?: string;
  inputProps?: Record<string, any>;
  inputRef?: (el: any) => void | Record<string, any>;
  name?: string;
  onBlur?: (ev: any) => void;
  onChange?: (ev: any, checkedState?: boolean) => void;
  onFocus?: (ev: any) => void;
  readOnly?: boolean;
  required?: boolean;
  tabIndex?: number | string;
  type: string;
  label?: string;
  value?: any;
};
export const classes = {
  root: 'NEXYSwitchBase',
  checked: 'checked',
  disabled: 'disabled',
};
const InputStyled = styled.input`
  top: 0;
  left: 0;
  width: 100%;
  cursor: inherit;
  height: 100%;
  margin: 0;
  opacity: 0;
  padding: 0;
  position: absolute;
`;
const SwitchBase = React.forwardRef<Props, any>(function SwitchBase(props, ref) {
  const {
    autoFocus,
    checked: checkedProp,
    checkedIcon,
    className,
    defaultChecked,
    disabled,
    icon,
    id,
    inputProps,
    inputRef,
    name,
    onBlur,
    onChange,
    onFocus,
    readOnly,
    required,
    tabIndex,
    type,
    value,
    label,
    ...rest
  } = props;
  const ctxFormControl = useInternalFormControlState();
  const { current: isControlled } = React.useRef(checkedProp != null);
  const [checkedState, setCheckedState] = React.useState(Boolean(defaultChecked));

  function handleFocus(ev: any) {
    if (onFocus) {
      onFocus(ev);
    }
  }

  function handleBlur(ev: any) {
    if (onBlur) {
      onBlur(ev);
    }
  }

  function handleInputChange(ev: any) {
    const checked = ev.target.checked;

    if (!isControlled) {
      setCheckedState(checked);
    }

    if (onChange) {
      onChange(ev, checked);
    }
  }

  const fcs: any = getFormControlState({
    props,
    ctxFormControl,
    states: ['disabled'],
  });
  const checked = isControlled ? checkedProp : checkedState;
  const hasLabelFor = type === 'checkbox' || type === 'radio';
  return (
    <ButtonIcon
      component="span"
      onFocus={handleFocus}
      onBlur={handleBlur}
      role={undefined}
      tabIndex={null}
      ref={ref}
      variant="transparent"
      disabled={disabled}
      className={clsx(className, classes.root, {
        [classes.checked]: fcs.checked,
        [classes.disabled]: fcs.disabled,
      })}
      {...rest}
    >
      {checked ? checkedIcon : icon}
      <InputStyled
        autoFocus={autoFocus}
        checked={checked}
        defaultChecked={defaultChecked}
        className="NEXYSwitchInput"
        disabled={disabled}
        id={hasLabelFor && id}
        name={name}
        onChange={handleInputChange}
        readOnly={readOnly}
        ref={inputRef}
        required={required}
        tabIndex={tabIndex}
        type={type}
        value={value}
        {...inputProps}
      />
      {label && (
        <label
          style={{
            marginLeft: '10px',
          }}
          htmlFor={name}
          onClick={(ev: any) => {
            ev.preventDefault();
            if (disabled) return null;
            else {
              handleInputChange(ev);
            }
          }}
        >
          {label || ''}
        </label>
      )}
    </ButtonIcon>
  );
});
export default SwitchBase;
