import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import { nexyColors } from '../../theme';
import Button from '../Button';
import ButtonAsync from '../ButtonAsync';
import ListItem from '../ListItem';

type Props = {
  className?: string;
  component?: React.ReactNode;
  role?: string;
  loading?: boolean;
  selected?: boolean;
  tabIndex?: number;
  disabled?: boolean;
  async?: boolean;
  color?: 'light' | 'dark';
  buttonProps?: Record<string, any>;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYMenuItem',
};
const ListItemStyled = styled(ListItem)`
  padding-top: 0;
  padding-bottom: 0;

  &.selected {
    button {
      background-color: ${nexyColors.davyGray};
    }
  }

  button {
    width: 100%;
    padding: 8px 12px;
    justify-content: flex-start;
    text-wrap: nowrap;
    font-weight: 400;
    border-radius: 5px;
    line-height: 18px;
    &:hover,
    &.selected,
    &.focus,
    &.active {
      background-color: ${nexyColors.davyGray};
    }
  }
`;
const MenuItem = React.forwardRef<Props, any>(function MenuItem(props, ref) {
  const {
    className,
    component: componentProp,
    role = 'menuitem',
    selected,
    async = false,
    loading = false,
    color,
    tabIndex: tabIndexProp,
    buttonProps: buttonPropsProp,
    ...rest
  } = props;
  let tabIndex;

  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  let component = componentProp || Button;

  if (!componentProp && async) {
    component = ButtonAsync;
  }

  const buttonProps = {
    loading,
    color,
    variant: 'contained',
    ...buttonPropsProp,
  };
  return (
    <ListItemStyled
      role={role}
      tabIndex={tabIndex}
      button={true}
      buttonComponent={component}
      buttonProps={buttonProps}
      selected={selected}
      ref={ref}
      className={clsx(className, classes.root)}
      {...rest}
    />
  );
});
export default MenuItem;
