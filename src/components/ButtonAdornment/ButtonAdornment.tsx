import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  className?: String;
  component?: any;
  position: 'start' | 'end';
};
export const classes = {
  root: 'NEXYButtonAdornment',
  positionStart: 'start',
  positionEnd: 'end',
};
const WrapStyled = styled.span`
  &.start {
    margin-right: 8px;
  }
  &.end {
    margin-left: 8px;
  }
`;
const ButtonAdornment = React.forwardRef<Props, any>(function ButtonAdornment(props, ref) {
  const { className, position, component: Component = WrapStyled, ...rest } = props;
  return (
    <Component
      ref={ref}
      className={clsx(className, classes.root, {
        [classes.positionStart]: position === 'start',
        [classes.positionEnd]: position === 'end',
      })}
      {...rest}
    />
  );
});
export default ButtonAdornment;
