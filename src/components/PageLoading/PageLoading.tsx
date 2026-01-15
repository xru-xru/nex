import styled from 'styled-components';

import Spinner from '../Spinner';

const WrapStyled = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageLoading = () => (
  <WrapStyled>
    <Spinner />
  </WrapStyled>
);

export default PageLoading;
