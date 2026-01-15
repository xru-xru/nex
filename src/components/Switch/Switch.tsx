import React from 'react';

import styled from 'styled-components';

type Props = {
  isOn: boolean;
  onToggle: (ev: React.SyntheticEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  toggleNotAllowed: boolean;
};
const LabelStyled = styled.label<{
  readonly notAllowed?: boolean;
}>`
  margin: 0;
  cursor: ${({ notAllowed }) => (notAllowed ? 'not-allowed' : 'pointer')};

  & > span {
    line-height: 20px;
    margin: 0 0 0 4px;
    vertical-align: top;
  }

  input {
    display: none;

    & + div {
      width: 40px;
      height: 20px;
      background: #aaaaaa;
      border-radius: 10px;
      vertical-align: top;
      position: relative;
      display: inline-block;
      user-select: none;
      transition: all 0.4s ease;

      &:before {
        content: '';
        float: left;
        width: 12px;
        height: 12px;
        background: #fff;
        pointer-events: none;
        margin-top: 4px;
        margin-left: 4px;
        border-radius: inherit;
        transition: all 0.4s ease 0s;
      }
      &:after {
        content: '';
        left: 1px;
        top: 1px;
        width: 12px;
        height: 12px;
        border: 3px solid transparent;
        border-top-color: #0ec76a;
        border-radius: 50%;
        position: absolute;
        opacity: 0;
      }
    }
    &:checked + div {
      background: #0ec76a;
      &:before {
        transform: translate(20px, 0);
      }
    }
  }
`;
const Switch = React.forwardRef<Props, any>(function Switch(props, ref) {
  const { onToggle, isOn, disabled, toggleNotAllowed = false, ...rest } = props;

  const handleChange = (ev: React.SyntheticEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    ev.stopPropagation();
    onToggle(ev);
  };

  return (
    <LabelStyled notAllowed={toggleNotAllowed} {...rest} ref={ref}>
      <input type="checkbox" checked={isOn} disabled={disabled} onChange={handleChange} />
      <div />
    </LabelStyled>
  );
});
export default Switch;
