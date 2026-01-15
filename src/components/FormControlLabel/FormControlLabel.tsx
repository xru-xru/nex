import React, { ReactElement } from 'react';

import clsx from 'clsx';
import { capitalize } from 'lodash';
import styled from 'styled-components';

import { useInternalFormControlState } from '../FormControl/useInternalFormControl';
import Text from '../Text';

type Props = {
  checked?: boolean;
  className?: string;
  control: ReactElement<any>;
  disabled?: boolean;
  inputRef: any;
  label: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  name?: string;
  onChange: () => void;
  value: any;
};
export const classes = {
  root: 'NEXYFormControlLabel',
  disabled: 'disabled',
  labelPlacementTop: 'labelPlacementTop',
  labelPlacementStart: 'labelPlacementStart',
  labelPlacementBottom: 'labelPlacementBottom',
  labelPlacementEnd: 'labelPlacementEnd',
};
const LabelStyled = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  vertical-align: middle;

  &:disabled,
  &.disabled {
    cursor: default;
    opacity: 0.75;
  }

  &.${classes.labelPlacementStart} {
    flex-direction: row-reverse;
  }

  &.${classes.labelPlacementTop} {
    flex-direction: column-reverse;
  }

  &.${classes.labelPlacementBottom} {
    flex-direction: column;
  }
`;
const FormControlLabel = React.forwardRef<Props, any>(function FormControlLabel(props, ref) {
  const {
    checked,
    className,
    control,
    disabled: disabledProp,
    inputRef,
    label,
    labelPlacement = 'end',
    name,
    onChange,
    value,
    ...rest
  } = props;
  const { fcProviderExists, ...fcCtx } = useInternalFormControlState();
  let disabled = disabledProp;

  // Comment: Assign disabled prop if it exists on FormControlLabel
  // component or it exists on the "Control" component.
  if (typeof disabled === 'undefined' && typeof control.props.disabled !== 'undefined') {
    disabled = control.props.disabled;
  }

  // Comment: Assign the disabled prop from context if the component
  // exists within the "FormControl" context and.
  if (typeof disabled === 'undefined' && fcProviderExists) {
    disabled = fcCtx.disabled;
  }

  // Comment: copy the input props in case they are applied on the
  // FormControlLabel and not on the Control element itself.
  const controlProps = {};
  ['checked', 'name', 'onChange', 'value', 'inputRef'].forEach((key) => {
    if (typeof control.props[key] === 'undefined' && typeof props[key] !== 'undefined') {
      controlProps[key] = props[key];
    }
  });
  return (
    <LabelStyled
      className={clsx(className, classes.root, {
        [classes[`labelPlacement${capitalize(labelPlacement)}`]]: labelPlacement !== 'end',
        [classes.disabled]: disabled,
      })}
      ref={ref}
      {...rest}
    >
      {React.cloneElement(control, controlProps)}
      <Text
        component="span"
        className={clsx({
          [classes.disabled]: disabled,
        })}
      >
        {label}
      </Text>
    </LabelStyled>
  );
});
export default FormControlLabel;
