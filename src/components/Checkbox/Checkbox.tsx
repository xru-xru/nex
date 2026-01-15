import React from 'react';

import clsx from 'clsx';

import SwitchBase from '../SwitchBase/SwitchBase';
import SvgCheckIcon from '../icons/CheckIcon';
import SvgMinus from '../icons/Minus';
import {
  CheckboxChecked,
  CheckboxEmpty,
  CheckboxEmptyDark,
  CheckboxIndeterminate,
  DisabledCheckboxChecked,
  TempWrapperForHover,
} from './styles';

type Props = {
  checkedIcon?: any;
  icon?: any;
  indeterminate?: boolean;
  disabled?: boolean;
  indeterminateIcon?: any;
  inputProps?: Record<string, any>;
  label?: string;
  className?: string;
  color?: string;
};
export const classes = {
  root: 'NEXYCheckbox',
  checked: 'checked',
  indeterminate: 'indeterminate',
};
const defaultIcon = {
  light: <CheckboxEmpty />,
  dark: <CheckboxEmptyDark />,
};
const defaultCheckedIcon = (
  <CheckboxChecked>
    <SvgCheckIcon />
  </CheckboxChecked>
);
const disabledCheckedIcon = (
  <DisabledCheckboxChecked>
    <SvgCheckIcon />
  </DisabledCheckboxChecked>
);
const defaultIndeterminateIcon = (
  <CheckboxIndeterminate>
    <SvgMinus />
  </CheckboxIndeterminate>
);
const Checkbox = React.forwardRef<Props, any>(function Checkbox(props, ref) {
  const {
    checkedIcon = defaultCheckedIcon,
    color = 'light',
    icon = defaultIcon[color],
    indeterminate = false,
    disabled = false,
    indeterminateIcon = defaultIndeterminateIcon,
    inputProps,
    label,
    className,
    ...rest
  } = props;
  return (
    <SwitchBase
      ref={ref}
      type="checkbox"
      checkedIcon={disabled ? disabledCheckedIcon : indeterminate ? indeterminateIcon : checkedIcon}
      icon={icon}
      className={clsx(className, classes.root, {
        [classes.indeterminate]: indeterminate,
      })}
      inputProps={{
        'data-indeterminate': indeterminate,
        ...inputProps,
      }}
      disabled={disabled}
      label={label} // TODO: This is a workaround. See above comment with with icons
      component={TempWrapperForHover}
      {...rest}
    />
  );
});
export default Checkbox;
