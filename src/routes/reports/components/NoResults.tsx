import styled from 'styled-components';

import Text from '../../../components/Text';
import SvgFileChartLine from '../../../components/icons/FileChartLine';

type Props = {
  notFound?: boolean;
};
const WrapStyled = styled.div`
  justify-content: center;
  position: absolute;
  left: 50%;
  top: 45vh;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  flex-direction: column;

  @media screen and (max-height: 400px) {
    position: relative;
  }

  svg {
    font-size: 70px;
    margin-bottom: 25px;
    opacity: 0.15;
  }

  h3 {
    opacity: 0.5;
  }
`;

const NoResults = ({ notFound = false }: Props) => (
  <WrapStyled>
    <SvgFileChartLine />
    <Text component="h3" data-cy="noReports">
      {notFound ? 'Nothing matched your search' : "You don't have any reports yet. Get started here."}
    </Text>
  </WrapStyled>
);

export default NoResults;
