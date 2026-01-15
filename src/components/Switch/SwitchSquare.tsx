// TODO: Consider merging this with Switch, as it is only different in design
import React from 'react';

import styled from 'styled-components';

import theme from '../../theme/theme';
import { colorByKey } from '../../theme/utils';

type Props = {
  isOn: boolean;
  onToggle: (ev: React.SyntheticEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  toggleNotAllowed: boolean;
  activeText?: string;
  inactiveText?: string;
};
const LabelStyled = styled.label<{
  readonly notAllowed?: boolean;
}>`
  margin: 7px 0 0 0;
  cursor: ${({ notAllowed }) => (notAllowed ? 'not-allowed' : 'pointer')}};

  input {
    display: none;

    & + div {
      width: 164px;
      height: 38px;
      color: ${colorByKey('blueyGrey')};
      padding: 4px;
      font-size: 14px;
      background: #f5f6fc;
      border-radius: 3px;
      vertical-align: top;
      position: relative;
      display: inline-block;
      user-select: none;
      z-index: ${theme.layers.body};
      transition: all 0.4s ease;

      span {
        display: inline-block;
        width: 78px;
        text-align: center;
        margin-top: 6px;
        position: relative;
      }
      

      &:before {
        content: '';
        position: absolute;
        width: 76px;
        height: 30px;
        background: #fff;
        pointer-events: none;
        z-index: ${theme.layers.base};
        border-radius: inherit;
        box-shadow: 0 2px 3px 0 rgba(136, 138, 148, 0.15);
        transition: all 0.25s ease 0s;
      }
    }
    &:checked + div {
      &:before {
        transform: translate(80px, 0);
      }
    }
  }
`;
const Switch = React.forwardRef<Props, any>(function Switch(props, ref) {
  const { onToggle, isOn, disabled, toggleNotAllowed = false, activeText = '', inactiveText = '', ...rest } = props;
  return (
    <LabelStyled notAllowed={toggleNotAllowed} {...rest} ref={ref}>
      <input
        type="checkbox"
        checked={isOn}
        disabled={disabled}
        onChange={(ev: React.SyntheticEvent<HTMLInputElement>) => {
          if (disabled) {
            return;
          }

          onToggle(ev);
        }}
      />
      <div>
        <span>{activeText || 'Total'}</span>
        <span>{inactiveText || 'Change'}</span>
      </div>
    </LabelStyled>
  );
});
export default Switch;
