import React, { cloneElement, ReactElement } from 'react';

import Slider from 'rc-slider';
import styled from 'styled-components';

import { shortenNumber } from '../../../../utils/number';

import Flex from '../../../../components/Flex';
import NumberValue from '../../../../components/NumberValue';
import Typography from '../../../../components/Typography';

import { nexyColors } from '../../../../theme';

interface RangeProps {
  low: number;
  high: number;
  lowChangePercent: number;
  highChangePercent: number;
  title: string;
  performance: number;
  suffix?: string;
}

const TypographyHeader = styled(Typography)`
  color: #e3e4e8;

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 18px */
  letter-spacing: 0.36px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MarkText = styled.span<{ above?: boolean }>`
  color: ${nexyColors.seasalt};

  /* Body/Small copy */
  font-size: 12px;
  font-weight: 500;
`;

const SliderStyled = styled(Slider)`
  margin-bottom: 32px;
  margin-top: 21px;

  .rc-slider-handle {
    opacity: 1;
    margin-top: -8px;
  }

  .rc-slider-mark-text:nth-child(1) {
    transform: translateX(0) !important;
  }

  .rc-slider-mark-text:nth-child(2) {
    transform: translate(-50%, -200%) !important;
    width: 100px;
  }

  .rc-slider-mark-text:last-child {
    left: unset !important;
    right: 0;

    transform: translateX(0) !important;
  }

  width: 100%;
  .rc-slider-dot {
    display: none;
  }
`;

export const UncertaintyRangeTooltipContent: React.FC<RangeProps> = ({
  low,
  high,
  lowChangePercent,
  highChangePercent,
  title,
  performance,
  suffix = '',
}) => {
  // Sorting low and high values
  const minValue = Math.min(low, high);
  const maxValue = Math.max(low, high);

  // Ensure performance is within the new min and max
  const safePerformance = Math.min(Math.max(performance, minValue), maxValue);

  const customRender = (handle: ReactElement) => {
    return cloneElement(
      handle,
      {
        style: {
          ...handle.props.style,
          visibility: 'hidden',
        },
      },
      <div style={{ visibility: 'visible', width: 48, height: 48 }}>
        <svg width="3" height="20" viewBox="0 0 3 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="1.4" x2="1.4" y2="20" stroke="white" strokeWidth="2.8" strokeDasharray="1 1" />
        </svg>
      </div>,
    );
  };

  return (
    <Container>
      <TypographyHeader>{title} prediction range</TypographyHeader>
      <SliderStyled
        styles={{
          rail: { borderRadius: 4, background: nexyColors.seasalt, opacity: 0.5 },
        }}
        handleRender={customRender}
        step={null}
        min={minValue}
        max={maxValue}
        defaultValue={safePerformance}
        marks={{
          [minValue]: (
            <MarkText>
              {shortenNumber(minValue)}
              {suffix}
            </MarkText>
          ),
          [safePerformance]: (
            <MarkText above>
              {shortenNumber(safePerformance)}
              {suffix}
            </MarkText>
          ),
          [maxValue]: (
            <MarkText>
              {shortenNumber(maxValue)}
              {suffix}
            </MarkText>
          ),
        }}
        included={false}
      />
      <div>
        <Flex style={{ justifyContent: 'space-between', color: nexyColors.secondaryText }}>
          <TypographyHeader>Lower range:</TypographyHeader>
          <NumberValue value={lowChangePercent} showChangePrefix symbol="%" />
        </Flex>
        <Flex style={{ justifyContent: 'space-between', color: nexyColors.secondaryText }}>
          <TypographyHeader>Upper range:</TypographyHeader>
          <NumberValue value={highChangePercent} showChangePrefix symbol="%" />
        </Flex>
      </div>
    </Container>
  );
};
