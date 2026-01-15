import { Link } from 'react-router-dom';

import styled from 'styled-components';

import GridRow from 'components/GridRow';
import NumberValue from 'components/NumberValue';

import { colorByKey } from 'theme/utils';

export const GridRowStyled = styled(GridRow)<{
  child?: boolean;
}>`
  display: grid;
  grid-template-columns: 90% 10%;
  padding-right: 24px;
  padding-left: ${({ child }) => (child ? '24px' : '')};

  .NEXYTypography {
    color: ${({ child }) => (child ? colorByKey('blueyGrey') : colorByKey('darkGrey'))};
  }

  .NEXYText {
    color: ${colorByKey('darkGrey')};
  }
`;
export const ChevronWrap = styled.div<{
  expanded?: boolean;
}>`
  display: flex;
  cursor: pointer;
  justify-content: flex-end;
  color: #a6a7b5;
  & > svg {
    transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 250ms ease-in-out;
    transform-origin: center;
  }
`;
export const ValueStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
export const NumberValueStyled = styled(NumberValue)`
  font-size: 13px;
`;
export const NameLink = styled(Link)`
  width: calc(100% - 14px);
`;
