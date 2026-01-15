import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import ButtonBase from '../ButtonBase';
import { classes } from './classes';

type Props = {
  children: React.ReactNode;
  button?: boolean;
  component: React.ReactNode;
  buttonComponent?: any;
  buttonProps?: Record<string, any>;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  selected?: boolean;
};
const ListItemStyled = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  text-decoration: none;
  width: 100%;
  box-sizing: border-box;
  text-align: left;

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;
const ListItem = React.forwardRef<Props, any>(function ListItem(props, ref) {
  const {
    children,
    disabled,
    selected,
    // autoFocus = false,
    // alignItems = 'center',
    button = false,
    buttonComponent: ButtonComponent = ButtonBase,
    buttonProps = {},
    component = 'li',
    className,
    ...rest
  } = props;
  // TODO: Autofocus logic added here.
  const componentProps = {
    className: clsx(className, classes.root, {
      [classes.disabled]: disabled,
      [classes.selected]: selected,
    }),
    as: component,
    ...rest,
  };

  if (button) {
    return (
      <ListItemStyled ref={ref} {...componentProps}>
        <ButtonComponent {...buttonProps}>{children}</ButtonComponent>
      </ListItemStyled>
    );
  }

  return (
    <ListItemStyled ref={ref} {...componentProps}>
      {children}
    </ListItemStyled>
  );
});
export default ListItem;
