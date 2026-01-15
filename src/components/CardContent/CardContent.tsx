import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  className?: string;
};
export const classes = {
  root: 'NEXYCardContent',
};
const WrapStyled = styled.div`
  padding: 24px;
`;
const CardContent = React.forwardRef<Props, any>(function CardContent(props, ref) {
  const { className, ...rest } = props;
  return <WrapStyled className={clsx(className, classes.root)} ref={ref} {...rest} />;
});
export default CardContent;
