import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  className?: string;
  [x: string]: any;
};
export const classes = {
  root: `NEXYSidePanelContent`,
};
const WrapStyled = styled.div`
  display: flex;
  flex: 1 1 auto;
  padding: 32px;
  overflow-y: auto;
  /* WebkitOverflowScrolling: 'touch', // Add iOS momentum scrolling. */
`;

function SidePanelContent({ className, ...props }: Props) {
  return <WrapStyled className={clsx(className, classes.root)} {...props} />;
}

export default SidePanelContent;
