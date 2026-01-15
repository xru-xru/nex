import clsx from 'clsx';
import styled from 'styled-components';

import Bar from './Bar';
import Step from './Step';

type Props = {
  current: number;
  steps: number;
  withBar?: boolean;
  onStepClick?: (index: number, cb?: () => void) => void;
  className?: string;
};
export const classes = {
  root: 'NEXYStepper',
};
const WrapStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

function Stepper({ current, steps, className, onStepClick, withBar = true, ...rest }: Props) {
  // Comment:
  // we want to make sure the number corresponds to the
  // actual step index. Thus, we need to prompt the user if they
  // use array index instead.
  if (import.meta.env.MODE === 'development') {
    if (current < 1) {
      throw new Error('Stepper only accepts values starting from 1.');
    }
  }

  return (
    <WrapStyled className={clsx(className, classes.root)} {...rest}>
      {withBar ? <Bar percentage={Math.round(((current - 1) / (steps - 1)) * 100)} /> : null}
      {Array(steps)
        .fill(0)
        .map((_, i) => {
          const stepNum: number = i + 1;
          return (
            <Step
              key={stepNum}
              onClick={() => {
                if (onStepClick) onStepClick(stepNum);
              }}
              variant={stepNum === current ? 'active' : stepNum < current ? 'finished' : 'default'}
            />
          );
        })}
    </WrapStyled>
  );
}

export default Stepper;
