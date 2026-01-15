import React, { ComponentType } from 'react';

import styled from 'styled-components';

type InputBaseProps = {
  autoComplete?: boolean;
  autoFocus?: boolean;
  component?: ComponentType<{}> | string;
  defaultValue?: string | number;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rows?: string | number;
  type?: 'text' | 'number' | 'textarea' | 'search';
  value?: string | number;
  showPlaceholder?: boolean;
  className?: string;
  min?: number;
};
const InputBaseStyled = styled.input`
  font: inherit;
  width: 100%;
  color: currentColor;
  border: 0;
  margin: 0;
  padding: 6px 0 7px;
  display: block;
  min-width: 0;
  box-sizing: content-box;
  background: none;
  -webkit-tap-highlight-color: transparent;

  &:focus {
    outline: 0;
  }
`;
const InputBase = React.forwardRef<any, InputBaseProps>(function InputBase(props, ref) {
  const {
    autoComplete = false,
    autoFocus = false,
    component,
    defaultValue,
    disabled = false,
    error = false,
    id,
    name,
    placeholder,
    readOnly = false,
    required = false,
    rows,
    type = 'text',
    showPlaceholder,
    value,
    className,
    min = 0,
    ...other
  } = props;
  let inputComponent = component;

  if (rows) {
    inputComponent = 'textarea';
  }

  return (
    <InputBaseStyled
      aria-invalid={error}
      as={inputComponent}
      //@ts-ignore
      autoComplete={autoComplete ? true : 'off'}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      disabled={disabled}
      id={id}
      className={className}
      name={name}
      placeholder={showPlaceholder ? placeholder : ''}
      readOnly={readOnly}
      required={required}
      rows={rows}
      type={type}
      value={value}
      min={min}
      ref={ref}
      {...other}
    />
  );
});
export default InputBase;
export { InputBaseStyled };
export type { InputBaseProps };
