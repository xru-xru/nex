import React from 'react';

import { StringParam, useQueryParams } from 'use-query-params';

import {
  NexoyaOptimizedContentStatusPayload,
  NexoyaOptimizedContentStatusReason,
  NexoyaOptimizedContentStatusType,
} from '../types';

import Button from '../components/Button';
import SvgLowerPrioInfoCircle from '../components/icons/LowerPrioInfoCircle';
import { IOptimizedContentStatusWithID } from '../routes/portfolio/components/OptimizationProposal/optimizationDetailsTableTypes';

import { nexyColors } from '../theme';
import { useCurrencyStore } from 'store/currency-selection';

export interface IOptimizedStatusMapped {
  status: string;
  color: string;
  title?: string;
  description?: string | JSX.Element;
  icon?: JSX.Element;
}

export const getMappedStatus = (status: IOptimizedContentStatusWithID): IOptimizedStatusMapped => {
  switch (status?.type) {
    case NexoyaOptimizedContentStatusType.Limited:
      return getLimitedStatuses(status);
    case NexoyaOptimizedContentStatusType.Skipped:
      return getSkippedStatuses(status);
    case NexoyaOptimizedContentStatusType.Insight:
      return getInsightStatuses(status);
    default:
      return {
        status: 'Standard',
        color: '#88E7B7',
        title: null,
        description: null,
      };
  }
};

const mapContentStatusPayloadToPropertyString = (
  payload: NexoyaOptimizedContentStatusPayload[],
  property: keyof NexoyaOptimizedContentStatusPayload,
) => {
  return payload
    ?.map(
      (payloadItem) =>
        `${payloadItem?.funnelStep?.title ? payloadItem?.funnelStep?.title + ':' : ''} ${payloadItem?.[
          property
          // @ts-ignore
        ]?.toFixed(2)}`,
    )
    .join(', ');
};

const getLimitedStatuses = (status: IOptimizedContentStatusWithID) => {
  const { currency } = useCurrencyStore();

  switch (status.reason) {
    case NexoyaOptimizedContentStatusReason.ImpressionShare:
      return {
        status: 'Limited',
        color: '#FAB570',
        title: 'High impression share detected',
        icon: <SvgLowerPrioInfoCircle style={{ width: 15, height: 15 }} />,
        description: `Budget is limited due to high impression share of ${mapContentStatusPayloadToPropertyString(
          status?.payload,
          'impressionShare',
        )}%`,
      };
    case NexoyaOptimizedContentStatusReason.PlannedVsSpent:
      return {
        status: 'Limited',
        color: '#FAB570',
        title: 'Underspending detected',
        icon: <SvgLowerPrioInfoCircle style={{ width: 15, height: 15 }} />,
        description: `Budget is limited due to underspending in the last period (planned: ${status.payload[0]?.plannedBudget?.toFixed(
          2,
        )} ${currency}, spent: ${status.payload[0]?.spentBudget?.toFixed(2)} ${currency})`,
      };
    case NexoyaOptimizedContentStatusReason.BudgetBoundariesMinBudget:
      return {
        status: 'Limited',
        color: '#FAB570',
        title: 'Budget manually limited',
        description: `Budget is limited due to a user defined min. budget of ${mapContentStatusPayloadToPropertyString(
          status?.payload,
          'budgetMin',
        )} ${currency}`,
      };
    case NexoyaOptimizedContentStatusReason.BudgetBoundariesMaxBudget:
      return {
        status: 'Limited',
        color: '#FAB570',
        title: 'Budget manually limited',
        description: `Budget is limited due to a user defined max. budget of ${mapContentStatusPayloadToPropertyString(
          status?.payload,
          'budgetMax',
        )} ${currency}`,
      };
    default:
      return {
        status: 'Limited',
        color: '#FAB570',
        title: null,
        description: '',
      };
  }
};

const getSkippedStatuses = (status: IOptimizedContentStatusWithID) => {
  switch (status.reason) {
    case NexoyaOptimizedContentStatusReason.DisabledOptimzation:
      return {
        status: 'Manually Disabled',
        color: nexyColors.frenchGray,
        title: null,
        description: (
          <>
            User has disabled optimizations for this content.
            <br />
            This setting can be changed in the content screen.
          </>
        ),
      };
    case NexoyaOptimizedContentStatusReason.ContentNotServing:
      return {
        status: 'Content Paused',
        color: nexyColors.frenchGray,
        title: null,
        description:
          'Automatically disabled due to the content having the status “draft” “paused” “archived” or “ended” from its channel.',
      };
    case NexoyaOptimizedContentStatusReason.IsEnding:
      return {
        status: 'Content Ending',
        color: nexyColors.frenchGray,
        title: null,
        description: 'Automatically disabled due to content ending within the optimization timeframe.',
      };
    case NexoyaOptimizedContentStatusReason.Materiality:
      return {
        status: 'Low Materiality',
        color: nexyColors.frenchGray,
        title: null,
        description: 'Automatically disabled due to low data materiality.',
      };
    case NexoyaOptimizedContentStatusReason.SpendBelowThreshold:
      return {
        status: 'Spend too low',
        color: nexyColors.frenchGray,
        title: null,
        description: 'Automatically disabled due to spend below threshold.',
      };
    case NexoyaOptimizedContentStatusReason.NoData:
      return {
        status: 'No Content Data',
        color: nexyColors.frenchGray,
        title: null,
        description: 'Automatically disabled due to no available content data.',
      };
    // TODO: This status is manually added because the backend returns this status from the Budget proposal query, not with the content status query.
    // @ts-ignore
    case 'SKIP_FROM_PROPOSAL':
      return {
        status: 'Skipped',
        color: nexyColors.frenchGray,
        title: null,
        description: 'This content was skipped from budget application by the user.',
      };
    default:
      return {
        status: 'Skip',
        color: nexyColors.frenchGray,
        title: null,
        description: 'No data for why this was skipped',
      };
  }
};

const getInsightStatuses = (status: IOptimizedContentStatusWithID) => {
  switch (status.reason) {
    case NexoyaOptimizedContentStatusReason.Saturated:
      return {
        status: 'Insight',
        color: '#94DCF4',
        title: 'High saturation detected',
        icon: <SvgLowerPrioInfoCircle style={{ width: 15, height: 15 }} />,
        description: useSaturationInsightDescription(status),
      };
  }
};

const useSaturationInsightDescription = (status: IOptimizedContentStatusWithID) => {
  const [, setQueryParams] = useQueryParams({
    saturationDialogFs: StringParam,
  });

  const hasAnyFunnelStep = status?.payload?.some((payload) => payload?.funnelStep);

  return (
    <>
      {hasAnyFunnelStep ? (
        <span style={{ fontSize: 12 }}>Saturation score for funnel steps:</span>
      ) : (
        <span style={{ fontSize: 12 }}>No further details available</span>
      )}

      {status?.payload?.map((payload, idx) => (
        <div
          key={payload?.funnelStep?.funnelStepId + idx}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
            fontSize: 14,
            marginTop: 8,
          }}
        >
          {payload?.funnelStep ? (
            <>
              <span>{payload?.funnelStep?.title}:</span>{' '}
              <span style={{ fontWeight: 500 }}>
                {payload?.saturationScore ? (payload?.saturationScore * 100)?.toFixed(2) + '%' : 'N/A'}
              </span>
              {payload.saturationTangent ? (
                <Button
                  style={{ textDecoration: 'underline', color: '#E3E4E8' }}
                  onClick={() => {
                    setQueryParams({ saturationDialogFs: payload?.funnelStep?.funnelStepId + '_' + status.contentId });
                  }}
                >
                  See details
                </Button>
              ) : null}
            </>
          ) : null}
        </div>
      ))}
    </>
  );
};
