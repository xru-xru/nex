import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  children: any;
  className?: string;
};
export const classes = {
  root: 'NEXYPageHeaderTitle',
};
const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .NEXYTypography {
    max-width: 50vw;
  }
`;
const PageHeaderTitle = React.forwardRef<Props, any>(function PageHeaderTitle(props, ref) {
  const { className, children, ...rest } = props;
  return (
    <WrapStyled data-cy="pageHeaderTitle" className={clsx(className, classes.root)} ref={ref} {...rest}>
      {children}
    </WrapStyled>
  );
});
export default PageHeaderTitle;
