import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import { classes } from './classes';

type Props = {
  className?: string;
};
const ListItemIconStyled = styled.div`
  margin-right: 8px;
`;
const ListItemIcon = React.forwardRef<Props, any>(function ListItemIcon(props, ref) {
  const { className, ...other } = props;
  return <ListItemIconStyled className={clsx(classes.root, className)} ref={ref} {...other} />;
});
export default ListItemIcon;
