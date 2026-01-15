import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  className?: string;
  [x: string]: any;
};
export const classes = {
  root: `NEXYDialogContent`,
};
const WrapStyled = styled.div`
  flex: 1 1 auto;
  // padding top because of 1px border on form inputs
  padding: 2px 32px 32px;
  overflow-y: auto;
  /* WebkitOverflowScrolling: 'touch', // Add iOS momentum scrolling. */
`;

function DialogContent({ className, ...props }: Props) {
  return <WrapStyled className={clsx(className, classes.root)} {...props} />;
}

export default DialogContent;
