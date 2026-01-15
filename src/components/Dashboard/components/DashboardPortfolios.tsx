import React from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaPortfolioDashboardElement } from 'types';

import Portfolios2Filter from '../../../routes/portfolios/PortfoliosFilter';
import LoadingPlaceholder from 'components/LoadingPlaceholder';

import { colorByKey } from '../../../theme/utils';
import * as Styles from '../styles/Dashboard';

import { portfoliosTabs } from '../../../configs/portfolio';
import ButtonBase from '../../ButtonBase';
import { DateSelector, IDateRangeShort } from '../../DateSelector';
import { Tabs, TabsContent, TabsNav } from '../../Tabs';
import DashboardPortfoliosHeader from './DashboardPortfoliosHeader';
import DashboardPortfoliosRow from './DashboardPortfoliosRow';

const allowedTabs = [portfoliosTabs.ACTIVE, portfoliosTabs.COMPLETED] as const;

const TabsNavWrapperStyled = styled.div`
  display: flex;
  margin-bottom: 24px;
  justify-content: space-between;
`;

const NavTabStyled = styled(ButtonBase)`
  padding: 16px 16px 12px;
  margin-bottom: -1px;
  color: ${({ isActive }) => (isActive ? colorByKey('darkGreyTwo') : colorByKey('cloudyBlue'))};
  transition: color 0.175s;
  display: inline-block;

  font-size: 16px;

  &:first-letter {
    text-transform: uppercase;
  }

  border-bottom: ${({ theme, isActive }) => (isActive ? `2px solid ${theme.colors.primary}` : 'none')};

  &:hover {
    color: ${({ isActive }) => (isActive ? 'inherit' : colorByKey('blueGrey'))};
  }
`;

type Props = {
  loading: boolean;
  data: NexoyaPortfolioDashboardElement[];
  onDatesChange: (props: IDateRangeShort) => void;
  from: string;
  to: string;
};

export default function DashboardPortfolios({ loading, data, from, to, onDatesChange }: Props) {
  const [activeTab, setActiveTab] = React.useState<typeof allowedTabs[number]>();
  // const activePortfolios = data.filter((portfolio) => portfolio.endDate > new Date().toISOString());
  // const completedPortfolios = data.filter((portfolio) => portfolio.endDate < new Date().toISOString());

  return (
    <Styles.Portfolios>
      {loading ? (
        <Styles.LoaderWrap table>
          <LoadingPlaceholder />
        </Styles.LoaderWrap>
      ) : (
        <>
          <Tabs defaultTab={activeTab || portfoliosTabs.ACTIVE} controlledTab={activeTab || portfoliosTabs.ACTIVE}>
            <TabsNavWrapperStyled>
              <div>
                <TabsNav
                  tab={portfoliosTabs.ACTIVE}
                  component={NavTabStyled}
                  // disabled={!completedPortfolios.length}
                  onClick={() => setActiveTab(portfoliosTabs.ACTIVE)}
                >
                  Active
                </TabsNav>
                <TabsNav
                  tab={portfoliosTabs.COMPLETED}
                  component={NavTabStyled}
                  // disabled={!completedPortfolios.length}
                  onClick={() => setActiveTab(portfoliosTabs.COMPLETED)}
                >
                  Completed
                </TabsNav>
              </div>
              <DateSelector
                dateFrom={dayjs(from).toDate()}
                dateTo={dayjs(to).toDate()}
                onDateChange={onDatesChange}
                hideFutureQuickSelection
                useNexoyaDateRanges={true}
              />
            </TabsNavWrapperStyled>

            <Portfolios2Filter />
            <TabsContent tab={portfoliosTabs.ACTIVE}>
              <DashboardPortfoliosHeader />

              {data.map((portfolio, i) => (
                <DashboardPortfoliosRow key={i} data={portfolio} counter={i} />
              ))}
            </TabsContent>
            <TabsContent tab={portfoliosTabs.COMPLETED}>
              <DashboardPortfoliosHeader />
              {data.map((portfolio, i) => (
                <DashboardPortfoliosRow key={i} data={portfolio} counter={i} />
              ))}
            </TabsContent>
          </Tabs>
        </>
      )}
    </Styles.Portfolios>
  );
}
