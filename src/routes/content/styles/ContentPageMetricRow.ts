import styled from 'styled-components';

import GridRow from 'components/GridRow';
import TypographyTranslation from 'components/TypographyTranslation';

import { colorByKey } from 'theme/utils';

export const GridRowStyled = styled(GridRow)`
  display: grid;
  grid-template-columns: 90% 10%;
  overflow: scroll;
  padding-right: 24px;
  .NEXYTypography {
    font-size: 14px;
    font-weight: normal;
    color: ${colorByKey('darkGrey')};
  }
  .NEXYText {
    color: ${colorByKey('darkGrey')};
  }
`;
export const ChevronWrap = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: flex-end;
  color: #a6a7b5;
`;
export const ValueStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
export const ChangeStyled = styled.div`
  font-size: 13px;
  line-height: 18px;
`;
export const TypographyTranslationStyled = styled(TypographyTranslation)`
  color: ${colorByKey('cloudyBlue')};
`;
