import React from 'react';
import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  children: any;
  className?: string;
};

export const classes = {
  root: 'NEXYPageHeaderActions',
};

const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-top: 7px;

  & > * {
    margin-right: 16px;

    &:last-child {
      margin-right: 0;
    }
  }
`;
const PageHeaderActions = React.forwardRef<Props, any>(function PageHeaderActions(props, ref) {
  const { className, children, ...rest } = props;
  return (
    <WrapStyled ref={ref} className={clsx(className, classes.root)} {...rest}>
      {children}
    </WrapStyled>
  );
});

export default PageHeaderActions;
