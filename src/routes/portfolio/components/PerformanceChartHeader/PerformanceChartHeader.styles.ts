import styled from 'styled-components';

import Button from '../../../../components/Button';
import ButtonIcon from '../../../../components/ButtonIcon';

export const ButtonStyled = styled(Button)`
  padding: 7.5px 15px;

  .NEXYButtonLabel {
    display: flex;
    align-items: center;
  }
`;

export const NameStyled = styled.div`
  width: 100%;
  text-align: left;
  margin: 0 18px 0 9px;
`;
export const FiltersContainerStyled = styled.div`
  display: flex;
  gap: 8px;
`;

export const ChipsContainerStyled = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterChipStyled = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  gap: 8px;
  border: 1px solid #c7c8d1;
  border-radius: 5px;
  color: #8a8c9e;
  font-size: 12px;
`;

export const StyledButtonIcon = styled(ButtonIcon)`
  padding: 4px;
  border-radius: 5px;
`;
