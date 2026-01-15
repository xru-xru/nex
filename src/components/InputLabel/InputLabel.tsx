import React from 'react';
import clsx from 'clsx';
import FormLabel from '../FormLabel';
import { LabelLight, LabelStandard } from './styles';

interface Props {
  children?: React.ReactNode;
  className?: string;
  variant?: 'standard';
  htmlFor?: string;
}

export const classes = {
  root: 'NEXYInputLabel',
};

const variantComponent = {
  standard: LabelStandard,
  light: LabelLight,
};

const InputLabel = React.forwardRef<HTMLLabelElement, Props>(function InputLabel(props, ref) {
  const { className, variant = 'standard', ...rest } = props;
  const LabelComponent = variantComponent[variant];
  return (
    <FormLabel
      className={clsx(className, classes.root)}
      // @ts-ignore
      as={LabelComponent}
      {...rest}
      ref={ref}
    />
  );
});

export default InputLabel;
