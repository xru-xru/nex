import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import ButtonBase from '../ButtonBase';

export const ButtonBaseStyled = styled(ButtonBase)`
  text-align: center;
  flex: 0 0 auto;
  border-radius: 50%;
  padding: 9px;
  overflow: visible;
`;
export const ButtonLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
export const PrimaryText = styled(ButtonBaseStyled)`
  color: ${colorByKey('greenTeal')};

  &:hover {
    color: ${colorByKey('white')};
    background: ${colorByKey('greeTeal')};
  }

  &:active,
  &.active {
    background: ${colorByKey('greeTeal')};
  }
`;
export const SecondaryText = styled(ButtonBaseStyled)`
  color: ${colorByKey('battleshipGrey')};

  &:hover {
    color: ${colorByKey('battleshipGrey')};
    background: ${colorByKey('paleLilac50')};
  }

  &:active,
  &.active {
    background: ${colorByKey('paleLilac66')};
  }
`;
export const DangerText = styled(ButtonBaseStyled)`
  color: ${colorByKey('orangeyRed')};

  &:hover {
    color: ${colorByKey('white')};
    background: ${colorByKey('orangeyRed')};
  }

  &:active,
  &.active {
    background: ${colorByKey('orangeyRed')};
  }
`;
