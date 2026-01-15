import React, { FC } from 'react';

import { NexoyaFunnelStepPerformance, NexoyaFunnelStepType, NexoyaProvider } from '../../../../../types';

import { useLabels } from '../../../../../context/LabelsProvider';
import { usePortfolio } from '../../../../../context/PortfolioProvider';
import { useImpactGroups } from '../../../../../context/ImpactGroupsProvider';

import { shortenNumber } from '../../../../../utils/number';
import {
  computeArrayOfSums,
  DATE_COMPARISON_FUNNEL_WIDTH,
  DEFAULT_FUNNEL_WIDTH,
  FUNNEL_CONFIG,
  FUNNEL_STEP_WIDTHS_PERCENTAGES,
  getConversionRatePercentages,
  getSliceToLengthOfActiveFilter,
  OFFSET_MULTIPLIERS,
  trimCompareToArray,
} from '../utils/funnel';

import Tooltip from '../../../../../components/Tooltip';
import { NumberValueStyled } from '../../../../content/styles/ContentPageTableRow';
import { FunnelData } from '../MultiSeriesFunnel';

import {
  ConversionPercentageStyled,
  FunnelStepLabelButtonStyled,
  FunnelStepTitleContainerStyled,
  LabelsStyled,
  LabelTitleStyled,
  NumbersWrapperStyled,
  PotentialWrapStyled,
  ValueTitleStyled,
} from '../styles';

import { round } from 'lodash';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { useTeam } from '../../../../../context/TeamProvider';

interface Props {
  funnelData: FunnelData;
  providerSources: Partial<NexoyaProvider>[];
  performanceTotalsFunnelSteps: NexoyaFunnelStepPerformance[];
  compareTo: boolean;
  conversionRateToggle: boolean;
  dateComparisonActive?: boolean;
  renderPotential?: boolean;
}

export const Labels: FC<Props> = ({
  funnelData,
  conversionRateToggle,
  performanceTotalsFunnelSteps,
  providerSources,
  compareTo,
  dateComparisonActive = true,
  renderPotential = false,
}) => {
  const [, setIsAttributionDialogOpen] = useQueryParam('attributionDialogOpen', BooleanParam);
  const {
    selectedFunnelStep: { selectedFunnelStep, setSelectedFunnelStep },
    providers: { providersFilter },
  } = usePortfolio();
  const { labelsFilter } = useLabels().filter;
  const { impactGroupsFilter } = useImpactGroups().filter;
  const { teamId } = useTeam();

  const conversionRatePercentages = getConversionRatePercentages(funnelData, compareTo, providerSources?.length);

  return (
    <LabelsStyled>
      {performanceTotalsFunnelSteps?.map((pf, idx) => {
        // const isFunnelStepAttributed = pf.funnelStep?.isAttributed;
        // Mock attributed funnel step

        const funnelStep = pf.funnelStep;

        const metricTotals = pf.metricTotals;
        const funnelStepId = funnelStep?.funnelStepId;
        const active = selectedFunnelStep?.funnel_step_id === funnelStepId;

        const filteredProviderIds = providersFilter.map((provider) => provider.provider_id);
        const filteredLabelIds = labelsFilter.map((label) => label.labelId);
        const filteredImpactGroupIds = impactGroupsFilter.map((impactGroup) => impactGroup.impactGroupId);

        const filteredItems = (() => {
          if (filteredProviderIds.length > 0) {
            return metricTotals?.providers.filter((provider) => filteredProviderIds.includes(provider.providerId));
          }

          if (filteredLabelIds.length > 0) {
            return metricTotals?.labels.filter((label) => filteredLabelIds.includes(label.labelId));
          }

          if (impactGroupsFilter.length > 0) {
            return metricTotals?.impactGroups.filter((impactGroup) =>
              filteredImpactGroupIds.includes(impactGroup.impactGroup?.impactGroupId),
            );
          }

          return metricTotals?.providers;
        })();

        // @ts-ignore
        const totalValue = filteredItems?.reduce((acc, cur) => acc + (cur?.total?.value || 0), 0) || 0;
        const comparisonTotalValue =
          // @ts-ignore
          filteredItems?.reduce((acc, cur) => acc + (cur?.comparisonTotal?.value || 0), 0) || 0;

        const averageComparisonChangePercent = comparisonTotalValue
          ? round(((totalValue - comparisonTotalValue) / comparisonTotalValue) * 100, 1)
          : 0;

        const potential = averageComparisonChangePercent;
        const potentialVariant = potential > 0 ? 'positive' : potential === 0 ? 'default' : 'negative';

        const offsetPercentagePosition = -(
          FUNNEL_CONFIG.width +
          FUNNEL_CONFIG.width * FUNNEL_STEP_WIDTHS_PERCENTAGES[idx] +
          parseInt(String(conversionRatePercentages[idx]))?.toString().length * OFFSET_MULTIPLIERS[idx]
        );

        const funnelStepTitle = funnelStep?.title;
        const isFunnelStepAttributed = funnelStep?.isAttributed;

        const shouldRenderConversionRate =
          conversionRateToggle && idx !== 0 && funnelStep?.type !== NexoyaFunnelStepType.ConversionValue;

        const potentialTooltipContent = `The ${funnelStepTitle} ${
          averageComparisonChangePercent > 0 ? 'increased' : 'decreased'
        } by ${averageComparisonChangePercent}% compared to the previous period`;
        return (
          <FunnelStepLabelButtonStyled
            minWidth={dateComparisonActive ? DATE_COMPARISON_FUNNEL_WIDTH : DEFAULT_FUNNEL_WIDTH}
            key={funnelStepId}
            active={active}
            onClick={() => {
              if (!active) {
                setSelectedFunnelStep({
                  title: funnelStep?.title,
                  funnel_step_id: funnelStep?.funnelStepId,
                  type: funnelStep?.type,
                });
              }
            }}
            className="fg-label"
            data-funnel-step-index={idx.toString()}
          >
            <FunnelStepTitleContainerStyled>
              <Tooltip
                variant="dark"
                placement="right"
                style={{ wordBreak: 'break-word' }}
                content={funnelData?.labels?.[idx]?.length > 35 ? funnelData?.labels?.[idx] : ''}
              >
                <LabelTitleStyled>{funnelStepTitle}</LabelTitleStyled>
              </Tooltip>
            </FunnelStepTitleContainerStyled>
            <NumbersWrapperStyled>
              <ValueTitleStyled>
                {shortenNumber(
                  compareTo
                    ? computeArrayOfSums(
                        trimCompareToArray(
                          funnelData.values,
                          getSliceToLengthOfActiveFilter({
                            filteredProviderIds,
                            filteredLabelIds,
                            filteredImpactGroupIds,
                          }),
                        ),
                      )[idx]
                    : computeArrayOfSums(funnelData.values)[idx],
                )}
              </ValueTitleStyled>
              {!dateComparisonActive && isFunnelStepAttributed ? (
                <div
                  className="cursor-pointer text-[12px] font-medium leading-[20px] tracking-[0.16px] text-[#05A8FA] underline"
                  onClick={() => {
                    setIsAttributionDialogOpen(true);
                  }}
                >
                  See attribution insights
                </div>
              ) : null}
              {renderPotential && typeof potential === 'number' && (
                <Tooltip style={{ wordBreak: 'break-word' }} content={potentialTooltipContent} variant="dark">
                  <PotentialWrapStyled>
                    <NumberValueStyled
                      value={potential}
                      showChangePrefix
                      textWithColor
                      noValue={!potential}
                      variant={potentialVariant}
                      datatype={{ suffix: true, symbol: '%' }}
                      style={{ fontSize: 24, fontWeight: 400 }}
                    />
                  </PotentialWrapStyled>
                </Tooltip>
              )}
            </NumbersWrapperStyled>
            {shouldRenderConversionRate && (
              <ConversionPercentageStyled style={{ right: offsetPercentagePosition }}>
                {conversionRatePercentages[idx] ? `${conversionRatePercentages[idx]}%` : ''}
              </ConversionPercentageStyled>
            )}
          </FunnelStepLabelButtonStyled>
        );
      })}
    </LabelsStyled>
  );
};
