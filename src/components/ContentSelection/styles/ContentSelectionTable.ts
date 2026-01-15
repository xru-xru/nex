import styled from 'styled-components';

import { colorByKey } from 'theme/utils';

export const LoadingWrapStyled = styled.div`
  padding-top: 20px;

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
export const WrapStyled = styled.div`
  .NEXYGridHeader {
    min-height: 64px;
  }
  .NEXYCSSGrid {
    min-width: 100%;
    grid-template-columns: 80px 80px minmax(300px, 2fr) minmax(200px, 2fr);
  }
  .noResultsContentSelection {
    position: relative;
    margin-top: 50px;
  }
`;
export const TypeStyled = styled.div`
  color: ${colorByKey('blueGrey')};
`;
