import { darken } from 'polished';
import styled from 'styled-components';

type Props = {
  // percentage: number,
  start: number | Date | null;
  end: number | Date | null;
  size?: string;
  theme?: 'default' | 'success' | 'danger';
  wrapBG?: string;
  tickSize?: string;
  bgColor?: string;
  lowerIsBetter?: boolean;
  averageBy?: number | null;
};
const barTheme = {
  success: '#0ec76a',
  danger: '#ed3434',
  warning: '#fad311',
  default: '#888a94',
};
const WrapStyled = styled.div<{
  readonly wrapBG: string;
  readonly size: string;
}>`
  background: ${({ wrapBG }) => wrapBG};
  border-radius: 25px;
  width: 100%;
  height: ${({ size }) => size};
`;
const FillStyled = styled.div<{
  readonly bgColor?: string;
  readonly size: string;
  readonly widthPercentage: number;
  readonly theme: string;
}>`
  border-radius: 25px;
  position: relative;
  background: ${({ theme, bgColor }) => {
    if (bgColor) {
      return bgColor;
    }

    return barTheme[theme];
  }};
  height: ${({ size }) => size};
  width: ${({ widthPercentage }) => `${widthPercentage}%`};
  transition: width 0.2s;
  overflow: hidden;
`;
const FillTagStyled = styled.span<{
  readonly tickSize: string;
  readonly size: string;
  readonly bgColor?: string;
  readonly theme: string;
}>`
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

const ProgressbarNew = ({
  lowerIsBetter = false,
  start,
  end,
  size = '7px',
  tickSize = '10px',
  bgColor,
  wrapBG = '#F2F6F8',
  theme,
  averageBy,
}: Props) => {
  // TODO: Make this available for Dates as well :)
  const cleanStart = start || 0;
  const cleanEnd = end || 0;
  let percentage = Math.ceil(
    //@ts-expect-error
    (lowerIsBetter ? cleanEnd / cleanStart : cleanStart / cleanEnd) * 100
  );

  if (typeof averageBy === 'number') {
    percentage = Math.ceil(percentage / averageBy);
  }

  const cleanPercentage = isNaN(percentage) || !isFinite(percentage) ? 0 : percentage >= 100 ? 100 : percentage;
  const nextBgColor = bgColor;
  let nextTheme = percentage >= 100 ? 'success' : 'default';

  // This is used in budget progressbar with custom coloring
  if (theme) {
    nextTheme = theme;
  }

  return (
    <WrapStyled size={size} wrapBG={wrapBG}>
      <FillStyled widthPercentage={cleanPercentage} size={size} theme={nextTheme} bgColor={nextBgColor}>
        <FillTagStyled tickSize={tickSize} size={size} theme={nextTheme} bgColor={nextBgColor} />
      </FillStyled>
    </WrapStyled>
  );
};

export default ProgressbarNew;
