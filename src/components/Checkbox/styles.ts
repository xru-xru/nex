import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

const CheckboxBaseStyled = styled.span`
  border-radius: 4px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const CheckboxEmpty = styled(CheckboxBaseStyled)`
  background: ${colorByKey('white')};
  border: 1px solid ${colorByKey('paleLilac')};
  box-shadow: 0 2px 4px -1px rgba(54, 55, 59, 0.11);

  &:hover {
  }
`;
export const CheckboxEmptyDark = styled(CheckboxBaseStyled)`
  background: ${colorByKey('darkGrey')};
  border: 1px solid ${colorByKey('paleLilac33')};
  box-shadow: 0 2px 4px -1px rgba(54, 55, 59, 0.11);

  &:hover {
  }
`;
export const CheckboxIndeterminate = styled(CheckboxBaseStyled)`
  background: ${colorByKey('greenTeal')};
  color: ${colorByKey('white')};
  font-size: 10px;
`;
export const CheckboxChecked = styled(CheckboxBaseStyled)`
  background: ${colorByKey('greenTeal')};
  border: 1px solid ${colorByKey('greenTeal')};
  color: ${colorByKey('white')};
  font-size: 10px;
`;
export const DisabledCheckboxChecked = styled(CheckboxBaseStyled)`
  background: ${colorByKey('paleLilac40')};
  border: 1px solid ${colorByKey('paleLilac40')};
  color: ${colorByKey('paleLilac66')};
  font-size: 10px;
`;
export const TempWrapperForHover = styled.span`
  &:disabled,
  &.disabled,
  &:hover {
    ${CheckboxEmpty} {
      box-shadow: none;
    }
  }

  &:hover {
    ${CheckboxEmpty} {
      border: 1px solid ${colorByKey('lightPeriwinkle')};
    }
  }
`;
