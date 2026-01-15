import { HTMLAttributes } from 'react';

import styled from 'styled-components';
import { nexyColors } from '../theme';

const pulseAnimation = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
`;

const StyledSkeleton = styled.div`
  ${pulseAnimation};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 0.375rem;
  background-color: ${nexyColors.neutral100};
`;

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

// React component using styled-components
function Skeleton({ ...props }: SkeletonProps) {
  return <StyledSkeleton {...props} />;
}

export { Skeleton };
