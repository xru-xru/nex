import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import List from '../List';
import { classes } from './classes';

type Props = {
  className?: string;
};
const ListStyled = styled(List)`
  padding: 8px 0;
`;
const MenuList = React.forwardRef<Props, any>(function MenuList(props, ref) {
  const { className, ...rest } = props;
  return <ListStyled role="menu" ref={ref} className={clsx(className, classes.root)} tabIndex={-1} {...rest} />;
});
export default MenuList;
