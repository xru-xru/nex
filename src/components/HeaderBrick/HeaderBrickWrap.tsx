import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  className?: string;
  withTitleIconSpace?: boolean;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYHeaderBrickWrap',
};
interface WrapStyledHeaderBrickWrapProps {
  withTitleIconSpace: boolean;
}
const WrapStyled = styled.div<WrapStyledHeaderBrickWrapProps>`
  display: flex;
  align-items: center;
  padding-left: ${({ withTitleIconSpace }) => (withTitleIconSpace ? '44px' : 'auto')};

  & > .NEXYHeaderBrick {
    margin-right: 48px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

function HeaderBrickWrap({ className, withTitleIconSpace = false, ...rest }: Props) {
  return <WrapStyled className={clsx(className, classes.root)} withTitleIconSpace={withTitleIconSpace} {...rest} />;
}

export default HeaderBrickWrap;
