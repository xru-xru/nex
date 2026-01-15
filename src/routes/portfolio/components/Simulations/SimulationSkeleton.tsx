import React from 'react';

import styled from 'styled-components';

import { Skeleton } from '../../../../components-ui/Skeleton';
import { Container, MetricsContainer } from './styles';

const Header = styled.div`
  margin-top: 24px;
`;

const PanelContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

const SkeletonRowContainer = styled.div`
  padding: 15px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 0.3fr;
`;

export const SimulationSkeleton = () => {
  return (
    <Container style={{ gap: 46 }}>
      <Header>
        <Skeleton style={{ height: '24px', width: 420 }} />
      </Header>
      <Skeleton style={{ height: '114px', width: '100%' }} />
      <PanelContainer>
        <MetricsContainer style={{ flexDirection: 'column', maxWidth: 360 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton style={{ height: 19, width: 99 }} />
            <Skeleton style={{ height: 19, width: 154 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton style={{ height: 48, width: 360 }} />
            <Skeleton style={{ height: 48, width: 360 }} />
          </div>
          <Skeleton style={{ height: 32, width: 360 }} />
          <Skeleton style={{ height: 232, width: 360 }} />
        </MetricsContainer>
        <Skeleton style={{ height: 462, width: '100%' }} />
      </PanelContainer>
    </Container>
  );
};

export const SimulationTableSkeleton = () => {
  return (
    <Container style={{ gap: 46 }}>
      <Header style={{ marginTop: 32 }}>
        <Skeleton style={{ height: 32, width: '100%', marginBottom: 8 }} />
        {Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map((_, index) => (
          <SkeletonRowContainer key={index}>
            <Skeleton style={{ height: 26, width: 140 }} />
            <Skeleton style={{ height: 26, width: 185 }} />
            <Skeleton style={{ height: 26, width: 140 }} />
            <Skeleton style={{ height: 26, width: 185 }} />
            <Skeleton style={{ height: 26, width: 125 }} />
            <Skeleton style={{ height: 26, width: 125 }} />
            <Skeleton style={{ height: 26, width: 36 }} />
          </SkeletonRowContainer>
        ))}
      </Header>
    </Container>
  );
};
