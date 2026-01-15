import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  className?: string;
};
export const classes = {
  root: 'NEXYCSSGrid',
};
const WrapStyled = styled.div`
  display: grid;
`;
const CSSGrid = React.forwardRef<Props, any>(function GridList(props, ref) {
  const { className, ...rest } = props;
  return <WrapStyled className={clsx(className, classes.root)} ref={ref} {...rest} />;
});
export default CSSGrid;
