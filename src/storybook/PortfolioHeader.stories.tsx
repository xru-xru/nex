import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { NexoyaPortfolioBudget, NexoyaPortfolioType } from '../types';

import { PortfolioBricks } from '../components/PortfolioHeader/PortfolioBricks';
import { PortfolioHeaderTitle } from '../components/PortfolioHeader/PortfolioHeaderTitle';
import { mock_decorators } from '../../.storybook/preview.jsx';

export default {
  title: 'Portfolio/Header',
  decorators: mock_decorators(),
} as Meta;

const BudgetBricksStory: StoryFn = () => (
  <PortfolioBricks
    portfolio={{
      type: NexoyaPortfolioType.Budget,
      budget: {
        spent: { totalSpent: 50000, dailySpendings: [] },
        total: 100000,
      } as unknown as NexoyaPortfolioBudget,
      start: new Date('2022-01-01'),
      end: new Date('2022-12-31'),
    }}
    currency="CHF"
    numberFormat="de-CH"
    funnelStepTitle="Conversions"
  />
);

const TargetBricksStory: StoryFn = () => (
  <PortfolioBricks
    portfolio={{
      type: NexoyaPortfolioType.CostPer,
      budget: {
        spent: { totalSpent: 50000, dailySpendings: [] },
        total: 100000,
      } as unknown as NexoyaPortfolioBudget,
      start: new Date('2022-01-01'),
      end: new Date('2022-12-31'),
    }}
    currency="CHF"
    numberFormat="de-CH"
    funnelStepTitle="Conversions"
  />
);

const HeaderTitleStory = () => (
  <PortfolioHeaderTitle title="Nexoya's portfolio title" description="This is a description for Nexoya's portfolio" />
);

export const TargetBricks = TargetBricksStory.bind({});
export const BudgetBricks = BudgetBricksStory.bind({});
export const HeaderTitle = HeaderTitleStory.bind({});

HeaderTitle.args = {};
TargetBricks.args = {};
BudgetBricks.args = {};
