import React, { useMemo } from 'react';

import * as Styles from './styles/SpendProgressBar';

type Props = {
  percentage: number;
};

export default function SpendProgressBar({ percentage }: Props) {
  const status = useMemo(() => {
    if (percentage > 0) return 'overspend';
    if (percentage < 0) return 'underspend';

    return '';
  }, [percentage]);
  const title = useMemo(() => `${Math.abs(percentage)}% ${status}`, [percentage, status]);
  return (
    <>
      <Styles.Title>{title}</Styles.Title>
      <Styles.Wrapper>
        <Styles.BarWrapper>
          <Styles.Bar percentage={percentage / 2}></Styles.Bar>
        </Styles.BarWrapper>
        <Styles.Signs>
          <span>-</span>
          <span>+</span>
        </Styles.Signs>
      </Styles.Wrapper>
    </>
  );
}
