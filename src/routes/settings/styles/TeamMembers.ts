import styled, { css } from 'styled-components';

import Text from 'components/Text';
import Card from 'components/layout/Card';

import { colorByKey } from 'theme/utils';

const gridWrap = css`
  grid-template-columns: minmax(230px, 1.3fr) minmax(180px, 1fr) 120px;
`;

export const WrapStyled = styled.div`
  overflow-x: auto;
  padding-bottom: 25px;

  .NEXYGridHeader {
    color: ${colorByKey('cloudyBlue80')};
    font-size: 12px;
    letter-spacing: 0.6px;
  }

  .NEXYCSSGrid {
    ${gridWrap}
    min-width: 100%;
    padding: 16px;
  }

  .reportTitle {
    color: ${colorByKey('darkGrey')};
  }
`;
export const GridStyled = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
`;
export const CardStyled = styled(Card)`
  padding: 15px 0px;
  display: grid;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 0;
  ${gridWrap}
`;
export const WrapLoadingStyled = styled.div`
  flex: 1;

  & > div {
    height: 70px;
    margin-bottom: 10px;
  }

  & > div:nth-child(1) {
    opacity: 0.75;
  }

  & > div:nth-child(2) {
    opacity: 0.5;
  }

  & > div:nth-child(3) {
    opacity: 0.3;
  }
`;
export const StyledEmail = styled(Text)`
  color: ${colorByKey('blueGrey')};
  font-weight: 400;
`;
