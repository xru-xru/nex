import clsx from 'clsx';
import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import Typography from '../Typography';
import SvgCheckCircle from '../icons/CheckCircle';

export type VerticalStep = {
  id: string;
  name: string;
  description: string;
};
type Variant = 'finished' | 'active' | 'default';
type Props = {
  step: VerticalStep;
  variant?: Variant;
  className?: string;
  onClick?: (index: number, cb?: () => void) => void;
};
export const classes = {
  root: 'NEXYVerticalStep',
  default: 'default',
  active: 'active',
  finished: 'finished',
};
const WrapStyled = styled.div`
  position: relative;
  padding: 22px 0 22px 24px;
  border-left: 4px solid #e6e7f1;
  margin-bottom: 8px;

  .NEXYH5 {
    color: ${colorByKey('darkGrey')};
    margin-bottom: 4px;
  }

  &.default {
    transition: 0.5s linear all;
    opacity: 0.5;
  }

  &.active {
    transition: 0.5s linear all;
  }

  &.finished {
    transition: 0.5s linear all;
    .NEXYH5 {
      color: ${colorByKey('greenTeal')};
    }
    border-left-color: ${colorByKey('greenTeal')};
  }
`;
const IconWrapperStyled = styled.span`
  display: inline-block;
  margin-right: 10px;
`;

function Step({ step, variant = 'default', className, onClick, ...rest }: Props) {
  return (
    <WrapStyled
      className={clsx(className, classes.root, {
        [classes.active]: variant === 'active',
        [classes.default]: variant === 'default',
        [classes.finished]: variant === 'finished',
      })}
      {...rest}
    >
      <Typography component="h5" variant="h5" withEllipsis={false}>
        {variant === 'finished' && (
          <IconWrapperStyled>
            <SvgCheckCircle />
          </IconWrapperStyled>
        )}
        {step.name}
      </Typography>
      <Typography variant="paragraph" withEllipsis={false}>
        {step.description}
      </Typography>
    </WrapStyled>
  );
}

export default Step;
