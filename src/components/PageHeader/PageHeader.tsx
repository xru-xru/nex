import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  children: any;
  className?: string;
};
export const classes = {
  root: 'NEXYPageHeader',
};
const WrapStyled = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
`;
const PageHeader = React.forwardRef<Props, any>(function PageHeader(props, ref) {
  const { className, children, ...rest } = props;
  return (
    <WrapStyled className={clsx(className, classes.root)} ref={ref} {...rest}>
      {children}
    </WrapStyled>
  );
});
export default PageHeader;
