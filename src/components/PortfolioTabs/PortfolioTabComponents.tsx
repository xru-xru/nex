import React from 'react';
import { contentTabs, portfolioTabs, settingsTabs } from '../../configs/portfolio';
import { Validation } from '../../routes/portfolio/Validation';
import { Performance } from '../../routes/portfolio/Performance';
import Budget from '../../routes/portfolio/Budget';
import Target from '../../routes/portfolio/Target';
import Optimize from '../../routes/portfolio/Optimize';
import { Simulations } from '../../routes/portfolio/Simulations';
import PortfolioFeatureSwitch from '../PortfolioFeatureSwitch';
import { FEATURE_FLAGS, PORTFOLIO_FEATURE_FLAGS } from '../../constants/featureFlags';
import ErrorBoundary from '../ErrorBoundary';
import FeatureSwitch from '../FeatureSwitch';
import Content from '../../routes/portfolio/Content/Content';
import { StringParam, useQueryParam } from 'use-query-params';
import PortfolioEditGeneral from '../../routes/portfolio/Settings/PortfolioGeneralSettings';
import { PortfolioFunnelSettings } from '../../routes/portfolio/Settings/PortfolioFunnelSettings';
import { PortfolioImpactGroupsSettings } from '../../routes/portfolio/Settings/PortfolioImpactGroupsSettings';
import PortfolioContentRules from '../../routes/portfolio/Settings/PortfolioContentRules';
import { DiscoveredContents } from '../../routes/portfolio/Content/DiscoveredContents';
import { UnappliedRules } from '../../routes/portfolio/Content/UnappliedRules';
import { RemovedContents } from '../../routes/portfolio/Content/RemovedContents';
import { PortfolioEvents } from '../../routes/portfolio/Settings/PortfolioEvents';
import AttributionRules from '../../routes/portfolio/Settings/PortfolioAttributionRules';
import OldBudget from '../../routes/portfolio/OldBudget/OldBudget';

interface PortfolioContentProps {
  portfolioMetaData: any;
  dateSelectorProps: any;
  comparisonDateSelectorProps: any;
}

export const PortfolioContent: React.FC<PortfolioContentProps> = ({
  portfolioMetaData,
  dateSelectorProps,
  comparisonDateSelectorProps,
}) => {
  const [activeTab = portfolioTabs.PERFORMANCE] = useQueryParam('activeTab', StringParam);
  const [activeSettingsTab] = useQueryParam('activeSettingsTab', StringParam);
  const [activeContentTab] = useQueryParam('activeContentTab', StringParam);

  const portfolioId = portfolioMetaData?.portfolioV2?.portfolioId;
  const { dateFrom, dateTo } = dateSelectorProps;

  switch (activeTab) {
    case portfolioTabs.PERFORMANCE:
      return (
        <Performance
          portfolioId={portfolioId}
          dateSelectorProps={dateSelectorProps}
          comparisonDateSelectorProps={comparisonDateSelectorProps}
        />
      );
    case portfolioTabs.VALIDATION:
      return <Validation portfolioId={portfolioId} dateTo={dateTo} dateFrom={dateFrom} />;
    case portfolioTabs.CONTENT:
      return (
        <PortfolioFeatureSwitch
          features={[PORTFOLIO_FEATURE_FLAGS.SELF_SERVICE_PORTFOLIO]}
          renderNew={() => {
            if (activeContentTab === contentTabs.CONTENT) {
              return <Content dateFrom={dateFrom} dateTo={dateTo} portfolioId={portfolioId} />;
            }
            if (activeContentTab === contentTabs.DISCOVERED_CONTENTS) {
              return <DiscoveredContents />;
            }
            if (activeContentTab === contentTabs.UNAPPLIED_RULES) {
              return <UnappliedRules />;
            }
            if (activeContentTab === contentTabs.REMOVED_CONTENTS) {
              return <RemovedContents />;
            }
          }}
          renderOld={() => <Content dateFrom={dateFrom} dateTo={dateTo} portfolioId={portfolioId} />}
        />
      );
    case portfolioTabs.BUDGET:
      return (
        <PortfolioFeatureSwitch
          features={[PORTFOLIO_FEATURE_FLAGS.BUDGET_V1]}
          renderNew={() => <OldBudget portfolioId={portfolioId} dateTo={dateTo} dateFrom={dateFrom} />}
          renderOld={() => (
            <Budget
              dateFrom={dateFrom}
              dateTo={dateTo}
              portfolioStart={portfolioMetaData?.portfolioV2?.start}
              portfolioEnd={portfolioMetaData?.portfolioV2?.end}
              portfolioId={portfolioId}
            />
          )}
        />
      );
    case portfolioTabs.TARGET:
      return (
        <Target
          portfolioStart={portfolioMetaData?.portfolioV2?.start}
          portfolioEnd={portfolioMetaData?.portfolioV2?.end}
          portfolioType={portfolioMetaData?.portfolioV2?.type}
          portfolioId={portfolioId}
        />
      );
    case portfolioTabs.OPTIMIZATION:
      return <Optimize portfolioId={portfolioId} />;
    case portfolioTabs.SIMULATIONS:
      return (
        <FeatureSwitch
          features={[FEATURE_FLAGS.SIMULATIONS]}
          renderOld={() => null}
          renderNew={() => (
            <ErrorBoundary>
              {activeTab === portfolioTabs.SIMULATIONS && <Simulations portfolioId={portfolioId} />}
            </ErrorBoundary>
          )}
        />
      );

    case portfolioTabs.SETTINGS:
      if (activeSettingsTab === settingsTabs.GENERAL) {
        return <PortfolioEditGeneral portfolio={portfolioMetaData?.portfolioV2} />;
      }
      if (activeSettingsTab === settingsTabs.FUNNEL) {
        return <PortfolioFunnelSettings />;
      }
      if (activeSettingsTab === settingsTabs.IMPACT_GROUPS) {
        return <PortfolioImpactGroupsSettings />;
      }
      if (activeSettingsTab === settingsTabs.CONTENT_RULES) {
        return <PortfolioContentRules />;
      }
      if (activeSettingsTab === settingsTabs.ATTRIBUTION) {
        return <AttributionRules />;
      }
      if (activeSettingsTab === settingsTabs.EVENTS) {
        return <PortfolioEvents />;
      }
      return null;
    default:
      return null;
  }
};
