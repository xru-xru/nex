import clsx from 'clsx';
import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import CSSGrid from '../CSSGrid';

type Props = {
  className?: string;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYGridHeader',
};
const CSSGridStyled = styled(CSSGrid)`
  min-height: 40px;
  text-transform: uppercase;
  color: ${colorByKey('blueyGrey')};
  letter-spacing: 0.6px;
  font-size: 12px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${colorByKey('paleGrey')};
  align-items: center;
  width: 100%;
`;

function GridHeader({ className, ...rest }: Props) {
  return <CSSGridStyled data-cy="gridHeader" className={clsx(className, classes.root)} {...rest} />;
}

export default GridHeader;
