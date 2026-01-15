import clsx from 'clsx';
import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import CSSGrid from '../CSSGrid';

type Props = {
  className?: string;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYGridRow',
};
const CSSGridStyled = styled(CSSGrid)`
  align-items: center;
  min-height: 54px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${colorByKey('paleGrey')};
`;

function GridRow({ className, ...rest }: Props) {
  return <CSSGridStyled data-cy="gridRow" className={clsx(className, classes.root)} {...rest} />;
}

export default GridRow;
