import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { NexoyaFunnelStepPerformance, NexoyaFunnelStepType } from '../../../../types';

import { useLabels } from '../../../../context/LabelsProvider';
import { usePortfolio } from '../../../../context/PortfolioProvider';

import useTeamColor from '../../../../hooks/useTeamColor';
import translate from '../../../../utils/translate';
import {
  computeArrayOfSums,
  computeBudgetAndFunnelDataValues,
  computeCostPerProviderPerFunnelStep,
  getSliceToLengthOfActiveFilter,
  sortCostPerProviderPerFunnelStep,
} from 'routes/portfolio/components/Funnel/utils/funnel';

import AdSpend from './components/AdSpend';
import { FunnelSteps } from './components/FunnelSteps';
import { Labels } from './components/Labels';
import { FunnelStepAttributionInsights } from './FunnelStepAttributionInsights';

import { nexyColors } from '../../../../theme';
import {
  AddSpendContainerStyled,
  FunnelContainerStyled,
  FunnelStepsContainerStyled,
  LabelsContainerStyled,
} from './styles';
import { BooleanParam, StringParam, useQueryParam, useQueryParams } from 'use-query-params';
import dayjs from 'dayjs';
import { READABLE_FORMAT } from '../../../../utils/dates';
import { useImpactGroups } from '../../../../context/ImpactGroupsProvider';
import { useCustomizationStore } from '../../../../store/customization';
import useTranslationStore from '../../../../store/translations';

const DEFAULT_COLOR = nexyColors.azure;
const OTHER_CHANNELS_LABEL = 'Other';

export type FunnelData = {
  labels: string[];
  subLabels: string[];
  colors: string | string[];
  values: number[][];
};

const INITIAL_DATA = {
  labels: [],
  subLabels: [],
  values: [],
  colors: [],
};

interface Props {
  performanceTotalsFunnelSteps: NexoyaFunnelStepPerformance[];
}

export const MultiSeriesFunnel = ({ performanceTotalsFunnelSteps }: Props) => {
  const [dateComparisonActive] = useQueryParam('dateComparisonActive', BooleanParam);
  const [attributionDialogOpen, setIsAttributionDialogOpen] = useQueryParam('attributionDialogOpen', BooleanParam);

  const [queryParams] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
    compareFrom: StringParam,
    compareTo: StringParam,
    dateComparisonActive: BooleanParam,
  });

  const [funnelData, setFunnelData] = useState<FunnelData>(INITIAL_DATA);
  const [comparisonFunnelData, setComparisonFunnelData] = useState<FunnelData>(INITIAL_DATA);
  const [adSpend, setAdSpend] = useState<number[]>([]);
  const [comparisonAdSpend, setComparisonAdSpend] = useState<number[]>([]);

  const { conversionRateToggle, compareTo } = useCustomizationStore();
  const { translations } = useTranslationStore();

  const {
    providers: { providersFilter },
  } = usePortfolio();

  const {
    filter: { labelsFilter },
  } = useLabels();
  const {
    filter: { impactGroupsFilter },
  } = useImpactGroups();

  const getThemeColor = useTeamColor();

  const funnelStepsWithoutCost = useMemo(
    () => performanceTotalsFunnelSteps?.filter((pf) => pf.funnelStep?.type !== NexoyaFunnelStepType.Cost),
    [performanceTotalsFunnelSteps],
  );

  const allActiveProviderIds = performanceTotalsFunnelSteps?.[0].metricTotals.providers?.map((providerMetric) => ({
    provider_id: providerMetric.providerId,
  }));

  const providerSources = providersFilter?.length ? providersFilter : allActiveProviderIds;

  const filteredProviderIds = providersFilter.map((provider) => provider.provider_id);
  const filteredLabelIds = labelsFilter.map((label) => label.labelId);
  const filteredImpactGroupIds = impactGroupsFilter.map((impactGroup) => impactGroup.impactGroupId);

  const computeFunnelData = useCallback(
    (funnelSteps, propertyKey: 'total' | 'comparisonTotal') => {
      try {
        const costPerProviderPerFunnelStep = computeCostPerProviderPerFunnelStep(
          providersFilter,
          labelsFilter,
          impactGroupsFilter,
          funnelSteps,
          compareTo,
          propertyKey,
        );

        const sortedArr = sortCostPerProviderPerFunnelStep(costPerProviderPerFunnelStep, funnelSteps);
        return computeBudgetAndFunnelDataValues(sortedArr);
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [providersFilter, labelsFilter, impactGroupsFilter, compareTo],
  );

  const updateFunnelData = useCallback(() => {
    const funnelDataValues = computeFunnelData(performanceTotalsFunnelSteps, 'total');
    const comparisonFunnelDataValues = dateComparisonActive
      ? computeFunnelData(performanceTotalsFunnelSteps, 'comparisonTotal')
      : null;

    if (!funnelDataValues) return;

    const { computedFunnelDataValues, adSpend } = funnelDataValues;

    const comparisonValues = comparisonFunnelDataValues?.computedFunnelDataValues || [];
    const comparisonAdSpendValues = comparisonFunnelDataValues?.adSpend || [];

    const getFunnelColors = () => {
      if (providersFilter?.length) return providersFilter.map((provider) => provider.providerLogoColor);
      if (labelsFilter?.length) return labelsFilter.map((_, idx) => getThemeColor(idx));
      if (impactGroupsFilter?.length) return impactGroupsFilter.map((_, idx) => getThemeColor(idx));
      return [DEFAULT_COLOR];
    };

    const updateProviderColorsAndReturnLabels = (
      providerColors: string[],
      providerNames: string[],
      labelNames: string[],
      impactGroupNames: string[],
    ) => {
      if (compareTo) {
        providerColors.push(nexyColors.frenchGray);
        if (providersFilter.length) return [...providerNames, OTHER_CHANNELS_LABEL];
        if (labelsFilter.length) return [...labelNames, OTHER_CHANNELS_LABEL];
        if (impactGroupsFilter.length) return [...impactGroupNames, OTHER_CHANNELS_LABEL];

        return [OTHER_CHANNELS_LABEL];
      }
      if (providersFilter.length) return providerNames;
      if (labelsFilter.length) return labelNames;
      if (impactGroupsFilter.length) return impactGroupNames;

      return [OTHER_CHANNELS_LABEL];
    };

    const providerNames = providersFilter.map((provider) => translate(translations, provider.name)) || [];
    const labelNames = labelsFilter.map((label) => label.name) || [];
    const impactGroupNames = impactGroupsFilter.map((ig) => ig.name) || [];
    const colors = getFunnelColors();

    const subLabels = updateProviderColorsAndReturnLabels(colors, providerNames, labelNames, impactGroupNames);

    setAdSpend(adSpend);
    setFunnelData({
      subLabels,
      colors,
      values: computedFunnelDataValues,
      labels: funnelStepsWithoutCost?.map((step) => step?.funnelStep?.title) || [],
    });

    if (dateComparisonActive) {
      setComparisonAdSpend(comparisonAdSpendValues);
      setComparisonFunnelData({
        subLabels,
        colors,
        values: comparisonValues,
        labels: funnelStepsWithoutCost?.map((step) => step?.funnelStep?.title) || [],
      });
    }
  }, [
    computeFunnelData,
    performanceTotalsFunnelSteps,
    funnelStepsWithoutCost,
    providersFilter,
    labelsFilter,
    impactGroupsFilter,
    compareTo,
    translations,
    dateComparisonActive,
  ]);

  useEffect(() => {
    updateFunnelData();
  }, [updateFunnelData]);

  return (
    <div style={{ marginRight: 32 }}>
      <AddSpendContainerStyled>
        {dateComparisonActive ? (
          <div className="flex gap-2">
            <div className="flex flex-col items-start gap-2">
              <div className="mb-3 ml-1 text-lg">
                {dayjs(queryParams.compareFrom).format(READABLE_FORMAT)} -{' '}
                {dayjs(queryParams.compareTo).format(READABLE_FORMAT)}
              </div>
              <AdSpend
                costFunnelStep={performanceTotalsFunnelSteps?.find(
                  (step) => step?.funnelStep?.type === NexoyaFunnelStepType.Cost,
                )}
                adSpendList={comparisonAdSpend}
                funnelData={comparisonFunnelData}
                renderFunnelBar={false}
                spendAmount={
                  compareTo
                    ? computeArrayOfSums([
                        comparisonAdSpend?.slice(
                          0,
                          getSliceToLengthOfActiveFilter({
                            filteredProviderIds,
                            filteredLabelIds,
                            filteredImpactGroupIds,
                          }),
                        ),
                      ])[0]
                    : computeArrayOfSums([comparisonAdSpend])[0]
                }
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="mb-3 ml-1 text-lg">
                {dayjs(queryParams.dateFrom).format(READABLE_FORMAT)} -{' '}
                {dayjs(queryParams.dateTo).format(READABLE_FORMAT)}
              </div>
              <AdSpend
                costFunnelStep={performanceTotalsFunnelSteps?.find(
                  (step) => step?.funnelStep?.type === NexoyaFunnelStepType.Cost,
                )}
                adSpendList={adSpend}
                funnelData={funnelData}
                renderDifference={true}
                spendAmount={
                  compareTo
                    ? computeArrayOfSums([
                        adSpend?.slice(
                          0,
                          getSliceToLengthOfActiveFilter({
                            filteredProviderIds,
                            filteredLabelIds,
                            filteredImpactGroupIds,
                          }),
                        ),
                      ])[0]
                    : computeArrayOfSums([adSpend])[0]
                }
              />
            </div>
          </div>
        ) : (
          <AdSpend
            costFunnelStep={performanceTotalsFunnelSteps?.find(
              (step) => step?.funnelStep?.type === NexoyaFunnelStepType.Cost,
            )}
            adSpendList={adSpend}
            funnelData={funnelData}
            spendAmount={
              compareTo
                ? computeArrayOfSums([
                    adSpend?.slice(
                      0,
                      getSliceToLengthOfActiveFilter({
                        filteredProviderIds,
                        filteredLabelIds,
                        filteredImpactGroupIds,
                      }),
                    ),
                  ])[0]
                : computeArrayOfSums([adSpend])[0]
            }
          />
        )}
      </AddSpendContainerStyled>
      <FunnelContainerStyled>
        {dateComparisonActive ? (
          <LabelsContainerStyled className="flex gap-2">
            <Labels
              funnelData={comparisonFunnelData}
              conversionRateToggle={conversionRateToggle}
              providerSources={providerSources}
              compareTo={compareTo}
              performanceTotalsFunnelSteps={funnelStepsWithoutCost}
              dateComparisonActive
            />
            <Labels
              funnelData={funnelData}
              conversionRateToggle={conversionRateToggle}
              providerSources={providerSources}
              compareTo={compareTo}
              performanceTotalsFunnelSteps={funnelStepsWithoutCost}
              dateComparisonActive
              renderPotential={true}
            />
          </LabelsContainerStyled>
        ) : (
          <LabelsContainerStyled>
            <Labels
              funnelData={funnelData}
              conversionRateToggle={conversionRateToggle}
              providerSources={providerSources}
              compareTo={compareTo}
              performanceTotalsFunnelSteps={funnelStepsWithoutCost}
              dateComparisonActive={false}
            />
          </LabelsContainerStyled>
        )}

        <FunnelStepsContainerStyled>
          <FunnelSteps funnelData={funnelData} funnelSteps={funnelStepsWithoutCost?.map((pf) => pf.funnelStep)} />
        </FunnelStepsContainerStyled>
      </FunnelContainerStyled>

      <FunnelStepAttributionInsights
        isOpen={attributionDialogOpen}
        onClose={() => setIsAttributionDialogOpen(false)}
        performanceTotalsFunnelSteps={performanceTotalsFunnelSteps}
      />
    </div>
  );
};
