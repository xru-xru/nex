import React from 'react';

import styled, { css, keyframes } from 'styled-components';

type Props = {
  loading: boolean;
  isOn: boolean;
  onToggle: (ev: React.SyntheticEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  toggleNotAllowed: boolean;
};
const rotate = keyframes`
  0%,
  15% {
      transform: rotate(0deg);
  }
  50% {
      transform: rotate(290deg);
  }
  100% {
      transform: rotate(360deg);
  }
`;

interface LabelStyledSwitchAsyncProps {
  loading?: boolean;
  notAllowed: boolean;
}

const LabelStyled = styled.label<LabelStyledSwitchAsyncProps>`
  margin: 0;
  cursor: ${({ notAllowed }) => (notAllowed ? 'not-allowed' : 'pointer')}};

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

  ${({ loading }) =>
    loading &&
    css`
      input {
        & + div {
          width: 20px;
          margin: 0 10px;
          background: #eee;

          &:after {
            opacity: 1;
            animation: ${rotate} 0.9s infinite linear;
            animation-delay: 0.2s;
          }
        }
      }
    `}
`;
const SwitchAsync = React.forwardRef<Props, any>(function SwitchAsync(props, ref) {
  const { loading = false, onToggle, isOn, disabled, toggleNotAllowed = false, ...rest } = props;
  return (
    <LabelStyled loading={loading || undefined} notAllowed={toggleNotAllowed} {...rest} ref={ref}>
      <input
        type="checkbox"
        checked={isOn}
        disabled={loading || disabled}
        onChange={(ev: React.SyntheticEvent<HTMLInputElement>) => {
          if (loading || disabled) {
            return;
          }

          onToggle(ev);
        }}
      />
      <div />
    </LabelStyled>
  );
});
export default SwitchAsync;
