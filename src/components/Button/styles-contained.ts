import styled from 'styled-components';

import { colorByKey, nexyColors } from '../../theme/utils';

import ButtonBase from '../ButtonBase';

function withShadow({ flat }) {
  if (flat) return '';
  return ', 0 2px 4px -1px rgba(7, 97, 52, 0.24)';
}

function borderShadow(shape, colorName) {
  return (props) => `${shape} ${nexyColors(props, colorName)}${withShadow(props)}`;
}

const ButtonBaseStyled = styled(ButtonBase)`
  position: relative;
  border-radius: 4px;

  &:disabled,
  &.disabled {
    cursor: default;
    pointer-events: none;
  }
`;
export const PrimaryContained = styled(ButtonBaseStyled)`
  color: ${colorByKey('white')};
  background-color: ${colorByKey('greenTeal')};
  box-shadow: ${borderShadow('0 0 0 1px', 'greenTeal')};

  &:hover,
  &.hover {
    box-shadow: 0 0 0 1px ${colorByKey('greenTeal2')};
    background-color: ${colorByKey('greenTeal2')};
  }

  &:active,
  &.active {
    box-shadow: 0 0 0 1px ${colorByKey('greenTeal3')};
    background-color: ${colorByKey('greenTeal3')};
  }

  &:disabled,
  &.disabled,
  &:disabled:hover,
  &:disabled:active,
  &.disabled:hover,
  &:disabled:active {
    opacity: 0.33;
    box-shadow: 0 0 0 1px ${colorByKey('greenTeal')};
    background-color: ${colorByKey('greenTeal')};
  }
`;
export const SecondaryContained = styled(ButtonBaseStyled)`
  color: ${colorByKey('blueyGrey')};
  background-color: ${colorByKey('white')};
  box-shadow: ${borderShadow('0 0 0 1px', 'paleLilac66')};

  &:hover,
  &.hover {
    color: ${colorByKey('greenTeal4')};
    box-shadow: 0 0 0 1px ${colorByKey('paleLilac')};
  }

  &:active,
  &.active {
    box-shadow: 0 0 0 2px ${colorByKey('greenTeal')};
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
    box-shadow: 0 0 0 1px ${colorByKey('paleLilac66')};
    background-color: ${colorByKey('white')};
  }
`;
export const TertiaryContained = styled(ButtonBaseStyled)`
  color: ${colorByKey('cloudyBlue')};
  background-color: ${colorByKey('paleLilac25')};

  &:hover,
  &.hover {
    color: ${colorByKey('blueyGrey')};
    background-color: ${colorByKey('paleLilac40')};
  }

  &:active,
  &.active {
    color: ${colorByKey('blueGrey')};
    background-color: ${colorByKey('paleLilac50')};
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
export const DarkContained = styled(ButtonBaseStyled)`
  color: ${colorByKey('cloudyBlue')};
  background-color: ${colorByKey('darkGrey')};

  &:hover,
  &.hover {
    color: ${colorByKey('paleLilac')};
    background-color: ${colorByKey('paleLilac07')};
  }

  &:active,
  &.active {
    color: ${colorByKey('paleLilac')};
    background-color: ${colorByKey('paleLilac10')};
  }

  &:disabled,
  &.disabled,
  &:disabled:hover,
  &:disabled:active,
  &.disabled:hover,
  &:disabled:active {
    opacity: 0.66;
    color: ${colorByKey('cloudyBlue')};
    background-color: ${colorByKey('darkGrey')};
  }
`;
export const DangerContained = styled(ButtonBaseStyled)`
  color: ${colorByKey('white')};
  background-color: ${colorByKey('orangeyRed')};
  box-shadow: ${borderShadow('0 0 0 1px', 'orangeyRed')};

  &:hover,
  &.hover {
    box-shadow: 0 0 0 1px ${colorByKey('orangeyRed2')};
    background-color: ${colorByKey('orangeyRed2')};
  }

  &:active,
  &.active {
    box-shadow: 0 0 0 1px ${colorByKey('orangeyRed3')};
    background-color: ${colorByKey('orangeyRed3')};
  }

  &:disabled,
  &.disabled,
  &:disabled:hover,
  &:disabled:active,
  &.disabled:hover,
  &:disabled:active {
    opacity: 0.25;
    box-shadow: 0 0 0 1px ${colorByKey('orangeyRed')};
    background-color: ${colorByKey('orangeyRed')};
  }
`;
