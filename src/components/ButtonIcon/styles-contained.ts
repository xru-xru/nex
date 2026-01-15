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
export const PrimaryContained = styled(ButtonBaseStyled)`
  color: ${colorByKey('white')};
  background: ${colorByKey('greenTeal')};

  &:hover {
    background: ${colorByKey('greenTeal2')};
  }

  &:active,
  &.active {
    background: ${colorByKey('greenTeal3')};
  }
`;
export const SecondaryContained = styled(ButtonBaseStyled)`
  color: ${colorByKey('battleshipGrey')};
  background: ${colorByKey('paleLilac50')};

  &:hover {
    color: ${colorByKey('battleshipGrey')};
    background: ${colorByKey('paleLilac66')};
  }

  &:active,
  &.active {
    background: ${colorByKey('paleLilac')};
  }
`;
export const DangerContained = styled(ButtonBaseStyled)`
  color: ${colorByKey('cloudyBlue')};
  background-color: ${colorByKey('paleLilac25')};

  &:hover {
    color: ${colorByKey('white')};
    background: ${colorByKey('orangeyRed')};
  }

  &:active,
  &.active {
    background: ${colorByKey('orangeyRed')};
  }

  &:disabled,
  &.disabled,
  &:disabled:hover,
  &:disabled:active,
  &.disabled:hover,
  &:disabled:active {
    opacity: 0.66;
    color: ${colorByKey('cloudyBlue')};
    background-color: ${colorByKey('paleLilac25')};
  }
`;
