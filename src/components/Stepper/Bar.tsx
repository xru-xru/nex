import clsx from 'clsx';
import styled from 'styled-components';

import theme from '../../theme/theme';

type Props = {
  percentage?: number;
  className?: string;
};
export const classes = {
  root: 'NEXYBar',
};
const WrapStyled = styled.div`
  position: absolute;
  top: 50%;
  background: rgb(223, 225, 237);
  height: 2px;
  width: 98%;
  transform: translate(-50%, -50%);
  z-index: ${theme.layers.base};
  left: 50%;

  & > div {
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.175s;
  }
`;

function Bar({ percentage = 0, className, ...rest }: Props) {
  return (
    <WrapStyled className={clsx(className, classes.root)} {...rest}>
      <div
        style={{
          width: `${percentage}%`,
        }}
      />
    </WrapStyled>
  );
}

export default Bar;
