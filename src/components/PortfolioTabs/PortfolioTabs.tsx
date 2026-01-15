import React from 'react';
import { TabsNav } from '../Tabs';
import { portfolioTabs } from '../../configs/portfolio';
import * as Styles from '../../routes/portfolio/styles/Portfolio';
import { PortfolioTypeSwitch } from '../PortfolioTypeSwitch';
import FeatureSwitch from '../FeatureSwitch';
import { FEATURE_FLAGS } from '../../constants/featureFlags';
import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import dayjs from 'dayjs';
import { GLOBAL_DATE_FORMAT } from '../../utils/dates';
import { BooleanParam, NumberParam, StringParam, useQueryParam, useQueryParams } from 'use-query-params';
import { useUnsavedChanges } from '../../context/UnsavedChangesProvider';
import { useDiscoverContentsStore } from '../../store/discovered-contents';

interface Props {
  portfolioId: number;
  dateFrom: Date;
  dateTo: Date;
  tabSize: 'small' | 'base' | 'medium' | 'large';
}

export const PortfolioTabs = ({ portfolioId, dateFrom, dateTo, tabSize }: Props) => {
  const [activeTab, setActiveTab] = useQueryParam('activeTab', StringParam);
  const [, setQueryParams] = useQueryParams({
    simulationId: NumberParam,
    activeTab: StringParam,
    selectedScenarioId: NumberParam,
    scenarioMetricSwitch: StringParam,
    xAxis: StringParam,
    yAxis: StringParam,
    dateComparisonActive: BooleanParam,
  });

  const { setHasUnsavedChanges, handleNavigation } = useUnsavedChanges();

  const handleTabChange = (tab: string) => {
    handleNavigation(() => {
      if (activeTab === portfolioTabs.SIMULATIONS) {
        setQueryParams({
          simulationId: null,
          selectedScenarioId: null,
          scenarioMetricSwitch: null,
          xAxis: null,
          yAxis: null,
        });
      }
      setHasUnsavedChanges(false);
      setActiveTab(tab);
      track(EVENT.PORTFOLIO_TAB_CHANGE(tab), {
        portfolioId,
        start: dayjs(dateFrom).format(GLOBAL_DATE_FORMAT),
        end: dayjs(dateTo).format(GLOBAL_DATE_FORMAT),
      });
    });
  };

  const tabNewUpdates = useDiscoverContentsStore((state) => state.tabNewUpdates);

  return (
    <div className="flex">
      <TabsNav
        tab={portfolioTabs.PERFORMANCE}
        component={Styles.NavTabStyled}
        size={tabSize}
        onClick={() => handleTabChange(portfolioTabs.PERFORMANCE)}
      >
        Performance
      </TabsNav>
      <TabsNav
        tab={portfolioTabs.OPTIMIZATION}
        component={Styles.NavTabStyled}
        size={tabSize}
        onClick={() => handleTabChange(portfolioTabs.OPTIMIZATION)}
      >
        Optimize
      </TabsNav>
      <TabsNav
        tab={portfolioTabs.VALIDATION}
        component={Styles.NavTabStyled}
        size={tabSize}
        onClick={() => handleTabChange(portfolioTabs.VALIDATION)}
      >
        Validation
      </TabsNav>
      <PortfolioTypeSwitch
        renderForBudgetType={() => (
          <TabsNav
            tab={portfolioTabs.BUDGET}
            component={Styles.NavTabStyled}
            size={tabSize}
            onClick={() => handleTabChange(portfolioTabs.BUDGET)}
          >
            Budget
          </TabsNav>
        )}
        renderForTargetType={() => (
          <TabsNav
            tab={portfolioTabs.TARGET}
            component={Styles.NavTabStyled}
            size={tabSize}
            onClick={() => handleTabChange(portfolioTabs.TARGET)}
          >
            Target
          </TabsNav>
        )}
      />
      <FeatureSwitch
        renderLoadingIndicator={false}
        features={[FEATURE_FLAGS.SIMULATIONS]}
        renderOld={() => null}
        renderNew={() => (
          <TabsNav
            tab={portfolioTabs.SIMULATIONS}
            component={Styles.NavTabStyled}
            size={tabSize}
            onClick={() => {
              handleNavigation(() => {
                setQueryParams({
                  activeTab: portfolioTabs.SIMULATIONS,
                  simulationId: null,
                  selectedScenarioId: null,
                  scenarioMetricSwitch: null,
                  xAxis: null,
                  yAxis: null,
                });
                track(EVENT.PORTFOLIO_TAB_CHANGE(portfolioTabs.SIMULATIONS), {
                  portfolioId,
                });
              });
            }}
          >
            Simulations
          </TabsNav>
        )}
      />
      <TabsNav
        tab={portfolioTabs.CONTENT}
        component={Styles.NavTabStyled}
        size={tabSize}
        hasNewUpdates={tabNewUpdates?.discoveredContents || tabNewUpdates?.unappliedRules}
        onClick={() => handleTabChange(portfolioTabs.CONTENT)}
      >
        Content
      </TabsNav>
      <TabsNav
        tab={portfolioTabs.SETTINGS}
        component={Styles.NavTabStyled}
        size={tabSize}
        onClick={() => handleTabChange(portfolioTabs.SETTINGS)}
      >
        Portfolio settings
      </TabsNav>
    </div>
  );
};
