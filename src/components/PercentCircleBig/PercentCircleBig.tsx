import React from 'react';

import clsx from 'clsx';
import styled, { keyframes } from 'styled-components';

import getColorVariant from '../../utils/getColorVariant';

import { colorByKey } from '../../theme/utils';

import Typography from '../Typography';

type Props = {
  label: string;
  percent: number;
  className?: string;
  size?: number;
  circlePercent?: number;
  keepAnimating?: boolean;
  hidePercent?: boolean;
};
export const classes = {
  root: 'NEXYPercentCircleBig',
};
const moveDasharray = keyframes`
  0% {
    stroke-dasharray: 0 100;
  }
`;
const BGPathStyled = styled.path`
  fill: none;
  stroke: #e6e9f5;
  stroke-width: 1;
`;

interface PathStyledPercentCircleBigProps {
  percent: number;
  hide: boolean;
  keepAnimating: boolean;
}
const PathStyled = styled.path<PathStyledPercentCircleBigProps>`
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke: ${(props) => getColorVariant(props.percent)(props)};
  animation: ${moveDasharray} 1s ease ${({ keepAnimating }) => (keepAnimating ? 'infinite' : 'forwards')};
  display: ${(props) => (props.hide ? 'none' : 'inherit')};
`;

interface WrapStyledPercentCircleBigProps {
  size: number;
}
const WrapStyled = styled.div<WrapStyledPercentCircleBigProps>`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  min-width: ${({ size }) => `${size}px`};

  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -54%);
    width: ${({ size }) => `${size}px`};
    height: ${({ size }) => `${size}px`};
  }

  & > .NEXYTypography {
    &:nth-child(2) {
      font-size: 13px;
      letter-spacing: 0.8; /* TODO: this whole element should be a unique component config */
      color: ${colorByKey('blueyGrey')};
    }

    &:nth-child(3) {
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.2px;
      color: ${colorByKey('darkGrey')};
    }
  }
`;
const PercentCircleBig = React.forwardRef<Props, any>(function PercentCircle(props, ref) {
  const {
    percent: percentProp,
    circlePercent: circlePercentProp,
    hidePercent,
    label,
    size = 100,
    className,
    keepAnimating = false,
    ...rest
  } = props;
  const percent = percentProp || 0;
  const hasNoValue = percent === 0;
  const circlePercent = circlePercentProp || percent;
  return (
    <WrapStyled className={clsx(className, classes.root)} size={size} ref={ref} {...rest}>
      <svg viewBox="0 0 36 36">
        <BGPathStyled
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <PathStyled
          hide={circlePercent === 0 && hasNoValue}
          keepAnimating={keepAnimating}
          strokeDasharray={`${circlePercent} 100`}
          percent={percent} // makes sense maybe to count it based on circlePercent prop?
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <Typography>{label}</Typography>
      <Typography>{hasNoValue || hidePercent ? 'N/A' : `${Math.round(percent)}%`}</Typography>
    </WrapStyled>
  );
});
export default PercentCircleBig;
