import { Tabs, TabsNav } from '../Tabs';
import { contentTabs, portfolioTabs } from '../../configs/portfolio';
import * as Styles from '../../routes/portfolio/styles/Portfolio';
import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import React, { useEffect } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import clsx from 'clsx';
import { isPresenterMode } from '../../utils/isPresenterMode';
import { useDiscoverContentsStore } from '../../store/discovered-contents';

const ALLOWED_CONTENT_TABS = [
  contentTabs.CONTENT,
  contentTabs.DISCOVERED_CONTENTS,
  contentTabs.UNAPPLIED_RULES,
  contentTabs.REMOVED_CONTENTS,
];

interface Props {
  portfolioId: number;
  sidebarWidth: string;
}

export const PortfolioContentTabs = ({ portfolioId, sidebarWidth }: Props) => {
  const [activeTab] = useQueryParam('activeTab', StringParam);
  const [activeContentTab, setActiveContentTab] = useQueryParam('activeContentTab', StringParam);

  useEffect(() => {
    if (activeTab === portfolioTabs.CONTENT && !activeContentTab) {
      setActiveContentTab(contentTabs.CONTENT);
    }
  }, [activeTab]);

  const handleContentTabChange = (tab: string) => {
    setActiveContentTab(tab);
    track(EVENT.PORTFOLIO_CONTENT_TAB_CHANGE(tab), {
      portfolioId,
    });
  };

  // Get new updates flag from the store.
  const tabNewUpdates = useDiscoverContentsStore((state) => state.tabNewUpdates);

  return activeTab === portfolioTabs.CONTENT ? (
    <div
      className={clsx('flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-8')}
      style={{ marginLeft: isPresenterMode() ? 0 : sidebarWidth, transition: 'margin-left 0.25s ease-in-out' }}
    >
      <div>
        <Tabs
          defaultTab={ALLOWED_CONTENT_TABS.includes(activeContentTab) ? activeContentTab : contentTabs.CONTENT}
          controlledTab={ALLOWED_CONTENT_TABS.includes(activeContentTab) ? activeContentTab : contentTabs.CONTENT}
        >
          <TabsNav
            size="small"
            tab={contentTabs.CONTENT}
            component={Styles.NavTabStyled}
            onClick={() => handleContentTabChange(contentTabs.CONTENT)}
          >
            Content
          </TabsNav>
          <TabsNav
            size="small"
            tab={contentTabs.DISCOVERED_CONTENTS}
            component={Styles.NavTabStyled}
            hasNewUpdates={tabNewUpdates?.discoveredContents}
            onClick={() => handleContentTabChange(contentTabs.DISCOVERED_CONTENTS)}
          >
            Discovered contents
          </TabsNav>
          <TabsNav
            size="small"
            tab={contentTabs.UNAPPLIED_RULES}
            component={Styles.NavTabStyled}
            hasNewUpdates={tabNewUpdates?.unappliedRules}
            onClick={() => handleContentTabChange(contentTabs.UNAPPLIED_RULES)}
          >
            Unapplied rules
          </TabsNav>
          <TabsNav
            size="small"
            tab={contentTabs.REMOVED_CONTENTS}
            component={Styles.NavTabStyled}
            hasNewUpdates={tabNewUpdates?.removedContents}
            onClick={() => handleContentTabChange(contentTabs.REMOVED_CONTENTS)}
          >
            Removed contents
          </TabsNav>
        </Tabs>
      </div>
    </div>
  ) : null;
};
