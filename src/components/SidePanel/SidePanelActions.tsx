import clsx from 'clsx';
import styled from 'styled-components';

import { nexyColors } from '../../theme';

type Props = {
  className?: string;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYSidePanelActions',
};
const WrapStyled = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px 32px;
  position: absolute;
  background-color: ${nexyColors.seasalt};
  bottom: 0;
  overflow-y: auto;
`;

function SidePanelActions(props: Props) {
  const { className, ...rest } = props;
  return <WrapStyled className={clsx(className, classes.root)} {...rest} />;
}

export default SidePanelActions;
