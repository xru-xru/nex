import React, { PropsWithChildren } from 'react';

import clsx from 'clsx';
import { capitalize } from 'lodash';
import styled from 'styled-components';

import ButtonBase from '../ButtonBase';
import {
  DangerContained,
  DarkContained,
  PrimaryContained,
  SecondaryContained,
  TertiaryContained,
} from './styles-contained';
import { ContainedNormal, ContainedSmall, TextNormal, TextSmall } from './styles-size';
import { DarkText, PrimaryText, SecondaryText, TertiaryText } from './styles-text';
import { cn } from '../../lib/utils';

type Props = {
  variant?: 'text' | 'contained' | 'outlined';
  shape?: 'text' | 'outlined' | 'contained';
  size?: 'normal' | 'small';
  flat?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'dark' | 'danger' | 'white';
  to?: string;
  active?: boolean;
  children?: React.ReactNode;
  onClick?: any;
  component?: React.ComponentType<any> | 'button' | 'a';
  isOpen?: boolean;
  iconBefore?: React.ReactNode;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  iconAfter?: React.ReactNode;
  isActive?: boolean;
  autoFocus?: boolean;
  loading?: boolean;
  disabled?: boolean;
  tabIndex?: string | number;
  href?: string;
  type?: string;
  withNewTab?: boolean;
  className?: string;
  style?: Record<string, any>;
  labelClassName?: string;
  id?: string;
};
export const classes = {
  root: 'NEXYButton',
  label: 'NEXYButtonLabel',
  primaryText: 'primary-text',
  primaryContained: 'primary-contained',
  secondaryText: 'secondary-text',
  secondaryContained: 'secondary-contained',
  tertiaryText: 'tertiary-text',
  tertiaryContained: 'tertiary-contained',
  darkText: 'dark-text',
  darkContained: 'dark-contained',
  normal: 'normal',
  small: 'small',
  active: 'active',
};
const themedComponent = {
  primaryText: PrimaryText,
  primaryContained: PrimaryContained,
  secondaryText: SecondaryText,
  secondaryContained: SecondaryContained,
  tertiaryText: TertiaryText,
  tertiaryContained: TertiaryContained,
  darkContained: DarkContained,
  dangerContained: DangerContained,
  darkText: DarkText,
};
const sizedComponent = {
  containedNormal: ContainedNormal,
  containedSmall: ContainedSmall,
  textNormal: TextNormal,
  textSmall: TextSmall,
};
const LabelStyled = styled.span`
  /* To make sure text ellipsis are being applied */
  min-width: 0;
`;
const Button = React.forwardRef<HTMLElement, Props>(function Button(props: PropsWithChildren<Props>, ref) {
  const {
    children,
    variant = 'text',
    color = 'tertiary',
    className,
    id,
    disabled,
    active = false,
    size = 'normal',
    labelClassName,
    ...other
  } = props;
  const key = `${color}${capitalize(variant)}`;
  const ButtonComponent = themedComponent[key] || ButtonBase;
  const sizeKey = `${variant}${capitalize(size)}`;
  const SizedComponent = sizedComponent[sizeKey] || ButtonBase;
  const text = variant === 'text';
  const contained = variant === 'contained';
  const primary = color === 'primary';
  const secondary = color === 'secondary';
  const tertiary = color === 'tertiary';
  const dark = color === 'dark';
  return (
    <ButtonComponent
      as={SizedComponent}
      id={id}
      className={clsx(className, classes.root, {
        [classes.primaryContained]: primary && contained,
        [classes.primaryText]: primary && text,
        [classes.secondaryContained]: secondary && contained,
        [classes.secondaryText]: secondary && text,
        [classes.tertiaryContained]: tertiary && contained,
        [classes.tertiaryText]: tertiary && text,
        [classes.darkContained]: dark && contained,
        [classes.darkText]: dark && text,
        [classes.normal]: size === 'normal',
        [classes.small]: size === 'small',
        [classes.active]: active,
      })}
      disabled={disabled}
      ref={ref}
      {...other}
    >
      <LabelStyled className={cn(classes.label, labelClassName)}>{children}</LabelStyled>
    </ButtonComponent>
  );
});
export default Button;
