import React from 'react';

import clsx from 'clsx';
import { capitalize } from 'lodash';

import InputBase from '../InputBase';
import { DarkOutlined, LightOutlined } from './styles';

type Props = {
  variant?: 'outlined';
  className?: string;
  color?: 'light' | 'dark';
  [x: string]: any;
};
export const classes = {
  outlined: 'outlined',
};
const themedComponent = {
  lightOutlined: LightOutlined,
  darkOutlined: DarkOutlined,
};
const Input = React.forwardRef<HTMLInputElement, Props>(function Input(props, ref) {
  const { variant = 'outlined', className, color = 'light', wrapProps, ...rest } = props;
  const key = `${color}${capitalize(variant)}`;
  const ThemedComponent = themedComponent[key] || LightOutlined;
  return (
    <InputBase
      className={clsx(className, {
        [classes.outlined]: variant === 'outlined',
      })}
      wrapProps={{
        as: ThemedComponent,
        ...wrapProps,
      }}
      ref={ref}
      {...rest}
    />
  );
});
export default Input;
