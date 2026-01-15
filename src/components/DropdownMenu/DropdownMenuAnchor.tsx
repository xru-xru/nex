import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import theme from '../../theme/theme';

type Props = {
  className?: string;
};
export const classes = {
  root: 'NEXYMenuAnchor',
};
const MenuAnchorStyled = styled.div`
  position: relative;
  z-index: ${theme.layers.menu};
`;
const MenuAnchor = React.forwardRef<Props, any>(function MenuAnchor(props, ref) {
  const { className } = props;
  return <MenuAnchorStyled ref={ref} className={clsx(className, classes.root)} {...props} />;
});
export default MenuAnchor;
