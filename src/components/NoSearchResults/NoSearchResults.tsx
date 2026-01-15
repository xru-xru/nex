import clsx from 'clsx';
import styled from 'styled-components';

import Typography from '../Typography';
import { NothingFoundIcon } from '../icons';

type Props = {
  isVisible?: boolean;
  className?: string;
  noResultsCustomMessage?: string;
};
const classes = {
  root: 'NEXYNoSearchResults',
};
const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 110px;
  color: rgba(0, 0, 0, 0.54);
  position: absolute;
  left: 0;
  top: 50%;
  right: 0;
  transform: translateY(-50%);

  svg {
    font-size: 44px;
    margin-bottom: 10px;
  }
`;

// TODO: This is a copy of what we have in the /components/PortfoliosFilterTable/NoSearchResults
const NoSearchResults = ({ isVisible = true, className, noResultsCustomMessage }: Props) => {
  if (!isVisible) return null;
  return (
    <WrapStyled className={clsx(className, classes.root)} data-cy="noSearchResults">
      <NothingFoundIcon />
      <Typography>{noResultsCustomMessage || `Nothing matched your search.`}</Typography>
    </WrapStyled>
  );
};

export default NoSearchResults;
