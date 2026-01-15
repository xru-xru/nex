import React, { useCallback, useState } from 'react';

import styled from 'styled-components';
import { nexyColors } from 'theme';

import { NexoyaDashboardUrl } from 'types';

import ButtonAsync from 'components/ButtonAsync';
import ButtonBase from 'components/ButtonBase';
import { Tabs, TabsContent, TabsNav } from 'components/Tabs';
import { PATHS } from 'routes/paths';

import { colorByKey } from 'theme/utils';

interface Props {
  data: NexoyaDashboardUrl[];
}
const NavTabStyled = styled(ButtonBase)`
  padding: 10px 20px;
  margin-right: 15px;
  margin-bottom: -1px;
  color: ${({ isActive }) => (isActive ? colorByKey('darkGreyTwo') : colorByKey('cloudyBlue'))};
  transition: color 0.175s;
  display: inline-block;

  font-size: 16px;
  letter-spacing: 0.8px;

  &:first-letter {
    text-transform: uppercase;
  }

  border-bottom: ${({ theme, isActive }) => (isActive ? `2px solid ${theme.colors.primary}` : 'none')};

  &:hover {
    color: ${({ isActive }) => (isActive ? 'inherit' : colorByKey('blueGrey'))};
  }
`;

const TabsHeaderWrap = styled.div`
  border-bottom: 1px solid ${nexyColors.paleLilac};
`;

const FrameWrapStyled = styled.div`
  padding: 48px 0;
`;

const ButtonAsyncStyled = styled(ButtonAsync)`
  float: right;
`;

function CustomDashboard({ data }: Props) {
  const serializedTabName = useCallback((item: string) => (item || '')?.toLowerCase().replace(' ', '-'), []);
  const [activeTab, setActiveTab] = useState(serializedTabName(data[0]?.name));

  return (
    <>
      <Tabs defaultTab={serializedTabName(data[0]?.name)} controlledTab={activeTab || serializedTabName(data[0]?.name)}>
        <TabsHeaderWrap>
          {data.map((dash, index) => (
            <TabsNav
              key={index}
              tab={serializedTabName(dash.name)}
              component={NavTabStyled}
              onClick={() => setActiveTab(serializedTabName(dash.name))}
            >
              {dash.name}
            </TabsNav>
          ))}
          <ButtonAsyncStyled color="primary" variant="contained" onClick={() => window.open(PATHS.WEBSITE.CONTACT)}>
            + Add dashboard
          </ButtonAsyncStyled>
        </TabsHeaderWrap>
        <FrameWrapStyled>
          {data.map((dash, index) => (
            <TabsContent key={index} tab={serializedTabName(dash.name)}>
              <iframe frameBorder="0" src={dash.url} title={dash.name} width="100%" height="5000px" />
            </TabsContent>
          ))}
        </FrameWrapStyled>
      </Tabs>
    </>
  );
}

export default CustomDashboard;
