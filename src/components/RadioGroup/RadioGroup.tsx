import React from 'react';

import clsx from 'clsx';

import { RadioGroupContext } from './RadioGroupProvider';

type Props = {
  children: React.ReactNode;
  className?: string;
};
export const classes = {
  root: 'NEXYRadioGroup',
};
const RadioGroup = React.forwardRef<Props, any>(function RadioGroup(props, _) {
  const { children, className, ...rest } = props;
  const context = {};
  return (
    <div className={clsx(className, classes.root)} {...rest}>
      <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
    </div>
  );
});
export default RadioGroup;
