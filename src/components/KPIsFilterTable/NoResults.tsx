import styled from 'styled-components';

import Text from '../Text';
import { NothingFoundIcon } from '../icons';

type Props = {
  isVisible: boolean;
  className?: string;
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

// TODO: This is a copy of what we have in the /components/PortfoliosFilterTable/NoResults
const NoResults = ({ isVisible, className }: Props) => {
  if (!isVisible) return null;
  return (
    <WrapStyled className={className}>
      <NothingFoundIcon />
      <Text data-cy="noDataFound">No data found for this filter.</Text>
    </WrapStyled>
  );
};

export default NoResults;
