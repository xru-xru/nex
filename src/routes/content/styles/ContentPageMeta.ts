import styled from 'styled-components';

import { colorByKey } from 'theme/utils';

export const BricksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 16px 4px;
  align-content: flex-start;
  flex-direction: row;
  max-width: 1440px;
`;
export const HeaderBrickStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 8px;

  margin: 0 24px 0 24px;

  span:first-child {
    font-size: 11px;
    font-weight: 600;
    color: ${colorByKey('cloudyBlue')};
  }
  span:nth-child(2) {
    font-size: 14px;
  }
`;

export const NameWrapStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;

  span {
    display: block;

    &:first-child {
      font-size: 13px;
      color: ${colorByKey('blueyGrey')};
    }
  }
`;

export const VerticalDivider = styled.div`
  border-left: 1px solid #e3e4e8;
  height: 40px;
  width: 0;
`;
