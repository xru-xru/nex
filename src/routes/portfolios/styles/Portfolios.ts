import styled from 'styled-components';

import ButtonBase from 'components/ButtonBase';

import { colorByKey } from 'theme/utils';

export const LoadingWrapStyled = styled.div`
  & > div {
    height: 52px;
    margin-bottom: 12px;

    &:nth-child(1) {
      opacity: 1;
    }
    &:nth-child(2) {
      opacity: 0.75;
    }
    &:nth-child(3) {
      opacity: 0.5;
    }
    &:nth-child(4) {
      opacity: 0.25;
    }
  }
`;
export const TabsNavWrapperStyled = styled.div`
  display: flex;
  margin-bottom: 24px;
  justify-content: space-between;
`;
export const NavTabStyled = styled(ButtonBase)`
  padding: 16px 16px 12px;
  margin-bottom: -1px;
  color: ${({ isActive }) => (isActive ? colorByKey('darkGreyTwo') : colorByKey('cloudyBlue'))};
  transition: color 0.175s;
  display: inline-block;

  font-size: 16px;
  letter-spacing: 0.8;

  &:first-letter {
    text-transform: uppercase;
  }

  border-bottom: ${({ theme, isActive }) => (isActive ? `2px solid ${theme.colors.primary}` : 'none')};

  &:hover {
    color: ${({ isActive }) => (isActive ? 'inherit' : colorByKey('blueGrey'))};
  }
`;

export const LoadingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
