import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

type Props = {
  children: any;
  addTitleIconSpace?: boolean;
  className?: string;
};
export const classes = {
  root: 'NEXYPageHeaderDescription',
};
const WrapStyled = styled.div<{
  readonly addTitleIconSpace?: boolean;
}>`
  max-width: 550px;
  padding-left: ${({ addTitleIconSpace }) => (addTitleIconSpace ? '44px' : 'auto')};

  .NEXYTypography {
    color: ${colorByKey('blueyGrey')};
  }
`;
const PageHeaderDescription = React.forwardRef<Props, any>(function PageHeaderDescription(props, ref) {
  const { className, children, addTitleIconSpace = false, ...rest } = props;
  return (
    <WrapStyled
      data-cy="pageHeaderDescription"
      className={clsx(className, classes.root)}
      addTitleIconSpace={addTitleIconSpace}
      ref={ref}
      {...rest}
    >
      {children}
    </WrapStyled>
  );
});
export default PageHeaderDescription;
