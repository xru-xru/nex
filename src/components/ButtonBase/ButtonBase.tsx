import React from 'react';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import styled from 'styled-components';

export type BaseButtonProps = {
  children: React.ReactNode;
  onClick?: any;
  component: React.ComponentType<any> | 'button' | 'a';
  to?: string;
  disabled?: boolean;
  tabIndex?: string | number;
  href?: string;
  type?: string;
  withNewTab?: boolean;
  className?: string;
  style?: Record<string, any>;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};
export const classes = {
  root: 'NEXYButtonBase',
};
const ButtonBaseStyled = styled.button`
  color: inherit;
  cursor: pointer;
  margin: 0;
  border: 0;
  display: inline-flex;
  position: relative;
  user-select: none;
  align-items: center;
  border-radius: 0;
  vertical-align: middle;
  justify-content: center;
  text-decoration: none;
  background-color: transparent;
  font: inherit;
  padding: 0;
  outline: none;
  transition: all 0.2s ease;

  &:disabled,
  &:disabled:hover,
  &:disabled:active,
  &.disabled,
  &.disabled:hover,
  &.disabled:active {
    cursor: default;
    pointer-events: none;
  }
`;
const ButtonBase = React.forwardRef<BaseButtonProps, any>(function ButtonBase(props, ref) {
  const {
    children,
    component = 'button',
    tabIndex = '0',
    className,
    disabled,
    style,
    onClick,
    startAdornment,
    endAdornment,
    ...other
  } = props;
  let ComponentProp = component;

  if (ComponentProp === 'button' && other.href) {
    ComponentProp = 'a';
  }

  if (ComponentProp === 'button' && other.to) {
    ComponentProp = Link;
  }

  const buttonProps = {};
  // Sometimes it's helpful to use dataset props. Thus we need to make sure we apply them to the button
  Object.keys(other).forEach((key) => {
    if (key.startsWith('data-')) {
      buttonProps[key] = other[key];
    }
  });

  if (ComponentProp === 'button') {
    //@ts-ignore
    buttonProps.type = other.type;
    //@ts-ignore
    buttonProps.disabled = disabled;
  } else {
    if (ComponentProp !== 'a' || !other.href) {
      //@ts-ignore
      buttonProps.role = 'button';
    }

    buttonProps['aria-disabled'] = disabled;
  }

  function handleClick(ev: React.SyntheticEvent<any>) {
    ev.currentTarget.blur();

    if (typeof onClick === 'function') {
      onClick(ev);
    }
  }

  return (
    <ButtonBaseStyled
      onClick={handleClick}
      as={ComponentProp}
      ref={ref}
      tabIndex={disabled ? '-1' : tabIndex}
      target={other && other.withNewTab ? '_blank' : null}
      style={style}
      className={clsx(className, classes.root)}
      {...buttonProps}
      {...other}
    >
      {startAdornment}
      {children}
      {endAdornment}
    </ButtonBaseStyled>
  );
});
export default ButtonBase;
