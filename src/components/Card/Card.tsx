import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import Paper from '../Paper';

type Props = {
  className?: string;
};
export const classes = {
  root: 'NEXYCard',
};
const PaperStyled = styled(Paper)`
  overflow: hidden;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: ${colorByKey('paleGrey')};
`;
const Card = React.forwardRef<Props, any>(function Card(props, ref) {
  const { className, ...rest } = props;
  return <PaperStyled className={clsx(className, classes.root)} ref={ref} elevation={0} {...rest} />;
});
export default Card;
