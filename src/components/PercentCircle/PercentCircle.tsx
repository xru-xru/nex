import clsx from 'clsx';
import styled, { keyframes } from 'styled-components';

import getColorVariant from '../../utils/getColorVariant';

import { colorByKey } from '../../theme/utils';

type Props = {
  percent: number;
  fixed?: boolean;
  icon?: any;
  showNumber?: boolean;
  className?: string;
  style?: Record<string, any>;
};
export const classes = {
  root: 'NEXYPercentCircle',
};
const moveDasharray = keyframes`
  0% {
    stroke-dasharray: 0 100;
  }
`;
const WrapStyled = styled.div`
  display: flex;
  position: relative;
`;

const BGPathStyled = styled.path`
  fill: none;
  stroke: #e6e9f5;
  stroke-width: 1.5;
`;
const PathStyled = styled.path<{
  readonly percent: number;
  readonly fixed: boolean;
  readonly hide?: boolean;
}>`
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke: ${(props) => getColorVariant(props.percent, props.fixed)(props)};
  animation: ${moveDasharray} 1s ease forwards;
  display: ${(props) => (props.hide ? 'none' : 'inherit')};
`;
const NumberStyled = styled.text`
  fill: ${colorByKey('darkGrey')};
  font-family: sans-serif;
  text-anchor: middle;
  transform: translateY(1px);
  letter-spacing: 0.2px;
`;

function PercentCircle({ percent: percentProp, showNumber = false, fixed = false, icon, className, ...rest }: Props) {
  const percent = percentProp || 0;
  const hasNoValue = percent === 0;
  return (
    <WrapStyled>
      <svg viewBox="0 0 36 36" className={clsx(className, classes.root)} {...rest}>
        <BGPathStyled
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <PathStyled
          hide={hasNoValue}
          strokeDasharray={`${percent} 100`}
          percent={percent}
          fixed={fixed}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        {showNumber ? (
          <NumberStyled x="18" y="20.35">
            {hasNoValue ? 'N/A' : `${Math.round(percent)}`}
          </NumberStyled>
        ) : null}
      </svg>
      {icon ? icon : null}
    </WrapStyled>
  );
}

export default PercentCircle;
