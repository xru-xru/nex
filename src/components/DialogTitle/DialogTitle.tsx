import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  className?: string;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYDialogTitle',
};
const WrapStyled = styled.div`
  flex: 0 0 auto;
  margin: 0;
  padding: 32px 24px 8px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  span {
    line-height: 32px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;
    font-size: 24px;
  }
`;

function DialogTitle({ className, ...props }: Props) {
  return <WrapStyled className={clsx(className, classes.root)} data-cy="dialogTitle" {...props} />;
}

export default DialogTitle;
