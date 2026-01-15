import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
  subheader?: React.ReactNode;
  component?: React.ReactNode;
  className?: string;
};
export const classes = {
  root: 'NEXYList',
};
const ListStyled = styled.ul``;
const List = React.forwardRef<Props, any>(function List(props, ref) {
  const { children, subheader, component, className, ...rest } = props;
  return (
    <ListStyled ref={ref} className={clsx(className, classes.root)} as={component} {...rest}>
      {subheader}
      {children}
    </ListStyled>
  );
});
export default List;
