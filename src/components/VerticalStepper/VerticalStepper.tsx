import clsx from 'clsx';
import styled from 'styled-components';

import { VerticalStep } from './Step';
import Step from './Step';

type Props = {
  current: number;
  steps: VerticalStep[];
  withBar?: boolean;
  onStepClick?: (index: number, cb?: () => void) => void;
  className?: string;
};
export const classes = {
  root: 'NEXYVerticalStepper',
};
const WrapStyled = styled.div`
  position: absolute;
  width: inherit;
  padding-right: 48px;
  display: flex;
  flex-direction: column;
`;

function VerticalStepper({ current, steps, className, onStepClick, withBar = true, ...rest }: Props) {
  return (
    <WrapStyled className={clsx(className, classes.root)} data-cy="verticalStepper" {...rest}>
      {steps.map((step, i) => (
        <Step
          key={step.id}
          step={step}
          variant={i + 1 === current ? 'active' : i + 1 < current ? 'finished' : 'default'}
        />
      ))}
    </WrapStyled>
  );
}

export default VerticalStepper;
