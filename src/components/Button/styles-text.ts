import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import ButtonBase from '../ButtonBase';

const ButtonBaseStyled = styled(ButtonBase)`
  position: relative;

  &:disabled,
  &.disabled {
    cursor: default;
    pointer-events: none;
  }
`;
export const PrimaryText = styled(ButtonBaseStyled)`
  color: ${colorByKey('greenTeal')};

  &:hover,
  &.hover {
    color: ${colorByKey('greenTeal2')};
  }

  &:active,
  &.active {
    color: ${colorByKey('greenTeal3')};
  }

  &:disabled,
  &.disabled,
  &:disabled:hover,
  &:disabled:active,
  &.disabled:hover,
  &:disabled:active {
    opacity: 0.33;
    color: ${colorByKey('greenTeal')};
  }
`;
export const SecondaryText = styled(ButtonBaseStyled)`
  color: ${colorByKey('blueyGrey')};

  &:hover,
  &.hover {
    color: ${colorByKey('greenTeal4')};
  }

  &:active,
  &.active {
    color: ${colorByKey('greenTeal4')};
  }

  &:disabled,
  &.disabled,
  &:disabled:hover,
  &:disabled:active,
  &.disabled:hover,
  &.disabled:active {
    opacity: 0.5;
    color: ${colorByKey('blueGrey')};
  }
`;
export const TertiaryText = styled(ButtonBaseStyled)`
  color: ${colorByKey('cloudyBlue')};

  &:hover,
  &.hover {
    color: ${colorByKey('blueyGrey')};
  }

  &:active,
  &.active {
    color: ${colorByKey('blueGrey')};
  }

  &:disabled,
  &.disabled,
  &:disabled:hover,
  &:disabled:active,
  &.disabled:hover,
  &:disabled:active {
    opacity: 0.66;
    color: ${colorByKey('cloudyBlue')};
  }
`;
export const DarkText = styled(ButtonBaseStyled)`
  color: ${colorByKey('cloudyBlue')};

  &:hover,
  &.hover {
    color: ${colorByKey('paleLilac')};
  }

  &:active,
  &.active {
    color: ${colorByKey('paleLilac')};
  }

  &:disabled,
  &.disabled,
  &:disabled:hover,
  &:disabled:active,
  &.disabled:hover,
  &:disabled:active {
    opacity: 0.66;
    color: ${colorByKey('cloudyBlue')};
  }
`;
