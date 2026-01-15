import React, { useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';

import dayjs from 'dayjs';
import styled from 'styled-components';
import { BooleanParam, NumberParam, StringParam, useQueryParam, useQueryParams } from 'use-query-params';

import { withLabelsProvider } from '../context/LabelsProvider';
import { withPortfolioProvider } from '../context/PortfolioProvider';
import { usePortfolio } from 'context/PortfolioProvider';
import { DATE_SELECTOR_YEARLY_DEFAULT_FORMAT, GLOBAL_DATE_FORMAT } from '../utils/dates';
import {
  createCompareDateSelectorProps,
  createDateSelectorProps,
  DEFAULT_PORTFOLIO_DATE_RANGE,
} from '../utils/portfolio';
import { useQueryParamDateRange } from 'hooks/useQueryParamDateRange';

import ErrorBoundary from '../components/ErrorBoundary';
import ErrorMessage from '../components/ErrorMessage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import MainContent from '../components/MainContent';
import { Tabs } from '../components/Tabs';

import { portfolioTabs } from '../configs/portfolio';
import { usePortfolioV2MetaQuery } from '../graphql/portfolio/queryPortfolioMeta';
import { getCompareDateRanges } from '../components/DateSelector/portfolioDateRanges';
import { isPresenterMode } from '../utils/isPresenterMode';
import PortfolioMenu, { PortfolioTitleWithExpandableBricks } from '../components/PortfolioHeader';
import { useSidebar } from '../context/SidebarProvider';
import { useRouteMatch } from 'react-router';
import { withImpactGroupsProvider } from '../context/ImpactGroupsProvider';
import {
  PortfolioContent,
  PortfolioSettingsTabs,
  PortfolioTabHeader,
  PortfolioTabs,
} from '../components/PortfolioTabs';
import PortfolioFeatureSwitch from '../components/PortfolioFeatureSwitch';
import { PORTFOLIO_FEATURE_FLAGS } from '../constants/featureFlags';
import { useFunnelStepsV2Query } from '../graphql/funnelSteps/queryFunnelSteps';
import { toNumber } from 'lodash';
import { cn } from '../lib/utils';
import { PortfolioContentTabs } from '../components/PortfolioTabs/PortfolioContentTabs';
import { useHeader } from '../context/HeaderProvider';
import { useTranslationsQuery } from '../graphql/translation/queryTranslations';
import useTabNewUpdates from '../hooks/useTabNewUpdates';
import useFunnelStepsStore from '../store/funnel-steps';
import usePortfolioMetaStore from '../store/portfolio-meta';
import usePortfolioEventsStore from '../store/portfolio-events';
import { useContentFilterStore } from '../store/content-filter';
import { trackPortfolioView } from '../constants/datadog';
import { useChartsStore } from '../store/charts';
import { useCustomizationStore } from '../store/customization';

export const BrickLoaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const BrickLoader = styled(LoadingPlaceholder)`
  height: 20px;
  width: 150px;
  margin-bottom: 6px;
`;
const ALLOWED_TABS = [
  portfolioTabs.PERFORMANCE,
  portfolioTabs.OPTIMIZATION,
  portfolioTabs.VALIDATION,
  portfolioTabs.BUDGET,
  portfolioTabs.TARGET,
  portfolioTabs.CONTENT,
  portfolioTabs.SIMULATIONS,
  portfolioTabs.SETTINGS,
];

const Portfolio = () => {
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { sidebarWidth } = useSidebar();
  const { headerHeight } = useHeader();

  const {
    selectedFunnelStep: { setSelectedFunnelStep },
    portfolioV2Info: {
      meta: { updateState: updatePortfolioMetaState, data: portfolioMeta },
    },
  } = usePortfolio();

  const { resetAllFilters } = useContentFilterStore();
  const { setCompareTo, setIsStackedAreaChartActive, setConversionRateToggle } = useCustomizationStore();

  const { setFunnelSteps } = useFunnelStepsStore();
  const { setPortfolioMeta } = usePortfolioMetaStore();
  const { resetStore: resetPortfolioEventsStore } = usePortfolioEventsStore();
  const { resetInitialDateRange } = useChartsStore();

  useTranslationsQuery();
  useTabNewUpdates(portfolioId);

  const [activeTab] = useQueryParam('activeTab', StringParam);
  const [activeSettingsTab] = useQueryParam('activeSettingsTab', StringParam);

  const [queryParams, setQueryParams] = useQueryParams({
    fs: NumberParam,
    simulationId: NumberParam,
    activeTab: StringParam,
    selectedScenarioId: NumberParam,
    scenarioMetricSwitch: StringParam,
    xAxis: StringParam,
    yAxis: StringParam,
    dateComparisonActive: BooleanParam,
  });
  const [bufferedParams, setBufferedParams] = useState(queryParams);

  // There's currently an issue with setQueryParams causing a race-condition if called multiple times in quick succession
  // leading into the query params not being updated correctly, so this is an attempt to mitigate that, although it's not a pretty solution
  // it could probably be solved by updating the use-query library to a newer version, but that requires the whole project
  // to be migrated to the new version of the library
  const updateQueryParams = (newParams) => {
    setBufferedParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  const { dateFrom, dateTo, setDates } = useQueryParamDateRange(DEFAULT_PORTFOLIO_DATE_RANGE);
  const compareDateRanges = getCompareDateRanges(dateFrom, dateTo);

  const {
    dateFrom: compareFrom,
    dateTo: compareTo,
    setDates: setCompare,
  } = useQueryParamDateRange(
    queryParams.dateComparisonActive
      ? {
          dateFrom: compareDateRanges.previousPeriod.getDateRange().from,
          dateTo: compareDateRanges.previousPeriod.getDateRange().to,
        }
      : null,
    { dateFrom: 'compareFrom', dateTo: 'compareTo' },
  );
  const {
    data: portfolioMetaData,
    loading: metaLoading,
    error,
  } = usePortfolioV2MetaQuery({
    start: dayjs(dateFrom).utc().format(GLOBAL_DATE_FORMAT),
    end: dayjs(dateTo).utc().format(GLOBAL_DATE_FORMAT),
    portfolioId,
  });

  const { data: funnelStepsData } = useFunnelStepsV2Query({
    portfolioId,
    onCompleted: (data) => {
      setFunnelSteps(data?.portfolioV2?.funnelSteps);
    },
  });

  const funnelSteps = funnelStepsData?.portfolioV2?.funnelSteps;

  useEffect(() => {
    // Reset store data when the portfolioId changes
    resetAllFilters();
    resetPortfolioEventsStore();
    setConversionRateToggle(false);
    setIsStackedAreaChartActive(false);
    setCompareTo(true);
    resetInitialDateRange();
  }, [portfolioId]);

  useEffect(() => {
    // Updating the legacy data, at the moment of writing this comment it's only being used in the Content tab
    updatePortfolioMetaState({ data: portfolioMetaData?.portfolioV2, loading: metaLoading });
    setPortfolioMeta(portfolioMetaData?.portfolioV2);
  }, [portfolioMetaData, metaLoading]);

  // Apply buffered updates to query params
  useEffect(() => {
    setQueryParams(bufferedParams);
  }, [bufferedParams]);

  useEffect(() => {
    if (!queryParams.activeTab) {
      // Update activeTab to PERFORMANCE if not already set
      updateQueryParams({ activeTab: portfolioTabs.PERFORMANCE });
    }
  }, [queryParams.activeTab]);

  useEffect(() => {
    // Treat activeTab and activeSettingsTab as their own views
    trackPortfolioView(activeTab, activeSettingsTab);
  }, [portfolioId, activeTab, activeSettingsTab]);

  useEffect(() => {
    if (funnelSteps?.length && portfolioMeta?.defaultOptimizationTarget) {
      let targetFunnelStepId = null;

      // Check if queryParams.fs exists in the funnelSteps
      if (queryParams.fs && funnelSteps.some((fs) => fs?.funnelStepId === queryParams.fs)) {
        targetFunnelStepId = queryParams.fs;
      } else if (portfolioMeta?.defaultOptimizationTarget?.funnelStepId) {
        // Use defaultOptimizationTarget if queryParams.fs is invalid
        targetFunnelStepId = portfolioMeta.defaultOptimizationTarget.funnelStepId;
      }

      // Select the target funnel step or fall back to the last one
      const targetFunnelStep =
        funnelSteps.find((fs) => fs?.funnelStepId === targetFunnelStepId) || funnelSteps[funnelSteps.length - 1];

      // Set the selected funnel step in state
      setSelectedFunnelStep({
        title: targetFunnelStep?.title,
        funnel_step_id: targetFunnelStep.funnelStepId,
        type: targetFunnelStep.type,
      });

      // Update query params to reflect the selected funnel step
      if (targetFunnelStep?.funnelStepId !== queryParams.fs) {
        setQueryParams({ fs: targetFunnelStep?.funnelStepId ? toNumber(targetFunnelStep?.funnelStepId) : undefined });
      }
    } else if (!funnelSteps?.length) {
      // If there are no funnel steps, clear the selected funnel step and fs param
      setSelectedFunnelStep({ title: undefined, funnel_step_id: undefined, type: undefined });
      if (queryParams.fs) {
        setQueryParams({ fs: undefined });
      }
    }
  }, [portfolioMeta, funnelSteps, portfolioId]);

  const hasPortfolioEnded = !metaLoading && dayjs().isAfter(portfolioMeta?.end);

  // format dates differently if the selected range spans across different years
  const dateFormat = useMemo(() => {
    if (!queryParams.dateComparisonActive) {
      return null;
    }

    const compareFromYear = dayjs(compareFrom).year();
    const compareToYear = dayjs(compareTo).year();
    const dateFromYear = dayjs(dateFrom).year();
    const dateToYear = dayjs(dateTo).year();

    // Check if any of the date ranges span different years
    if (compareFromYear !== compareToYear || compareFromYear !== dateFromYear || compareToYear !== dateToYear) {
      return DATE_SELECTOR_YEARLY_DEFAULT_FORMAT;
    }
  }, [compareFrom, compareTo, dateFrom, dateTo]);

  const dateSelectorProps = createDateSelectorProps({
    setDates,
    activeTab,
    portfolioStart: portfolioMeta?.start,
    portfolioEnd: portfolioMeta?.end,
    hasPortfolioEnded,
    dateFrom,
    dateTo,
    queryParams,
    dateFormat,
    portfolioId,
    resetInitialDateRange,
  });

  const compareDateSelectorProps = createCompareDateSelectorProps({
    disableAfter: dateSelectorProps.dateTo,
    portfolioId,
    setCompare,
    activeTab,
    compareFrom,
    compareTo,
    compareDateRanges,
    dateFormat,
    setQueryParams,
  });

  return (
    <Tabs
      defaultTab={ALLOWED_TABS.includes(activeTab) ? activeTab : portfolioTabs.PERFORMANCE}
      controlledTab={ALLOWED_TABS.includes(activeTab) ? activeTab : portfolioTabs.PERFORMANCE}
    >
      <div
        className={cn('flex items-center justify-between', 'group sticky top-0 z-[2] bg-white px-8 py-2')}
        style={{ marginLeft: isPresenterMode() ? 0 : sidebarWidth, transition: 'margin-left 0.25s ease-in-out' }}
      >
        <PortfolioTitleWithExpandableBricks portfolio={portfolioMeta} />
        <PortfolioMenu />
      </div>
      <div
        className={cn(
          'flex max-h-[52px] items-center justify-between',
          'sticky z-[1] border-b border-t border-neutral-100 bg-white px-8',
        )}
        style={{
          marginLeft: isPresenterMode() ? 0 : sidebarWidth,
          transition: 'margin-left 0.25s ease-in-out',
          top: headerHeight,
        }}
      >
        <PortfolioTabs portfolioId={portfolioId} dateFrom={dateFrom} dateTo={dateTo} tabSize="base" />
      </div>
      <PortfolioSettingsTabs portfolioId={portfolioId} sidebarWidth={sidebarWidth} />
      <PortfolioFeatureSwitch
        features={[PORTFOLIO_FEATURE_FLAGS.SELF_SERVICE_PORTFOLIO]}
        renderNew={() => <PortfolioContentTabs portfolioId={portfolioId} sidebarWidth={sidebarWidth} />}
        renderOld={() => null}
      />
      <MainContent size="small" className="sectionToPrint">
        <ErrorBoundary>
          <PortfolioTabHeader
            portfolioMetaData={portfolioMetaData}
            dateSelectorProps={dateSelectorProps}
            comparisonDateSelectorProps={compareDateSelectorProps}
          />

          <PortfolioContent
            portfolioMetaData={portfolioMetaData}
            comparisonDateSelectorProps={compareDateSelectorProps}
            dateSelectorProps={dateSelectorProps}
          />
        </ErrorBoundary>
        {error ? <ErrorMessage error={error} /> : null}
      </MainContent>
    </Tabs>
  );
};

export default withRouter(withPortfolioProvider(withImpactGroupsProvider(withLabelsProvider(Portfolio))));
