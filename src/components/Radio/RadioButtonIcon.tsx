import clsx from 'clsx';
import styled, { css } from 'styled-components';

import theme from '../../theme/theme';

type Props = {
  checked?: boolean;
  className?: string;
};
export const classes = {
  checked: 'checked',
};
const outerCircle = {
  checked: css`
    border-color: transparent;
    background: ${theme.colors.primary};
    box-shadow: none;
  `,
  unchecked: css`
    border-color: #dfe1ed;
    background: transparent;
    box-shadow: 0 2px 4px -1px rgba(54, 55, 59, 0.11);
  `,
};
const innerCircle = {
  checked: css`
    transform: translate(-50%, -50%) scale(1);
    background: white;
  `,
  unchecked: css`
    transform: translate(-50%, -50%) scale(0);
    background: transparent;
  `,
};
const WrapStyled = styled.div<{
  readonly variant: 'checked' | 'unchecked';
}>`
  position: relative;
  display: flex;
  width: 18px;
  height: 18px;

  span {
    display: block;
    width: 100%;

    &:nth-child(1) {
      border-width: 1px;
      border-style: solid;
      border-radius: 50%;
      transition: border-color 0.175s, background 0.175s, box-shadow 0.175s;
      ${({ variant }) => outerCircle[variant]};
    }

    &:nth-child(2) {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      transition: transform 0.175s, background 0.175s;
      ${({ variant }) => innerCircle[variant]};
    }
  }
`;

function RadioButtonIcon({ checked, className, ...rest }: Props) {
  return (
    <WrapStyled
      variant={checked ? 'checked' : 'unchecked'}
      className={clsx(className, {
        [classes.checked]: checked,
      })}
      {...rest}
    >
      <span />
      <span />
      {/* <svg
       viewBox="0 0 20 20"
       style={{
         height: '1em',
         width: '1em',
         display: 'block',
         fill: 'currentcolor',
       }}
      >
       <path d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z" />
       <path d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z" />
      </svg> */}
    </WrapStyled>
  );
}

export default RadioButtonIcon;
