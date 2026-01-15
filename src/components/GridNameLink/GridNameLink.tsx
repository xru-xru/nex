import clsx from 'clsx';
import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import ButtonBase from '../ButtonBase';

type Props = {
  children: any;
  className?: string;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYGridNameLink',
};
const ButtonBaseStyled = styled(ButtonBase)`
  min-width: 0;
  justify-content: start;
  padding: 5px 0;

  &:hover {
    color: ${colorByKey('greenTeal')};
  }

  .NEXYAvatar {
    margin-right: 8px;
  }
`;

function GridNameLink({ children, className, ...rest }: Props) {
  return (
    <ButtonBaseStyled className={clsx(className, classes.root)} {...rest}>
      {children}
    </ButtonBaseStyled>
  );
}

export default GridNameLink;
