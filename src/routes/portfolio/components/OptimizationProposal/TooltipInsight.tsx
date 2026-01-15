import React, { useEffect, useRef, useState } from 'react';

import { StringParam, useQueryParams } from 'use-query-params';

import { NexoyaOptimizedContentStatusPayload } from '../../../../types';

import { IOptimizedStatusMapped } from '../../../../utils/contentStatus';

import { HighSaturationOverview } from '../../../../components/Charts/saturation/HighSaturationOverview';
import Dialog, { useDialogState } from '../../../../components/Dialog';
import { useMenu } from '../../../../components/Menu';
import Panel from '../../../../components/Panel';

import {
  StyledTooltipRow,
  TagStyled,
  TooltipLimitedContainer,
  TooltipLimitedTextContainer,
  TooltipLimitedTitle,
} from '../../styles/OptimizationProposal';

import { nexyColors } from '../../../../theme';
import { IOptimizedContentStatusWithID } from './optimizationDetailsTableTypes';

const saturationDialogControlRef = { current: null };

export function TooltipInsight({
  extractedStatus,
  status,
}: {
  extractedStatus: IOptimizedStatusMapped;
  status: IOptimizedContentStatusWithID;
}) {
  const [queryParams, setQueryParams] = useQueryParams({
    saturationDialogFs: StringParam,
  });
  const [selectedFunnelStepPayload, setSelectedFunnelStepPayload] = useState<NexoyaOptimizedContentStatusPayload>();
  const {
    isOpen: isSaturationDialogOpen,
    openDialog: openSaturationDialog,
    closeDialog: closeSaturationDialog,
  } = useDialogState();
  const { anchorEl, open, closeMenu, openMenu } = useMenu();
  const closeDelayRef = useRef<number | null>(null);

  const handleCloseWithDelay = () => {
    if (closeDelayRef.current !== null) {
      clearTimeout(closeDelayRef.current);
    }
    closeDelayRef.current = window.setTimeout(() => {
      closeMenu();
    }, 100); // Delay close to allow the user to click on "See details"
  };

  const handleMouseEnter = () => {
    if (closeDelayRef.current !== null) {
      clearTimeout(closeDelayRef.current);
      closeDelayRef.current = null;
    }
    openMenu();
  };

  useEffect(() => {
    return () => {
      if (closeDelayRef.current !== null) {
        clearTimeout(closeDelayRef.current);
      }
      saturationDialogControlRef.current = null; // Ensure reference is cleared on unmount
    };
  }, []);

  useEffect(() => {
    setSelectedFunnelStepPayload(
      status?.payload.find(
        (payload) => payload.funnelStep?.funnelStepId + '_' + status.contentId === queryParams.saturationDialogFs
      )
    );
  }, [queryParams.saturationDialogFs, status]);

  useEffect(() => {
    if (selectedFunnelStepPayload && !isSaturationDialogOpen) {
      // Ensure only the first component to claim responsibility can open the dialog
      if (!saturationDialogControlRef.current) {
        closeMenu();
        saturationDialogControlRef.current = true;
        openSaturationDialog();

        // Reset when the dialog closes
        return () => {
          saturationDialogControlRef.current = null;
        };
      }
    }
  }, [selectedFunnelStepPayload, isSaturationDialogOpen, openSaturationDialog, closeMenu]);

  return (
    <>
      <Panel
        color="dark"
        onMouseLeave={handleCloseWithDelay}
        onMouseEnter={handleMouseEnter}
        open={open}
        variant="dark"
        anchorEl={anchorEl.current}
        placement="bottom-start"
        style={{ maxHeight: 250 }}
        popperProps={{ enableScheduleUpdate: true, style: { zIndex: 1305 } }}
      >
        <TooltipLimitedContainer style={{ color: 'white', padding: 12 }}>
          <TooltipLimitedTextContainer>
            {extractedStatus?.title ? (
              <TooltipLimitedTitle style={{ borderBottom: `1px solid ${nexyColors.charcoalGrey}`, marginBottom: 12 }}>
                {extractedStatus?.title} {extractedStatus?.icon}
              </TooltipLimitedTitle>
            ) : null}
            <StyledTooltipRow style={{ flexDirection: 'column', alignItems: 'flex-start', fontSize: 12 }}>
              <span>{extractedStatus?.description}</span>
            </StyledTooltipRow>
          </TooltipLimitedTextContainer>
        </TooltipLimitedContainer>
      </Panel>
      <TagStyled
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleCloseWithDelay}
        ref={anchorEl}
        bgColor={extractedStatus.color}
      >
        {extractedStatus.status}
      </TagStyled>
      {isSaturationDialogOpen ? (
        <Dialog
          paperProps={{ style: { zIndex: 99999 } }}
          isOpen={isSaturationDialogOpen}
          hideCloseButton
          onClose={() => {
            closeSaturationDialog();
            setQueryParams({ saturationDialogFs: undefined });
            setSelectedFunnelStepPayload(null);
          }}
        >
          <HighSaturationOverview
            funnelStepTitle={selectedFunnelStepPayload?.funnelStep?.title}
            saturationTangent={selectedFunnelStepPayload?.saturationTangent}
            budgetRevenueResponseCurve={selectedFunnelStepPayload?.budgetRevenueResponseCurve}
            saturationProfitPerUnit={selectedFunnelStepPayload?.saturationProfitPerUnit}
            saturationPoint={selectedFunnelStepPayload?.saturationPoint}
            saturationScore={(selectedFunnelStepPayload?.saturationScore * 100).toFixed(2) + '%' || 'N/A'}
          />
        </Dialog>
      ) : null}
    </>
  );
}
