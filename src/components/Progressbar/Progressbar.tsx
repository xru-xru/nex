import { darken } from 'polished';
import styled from 'styled-components';

import '../../theme/theme';

type Props = {
  percentage: number;
  start?: (number | Date) | null | undefined;
  end?: (number | Date) | null | undefined;
  size?: string;
  theme?: 'default' | 'success' | 'danger';
  wrapBG?: string;
  tickSize?: string;
  bgColor?: string;
  lowerIsBetter?: boolean;
};
const barTheme = {
  success: '#0ec76a',
  danger: '#ed3434',
  warning: '#fad311',
  default: '#888a94',
};

interface WrapStyledProgressbarProps {
  wrapBG: string;
  size: string;
}
const WrapStyled = styled.div<WrapStyledProgressbarProps>`
  background: ${({ wrapBG }) => wrapBG};
  border-radius: 25px;
  width: 100%;
  height: ${({ size }) => size};
`;

interface FillStyledProgressbarProps {
  bgColor: string;
  size: string;
  widthPercentage: number;
}
const FillStyled = styled.div<FillStyledProgressbarProps>`
  border-radius: 25px;
  position: relative;
  background: ${({ theme, bgColor }) => {
    if (bgColor) return bgColor;
    return barTheme[theme];
  }};
  height: ${({ size }) => size};
  width: ${({ widthPercentage }) => `${widthPercentage}%`};
  transition: width 0.2s;
  overflow: hidden;
`;

interface FillTagStyledProgressbarProps {
  tickSize: string;
  size: string;
  bgColor: string;
}
const FillTagStyled = styled.span<FillTagStyledProgressbarProps>`
  position: absolute;
  right: 0;
  border-radius: 25px;
  display: block;
  width: 5% !important;
  min-width: ${({ tickSize }) => tickSize};
  height: ${({ size }) => size};
  background: ${({ theme, bgColor }) => {
    if (bgColor) return darken(0.1, bgColor);
    return darken(0.1, barTheme[theme]);
  }};
`;
export default function Progressbar({
  percentage = 0,
  theme = 'default',
  size = '7px',
  wrapBG = '#F2F6F8',
  tickSize = '10px',
  bgColor,
  lowerIsBetter = false,
}: Props) {
  const cleanPercentage = isNaN(percentage) ? 0 : percentage >= 100 ? 100 : percentage;
  let nextBgColor = bgColor;

  if (lowerIsBetter) {
    const difference = cleanPercentage - 100;

    if (difference <= 20) {
      nextBgColor = barTheme.danger;
    } else if (difference <= 60) {
      nextBgColor = barTheme.warning;
    } else {
      nextBgColor = barTheme.success;
    }
  }

  return (
    <WrapStyled size={size} wrapBG={wrapBG}>
      <FillStyled widthPercentage={cleanPercentage} size={size} theme={theme} bgColor={nextBgColor}>
        <FillTagStyled tickSize={tickSize} size={size} theme={theme} bgColor={nextBgColor} />
      </FillStyled>
    </WrapStyled>
  );
}
