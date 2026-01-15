import React, { useEffect, useState } from 'react';

import { track } from '../constants/datadog';
import { EVENT } from '../constants/events';
import usePresenterMode from '../hooks/usePresenterMode';

import Button from '../components/Button';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import MainContent from '../components/MainContent';
import TabsContent from '../components/Tabs/TabsContent';
import TabsNav from '../components/Tabs/TabsNav';
import TabsRouted from '../components/Tabs/TabsRouted';
import { AddCircleIcon } from '../components/icons';
import SectionHeader from '../components/layout/SectionHeader/SectionHeader';
import ScrollToTop from 'components/ScrollToTop';

import '../theme/theme';

import Integrations from './settings/Integrations';
import InviteUserDialog from './settings/InviteUserDialog';
import SettingsOptionsDropdown from './settings/SettingsOptionsDropdown';
import TeamMembers from './settings/TeamMembers';
import TeamMeta from './settings/TeamMeta';
import { DemoSettings } from './settings/DemoSettings';
import { FEATURE_FLAGS } from 'constants/featureFlags';
import FeatureSwitch from 'components/FeatureSwitch';
import { FeatureFlagsManager } from './settings/FeatureFlagsManager';
import useUserStore from 'store/user';
import { CurrencyExchangeRates } from './settings/CurrencyExchangeRates';
import { NavTabStyled } from './portfolio/styles/Portfolio';
import styled from 'styled-components';

const HeaderStyled = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;

  & > div:first-child {
    margin-right: 25px;
    width: 50px;
    height: 50px;
  }
`;
const Settings = () => {
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const { isPresenterMode } = usePresenterMode();
  const [allowedTabs, setAllowedTabs] = useState(['team', 'integrations', 'demo', 'currencies']);
  const { isSupportUser } = useUserStore();

  function handleDialogOpen() {
    setDialogIsOpen(true);
  }

  function handleDialogClose() {
    setDialogIsOpen(false);
  }

  useEffect(() => {
    // Dynamic allowed tabs based on user role
    if (isSupportUser) {
      setAllowedTabs((prevState) => [...prevState, 'feature-flags']);
    }
  }, [isSupportUser]);

  return (
    <ScrollToTop>
      <MainContent>
        <HeaderStyled>
          <TeamMeta />
          <SectionHeader.Right>
            <SettingsOptionsDropdown />
            {!isPresenterMode && (
              <Button
                data-cy="inviteMemberBtn"
                variant="contained"
                color="primary"
                onClick={() => {
                  track(EVENT.SETTINGS_INVITE_MEMBER);
                  handleDialogOpen();
                }}
                iconBefore={AddCircleIcon}
              >
                Invite Member
              </Button>
            )}
          </SectionHeader.Right>
        </HeaderStyled>
        <TabsRouted defaultTab="integrations" allowedTabs={allowedTabs}>
          <div
            style={{
              marginBottom: '15px',
              display: 'flex',
            }}
          >
            <TabsNav data-cy="teamMembers" tab="team" component={NavTabStyled}>
              Team Members
            </TabsNav>
            <TabsNav data-cy="integrations" tab="integrations" component={NavTabStyled}>
              Integrations
            </TabsNav>
            {isSupportUser && (
              <TabsNav data-cy="featureFlags" tab="feature-flags" component={NavTabStyled}>
                Team Feature Flags
              </TabsNav>
            )}
            <FeatureSwitch
              features={[FEATURE_FLAGS.NEXOYA_DEMO]}
              renderOld={() => null}
              renderNew={() => (
                <TabsNav tab="demo" component={NavTabStyled}>
                  Demo Settings
                </TabsNav>
              )}
            />
            <TabsNav tab="currencies" component={NavTabStyled}>
              Currencies
            </TabsNav>
          </div>
          <TabsContent tab="team">
            <ErrorBoundary>
              <TeamMembers />
            </ErrorBoundary>
          </TabsContent>
          <TabsContent tab="integrations">
            <ErrorBoundary>
              <Integrations />
            </ErrorBoundary>
          </TabsContent>
          <TabsContent tab="demo">
            <ErrorBoundary>
              <DemoSettings />
            </ErrorBoundary>
          </TabsContent>
          <TabsContent tab="currencies">
            <ErrorBoundary>
              <CurrencyExchangeRates />
            </ErrorBoundary>
          </TabsContent>
          {isSupportUser && (
            <TabsContent tab="feature-flags">
              <ErrorBoundary>
                <FeatureFlagsManager />
              </ErrorBoundary>
            </TabsContent>
          )}
        </TabsRouted>
      </MainContent>
      <InviteUserDialog isOpen={dialogIsOpen} onClose={handleDialogClose} />
    </ScrollToTop>
  );
};

export default Settings;
