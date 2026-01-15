import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import { createChainedFunction } from '../../utils/helpers';

import '../../theme/theme';

import { useRadioGroupInternal } from '../RadioGroup';
import SwitchBase from '../SwitchBase';
import RadioButtonIcon from './RadioButtonIcon';
import { nexyColors } from '../../theme';

type Props = {
  checked: boolean;
  name?: string;
  onChange?: (ev: any) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  required?: boolean;
  type?: string;
  value: any;
};
export const classes = {
  root: 'NEXTRadio',
};
const SwitchBaseStyled = styled(SwitchBase)`
  padding: 5px;

  .checked {
    span:first-child {
      background-color: transparent;
      border-color: ${nexyColors.greenTeal};
    }
    span:nth-child(2) {
      background-color: ${nexyColors.greenTeal};
    }
  }

  &:hover:not(.checked) {
    > div > span:first-child {
      border-color: #ccc;
      border-width: 1px;
    }
  }
`;
const defaultCheckedIcon = <RadioButtonIcon checked />;
const defaultIcon = <RadioButtonIcon />;
const Radio = React.forwardRef<Props, any>(function Radio(props, ref) {
  const { checked: checkedProp, name: nameProp, onChange: onChangeProp, className, ...rest } = props;
  const radioGroup = useRadioGroupInternal();
  let checked = checkedProp;
  const onChange = createChainedFunction(onChangeProp, radioGroup && radioGroup.onChange);
  let name = nameProp;

  if (radioGroup) {
    if (typeof checked === 'undefined') {
      checked = radioGroup.value === props.value;
    }

    if (typeof name === 'undefined') {
      name = radioGroup.name;
    }
  }

  return (
    <SwitchBaseStyled
      type="radio"
      name={name}
      checked={checked}
      ref={ref}
      onChange={onChange}
      checkedIcon={defaultCheckedIcon}
      icon={defaultIcon}
      className={clsx(className, classes.root)}
      {...rest}
    />
  );
});
export default Radio;
