import styled from 'styled-components';

import Spinner from 'components/Spinner';
import Card from 'components/layout/Card';

export const CardStyled = styled(Card)`
  position: relative;
`;

export const LoadingWrapStyled = styled.div`
  padding-top: 20px;
  height: 100vh;

  & > div {
    margin-bottom: 15px;
    background: #f4f6f7;
    height: 40px;

    &:nth-child(1) {
      opacity: 1;
    }
    &:nth-child(2) {
      opacity: 0.75;
    }
    &:nth-child(3) {
      opacity: 0.5;
    }
    &:nth-child(4) {
      opacity: 0.25;
    }
  }
`;

export const SpinnerStyled = styled(Spinner)`
  margin-top: 25px;
`;

export const ExtendedSearchWrapStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f6f7;
  border-radius: 4px;
  color: #8a8a8a;
  opacity: 1;
  padding: 5px 0;
  margin-top: -10px;
`;
