import styled, { css } from 'styled-components';

import { FUNNEL_CONFIG, FUNNEL_STEP_WIDTHS_PERCENTAGES } from '../components/Funnel/utils/funnel';

import LoadingPlaceholder from '../../../components/LoadingPlaceholder/LoadingPlaceholder';
import ButtonBase from 'components/ButtonBase';
import { HeaderBrick } from 'components/HeaderBrick';
import SvgDollar from 'components/icons/Dollar';

import { colorByKey } from 'theme/utils';

export const NavTabStyled = styled(ButtonBase)`
  padding: 10px 20px;
  margin-bottom: -1px;
  color: ${({ isActive }) => (isActive ? colorByKey('neutral800') : colorByKey('neutral300'))};
  transition: color 0.175s;
  display: inline-block;

  font-size: 18px;
  letter-spacing: 0.8px;

  &:first-letter {
    text-transform: uppercase;
  }

  border-bottom: ${({ theme, isActive }) => (isActive ? `2px solid ${theme.colors.primary}` : 'none')};

  &:hover {
    color: ${({ isActive }) => (isActive ? 'inherit' : colorByKey('blueGrey'))};
  }

  ${({ size }) => {
    if (size === 'small') {
      return css`
        padding: 8px 16px;
        font-size: 12px;
        letter-spacing: 0.12px;
      `;
    } else if (size === 'medium') {
      return css`
        padding: 8px 20px;
        font-size: 16px;
        letter-spacing: 0.14px;
      `;
    } else if (size === 'base') {
      return css`
        padding: 16px 16px 12px 16px;
        font-size: 14px;
        letter-spacing: 0.14px;
      `;
    }
  }}
`;

export const HeaderBrickStyled = styled(HeaderBrick)`
  min-width: 150px;
  flex-grow: 1;

  .NEXYTypography:not(.NEXYH4) {
    font-size: 11px;
    font-weight: 600;
    line-height: 145%;
    letter-spacing: 0.5px;
    opacity: 0.5;
    color: ${colorByKey('paleSlateGray')};
  }

  .NEXYTypography:is(.NEXYH4) {
    font-size: 14px;
    color: #2a2a32;

    font-style: normal;
    font-weight: 500;
    letter-spacing: 0.224px;
  }
`;

export const SvgDollarStyled = styled(SvgDollar)`
  position: absolute;
  left: 8px;
  top: 8px;
  font-size: 16px;
`;

export const TimeSpanWrap = styled.div<{ lastDivHeight: string; bottomBorderRadius: number }>`
  display: flex;
  align-items: center;
  margin-left: auto;

  &:last-child {
    div {
      height: ${({ lastDivHeight }) => lastDivHeight};
      margin-left: 0;
    }

    div .NEXYButtonAsync,
    .NEXYButton > .NEXYButtonAsync,
    .NEXYButton {
      border-bottom-left-radius: ${({ bottomBorderRadius }) => bottomBorderRadius}px;
      border-bottom-right-radius: ${({ bottomBorderRadius }) => bottomBorderRadius}px;
      height: 100%;
    }
  }
`;

export const SwitchWrapper = styled.div`
  position: absolute;
  right: 0;
`;

export const LoadingPlaceholderChart = styled(LoadingPlaceholder)`
  width: 1100px;
  height: 555px;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: space-between;
`;

export const LoadingPlaceholderWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
export const LoadingPlaceholderCardStyled = styled(LoadingPlaceholder)`
  min-width: 300px;
  height: 98px;
`;

export const LoadingPlaceholderFunnelWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6px;
`;

export const LoadingPlaceholderFunnelStyled = styled(LoadingPlaceholder)`
  height: 110px;
  display: flex;
  &:nth-child(1) {
    width: ${FUNNEL_CONFIG.width * FUNNEL_STEP_WIDTHS_PERCENTAGES[0]}px;
    transform: perspective(11em) rotateX(-30deg);
  }

  &:nth-child(2) {
    width: ${FUNNEL_CONFIG.width * FUNNEL_STEP_WIDTHS_PERCENTAGES[1]}px;
    transform: perspective(11em) rotateX(-30deg);
  }

  &:nth-child(3) {
    width: ${FUNNEL_CONFIG.width * FUNNEL_STEP_WIDTHS_PERCENTAGES[2]}px;
    transform: perspective(11em) rotateX(-30deg);
  }
  &:nth-child(4) {
    width: ${FUNNEL_CONFIG.width * FUNNEL_STEP_WIDTHS_PERCENTAGES[3]}px;
    transform: perspective(11em) rotateX(-30deg);
  }

  &:nth-child(5) {
    width: ${FUNNEL_CONFIG.width * FUNNEL_STEP_WIDTHS_PERCENTAGES[4]}px;
    transform: perspective(11em) rotateX(-30deg);
  }
`;

export const BricksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 35px;
  margin-top: 32px;
`;
