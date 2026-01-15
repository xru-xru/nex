import React from 'react';

import styled from 'styled-components';

import { NexoyaOptimizedContentStatusType } from '../../../../types';

import { getMappedStatus } from '../../../../utils/contentStatus';

import Tooltip from '../../../../components/Tooltip';
import AvatarProvider from 'components/AvatarProvider';

import { AvatarWrapper, LinkStyled, SvgFireStyled, TagStyled } from '../../styles/OptimizationProposal';

import { TooltipInsight } from './TooltipInsight';
import { TooltipLimited } from './TooltipLimited';
import { IOptimizedContentStatusWithID } from './optimizationDetailsTableTypes';
import Typography from '../../../../components/Typography';

export const StatusCell = ({ status }: { status: IOptimizedContentStatusWithID }) => {
  const extractedStatus = getMappedStatus(status);

  const renderStatusBasedOnType = () => {
    if (status?.type === NexoyaOptimizedContentStatusType.Insight) {
      return <TooltipInsight extractedStatus={extractedStatus} status={status} />;
    } else if (
      status?.type === NexoyaOptimizedContentStatusType.Limited ||
      status?.type === NexoyaOptimizedContentStatusType.Skipped
    ) {
      return (
        <Tooltip
          variant="dark"
          placement="right-start"
          content={
            <TooltipLimited
              description={extractedStatus.description}
              title={extractedStatus.title}
              icon={extractedStatus.icon}
            />
          }
          popperProps={{ style: { zIndex: 3300 } }}
          style={{
            maxWidth: 500,
            wordBreak: 'break-word',
          }}
        >
          <span>
            <TagStyled className="whitespace-nowrap" bgColor={extractedStatus.color}>
              {extractedStatus.status}
            </TagStyled>
          </span>
        </Tooltip>
      );
    } else if (!status?.type) {
      return (
        <TagStyled className="whitespace-nowrap" bgColor={extractedStatus.color}>
          {extractedStatus.status}
        </TagStyled>
      );
    }
  };

  return (
    <div
      className="cellContainer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {renderStatusBasedOnType()}
    </div>
  );
};

export const AvatarCell = ({ providerId }) => {
  return (
    <AvatarWrapper className="cellContainer">
      <AvatarProvider providerId={providerId} size={28} style={{ position: 'static' }} />
    </AvatarWrapper>
  );
};

export const ContentCell = ({
  title,
  titleLink,
  isPerforming,
  className = '!font-medium',
}: {
  title: string;
  titleLink: string;
  isPerforming: boolean;
  className?: string;
}) => {
  return (
    <NameStyled className="cellContainer">
      <LinkStyled to={titleLink}>
        <Typography
          className={className}
          withTooltip
          popperProps={{ style: { zIndex: 3300, maxWidth: 'unset' } }}
          divStyleOverrides={{ position: 'static' }}
        >
          {title}
        </Typography>
      </LinkStyled>{' '}
      {isPerforming ? (
        <div style={{ fontSize: 20 }}>
          <SvgFireStyled />
        </div>
      ) : null}
    </NameStyled>
  );
};

const NameStyled = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
`;
