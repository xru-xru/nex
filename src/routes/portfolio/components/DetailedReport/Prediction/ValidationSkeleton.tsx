import React from 'react';

import { Skeleton } from 'components-ui/Skeleton';
import styled from 'styled-components';

const Header = styled.div`
  margin-top: 24px;
`;

const FunnelContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  margin-top: 24px;
`;

export const ValidationSkeleton = () => {
  return (
    <div style={{ gap: 46 }}>
      <Header>
        <Skeleton style={{ height: '24px', width: 420 }} />
      </Header>
      <FunnelContainer>
        <div style={{ flexDirection: 'column' }}>
          <Skeleton style={{ height: 180, width: 456, marginBottom: 12 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <Skeleton style={{ height: 100, width: 300 }} />
                <Skeleton style={{ height: 100, width: 148 }} />
              </div>
            ))}
          </div>
        </div>
        <Skeleton style={{ height: 580, width: '100%' }} />
      </FunnelContainer>
    </div>
  );
};
