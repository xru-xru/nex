import React, { FC } from 'react';
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params';
import { NexoyaFunnelStepPerformance } from '../../../../../types';
import { usePortfolio } from '../../../../../context/PortfolioProvider';

import {
  DATE_COMPARISON_FUNNEL_WIDTH,
  DEFAULT_FUNNEL_WIDTH,
  FUNNEL_CONFIG,
  getFunnelFlexPercentages,
  renderTooltipContent,
} from '../utils/funnel';

import FormattedCurrency from '../../../../../components/FormattedCurrency';
import Tooltip from '../../../../../components/Tooltip';

import { FunnelData } from '../MultiSeriesFunnel';
import {
  AddSpendContainerStyled,
  AdLabelContainerStyled,
  AdSpendSegmentStyled,
  FunnelChannelStyled,
  LabelTitleStyled,
  NumbersWrapperStyled,
  PotentialWrapStyled,
  ValueTitleStyled,
} from '../styles';
import { NumberValueStyled } from '../../../../content/styles/ContentPageTableRow';
import { floor, round } from 'lodash';
import { useLabels } from '../../../../../context/LabelsProvider';
import { useImpactGroups } from '../../../../../context/ImpactGroupsProvider';

interface Props {
  adSpendList: number[];
  spendAmount: number;
  funnelData: FunnelData;
  costFunnelStep: NexoyaFunnelStepPerformance;
  renderFunnelBar?: boolean;
  renderDifference?: boolean;
}

const AdSpend: FC<Props> = ({
  adSpendList,
  spendAmount,
  funnelData,
  costFunnelStep,
  renderFunnelBar = true,
  renderDifference = false,
}) => {
  const [, setChart] = useQueryParam('chart', StringParam);
  const [dateComparisonActive] = useQueryParam('dateComparisonActive', BooleanParam);

  const {
    selectedFunnelStep: { selectedFunnelStep, setSelectedFunnelStep },
    providers: { providersFilter },
  } = usePortfolio();
  const { labelsFilter } = useLabels().filter;
  const { impactGroupsFilter } = useImpactGroups().filter;

  const percentagesFull = getFunnelFlexPercentages([adSpendList]);
  const { colors, subLabels } = funnelData;

  const active = selectedFunnelStep?.funnel_step_id === costFunnelStep?.funnelStep?.funnelStepId;

  const filteredProviderIds = providersFilter.map((provider) => provider.provider_id);
  const filteredLabelIds = labelsFilter.map((label) => label.labelId);
  const filteredImpactGroupIds = impactGroupsFilter.map((impactGroup) => impactGroup.impactGroupId);

  const filteredItems = (() => {
    if (filteredProviderIds.length > 0) {
      return costFunnelStep?.metricTotals?.providers.filter((provider) =>
        filteredProviderIds.includes(provider.providerId),
      );
    }

    if (filteredLabelIds.length > 0) {
      return costFunnelStep?.metricTotals?.labels.filter((label) => filteredLabelIds.includes(label.labelId));
    }

    if (impactGroupsFilter.length > 0) {
      return costFunnelStep?.metricTotals?.impactGroups.filter((impactGroup) =>
        filteredImpactGroupIds.includes(impactGroup.impactGroup?.impactGroupId),
      );
    }

    return costFunnelStep?.metricTotals?.providers;
  })();

  // @ts-ignore
  const totalValue = filteredItems?.reduce((acc, cur) => acc + (cur?.total?.value || 0), 0) || 0;
  const comparisonTotalValue =
    // @ts-ignore
    filteredItems?.reduce((acc, cur) => acc + (cur?.comparisonTotal?.value || 0), 0) || 0;

  const averageComparisonChangePercent = comparisonTotalValue
    ? round(((totalValue - comparisonTotalValue) / comparisonTotalValue) * 100, 1)
    : 0;

  return (
    <AddSpendContainerStyled>
      <AdLabelContainerStyled
        minWidth={dateComparisonActive ? DATE_COMPARISON_FUNNEL_WIDTH : DEFAULT_FUNNEL_WIDTH}
        className={active ? 'active' : ''}
        onClick={() => {
          if (costFunnelStep?.funnelStep?.funnelStepId !== selectedFunnelStep?.funnel_step_id) {
            setSelectedFunnelStep({
              title: 'Ad spend',
              funnel_step_id: costFunnelStep?.funnelStep?.funnelStepId,
              type: costFunnelStep?.funnelStep?.type,
            });
            setChart('performance');
          }
        }}
      >
        <div style={{ display: 'flex' }}>
          <LabelTitleStyled style={{ marginBottom: 20 }}>Ad spend</LabelTitleStyled>
        </div>
        <NumbersWrapperStyled>
          <ValueTitleStyled style={{ fontSize: 20 }}>
            <FormattedCurrency
              showDecimals={!renderDifference}
              amount={renderDifference ? floor(spendAmount) : spendAmount}
            />
          </ValueTitleStyled>
          {renderDifference && (
            <Tooltip
              style={{
                wordBreak: 'break-word',
              }}
              content={`The ad spend ${averageComparisonChangePercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(
                averageComparisonChangePercent,
              )}% compared to the actual period`}
              variant="dark"
            >
              <PotentialWrapStyled>
                <NumberValueStyled
                  value={averageComparisonChangePercent}
                  showChangePrefix
                  textWithColor
                  noValue={!averageComparisonChangePercent}
                  variant={
                    averageComparisonChangePercent > 0
                      ? 'positive'
                      : averageComparisonChangePercent === 0
                        ? 'default'
                        : 'negative'
                  }
                  datatype={{ suffix: true, symbol: '%' }}
                  style={{ fontSize: 24, fontWeight: 400 }}
                />
              </PotentialWrapStyled>
            </Tooltip>
          )}
        </NumbersWrapperStyled>
      </AdLabelContainerStyled>
      {renderFunnelBar ? (
        <div style={{ padding: 12 }}>
          <Tooltip
            placement="right"
            variant="dark"
            content={renderTooltipContent({ subLabels, labels: ['Ad spend'], values: [adSpendList], colors }, 0)}
          >
            <AdSpendSegmentStyled width={FUNNEL_CONFIG.width * 1.35}>
              {adSpendList?.map((step, seriesIndex) => (
                <FunnelChannelStyled
                  key={`ad-spend-bar-${step}-${seriesIndex}`}
                  style={{
                    height: 20,
                    flex: `${percentagesFull?.[0]?.[seriesIndex] || 1}`,
                    flexDirection: 'row',
                    opacity: active ? 1 : 0.5,
                    backgroundColor: seriesIndex ? colors[seriesIndex] : colors[0],
                  }}
                />
              ))}
            </AdSpendSegmentStyled>
          </Tooltip>
        </div>
      ) : null}
    </AddSpendContainerStyled>
  );
};

export default AdSpend;
