import { Tabs, TabsNav } from '../Tabs';
import { portfolioTabs, settingsTabs } from '../../configs/portfolio';
import * as Styles from '../../routes/portfolio/styles/Portfolio';
import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import React, { useEffect } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import clsx from 'clsx';
import { isPresenterMode } from '../../utils/isPresenterMode';
import { useUnsavedChanges } from '../../context/UnsavedChangesProvider';
import { useHeader } from '../../context/HeaderProvider';
import PortfolioFeatureSwitch from '../PortfolioFeatureSwitch';
import { PORTFOLIO_FEATURE_FLAGS } from '../../constants/featureFlags';
import usePortfolioMetaStore from '../../store/portfolio-meta';

const ALLOWED_SETTINGS_TABS = [
  settingsTabs.GENERAL,
  settingsTabs.FUNNEL,
  settingsTabs.IMPACT_GROUPS,
  settingsTabs.CONTENT_RULES,
  settingsTabs.ATTRIBUTION,
  settingsTabs.EVENTS,
];

interface Props {
  portfolioId: number;
  sidebarWidth: string;
}

const HORIZONTAL_NAVIGATION_HEIGHT = '52px';

export const PortfolioSettingsTabs = ({ portfolioId, sidebarWidth }: Props) => {
  const [activeTab] = useQueryParam('activeTab', StringParam);
  const [activeSettingsTab, setActiveSettingsTab] = useQueryParam('activeSettingsTab', StringParam);

  const { portfolioMeta } = usePortfolioMetaStore();
  const { setHasUnsavedChanges, handleNavigation } = useUnsavedChanges();
  const { headerHeight } = useHeader();
  const isAttributed = portfolioMeta?.isAttributed;

  useEffect(() => {
    if (activeTab === portfolioTabs.SETTINGS && !activeSettingsTab) {
      setActiveSettingsTab(settingsTabs.GENERAL);
    }
  }, [activeTab]);

  const handleSettingsTabChange = (tab: string) => {
    handleNavigation(() => {
      setHasUnsavedChanges(false);
      setActiveSettingsTab(tab);
      track(EVENT.PORTFOLIO_SETTINGS_TAB_CHANGE(tab), {
        portfolioId,
      });
    });
  };

  return activeTab === portfolioTabs.SETTINGS ? (
    <div
      className={clsx('sticky z-[1] flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-8')}
      style={{
        marginLeft: isPresenterMode() ? 0 : sidebarWidth,
        transition: 'margin-left 0.25s ease-in-out',
        top: `calc(${headerHeight} + ${HORIZONTAL_NAVIGATION_HEIGHT})`,
      }}
    >
      <div>
        <Tabs
          defaultTab={ALLOWED_SETTINGS_TABS.includes(activeSettingsTab) ? activeSettingsTab : settingsTabs.GENERAL}
          controlledTab={ALLOWED_SETTINGS_TABS.includes(activeSettingsTab) ? activeSettingsTab : settingsTabs.GENERAL}
        >
          <TabsNav
            size="small"
            tab={settingsTabs.GENERAL}
            component={Styles.NavTabStyled}
            onClick={() => handleSettingsTabChange(settingsTabs.GENERAL)}
          >
            General
          </TabsNav>
          <TabsNav
            size="small"
            tab={settingsTabs.FUNNEL}
            component={Styles.NavTabStyled}
            onClick={() => handleSettingsTabChange(settingsTabs.FUNNEL)}
          >
            Funnel
          </TabsNav>
          <PortfolioFeatureSwitch
            features={[PORTFOLIO_FEATURE_FLAGS.SELF_SERVICE_PORTFOLIO]}
            renderOld={() => null}
            renderNew={() => (
              <TabsNav
                size="small"
                tab={settingsTabs.CONTENT_RULES}
                component={Styles.NavTabStyled}
                onClick={() => handleSettingsTabChange(settingsTabs.CONTENT_RULES)}
              >
                Content rules
              </TabsNav>
            )}
          />

          {isAttributed ? (
            <TabsNav
              size="small"
              tab={settingsTabs.ATTRIBUTION}
              component={Styles.NavTabStyled}
              onClick={() => handleSettingsTabChange(settingsTabs.ATTRIBUTION)}
            >
              Attribution
            </TabsNav>
          ) : null}

          {!isAttributed ? (
            <TabsNav
              size="small"
              tab={settingsTabs.IMPACT_GROUPS}
              component={Styles.NavTabStyled}
              onClick={() => handleSettingsTabChange(settingsTabs.IMPACT_GROUPS)}
            >
              Impact groups
            </TabsNav>
          ) : null}
          <TabsNav
            size="small"
            tab={settingsTabs.EVENTS}
            component={Styles.NavTabStyled}
            onClick={() => handleSettingsTabChange(settingsTabs.EVENTS)}
          >
            Events
          </TabsNav>
        </Tabs>
      </div>
    </div>
  ) : null;
};
