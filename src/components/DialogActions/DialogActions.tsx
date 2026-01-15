import React from 'react';

import clsx from 'clsx';

import { Primary, Secondary } from './styles';

type Props = {
  className?: string;
  variant?: 'primary' | 'secondary';
};
export const classes = {
  root: 'NEXYDialogActions',
};
const variantComponent = {
  primary: Primary,
  secondary: Secondary,
};
const DialogActions = React.forwardRef<Props, any>(function DialogActions(props, ref) {
  const { className, variant = 'primary', ...rest } = props;
  const DialogActionsComponent = variantComponent[variant];
  return (
    <DialogActionsComponent ref={ref} className={clsx(className, classes.root)} data-cy="dialogActionsDiv" {...rest} />
  );
});
export default DialogActions;
