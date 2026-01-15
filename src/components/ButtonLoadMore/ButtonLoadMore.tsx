import clsx from 'clsx';
import styled from 'styled-components';

import Button from '../Button';
import Spinner from '../Spinner';
import { MoreDotsIcon } from '../icons';

type Props = {
  onClick: () => void;
  isLoading: boolean;
  hideButton?: boolean;
  className?: string;
};
export const classes = {
  root: 'NEXYButtonLoadMore',
};
const WrapStyled = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 25px;
  height: 60px;
`;

const LoadMoreButton = ({ onClick, isLoading, hideButton, className }: Props) => {
  if (hideButton) return null;
  return (
    <WrapStyled className={clsx(className, classes.root)}>
      {isLoading ? (
        <Spinner size="20px" />
      ) : (
        <Button variant="contained" onClick={onClick} data-cy="loadMoreBtn">
          <MoreDotsIcon />
        </Button>
      )}
    </WrapStyled>
  );
};

export default LoadMoreButton;
