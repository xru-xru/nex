import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { PortfolioRuleCard } from '../../routes/portfolio/Settings/PortfolioRuleCard';
import NoDataFound from '../../routes/portfolio/NoDataFound';
import SvgGauge from '../../components/icons/Gauge';
import { mock_decorators } from '../../../.storybook/preview.jsx';

export default {
  title: 'Portfolio Rules/No data found',
  component: PortfolioRuleCard,
  decorators: mock_decorators(),
} as Meta;

const Template: StoryFn = () => (
  <NoDataFound
    style={{ height: 200 }}
    icon={<SvgGauge />}
    title="You don't have any content rules created yet"
    subtitle="Create a content rule to get started by pressing the green button above"
  />
);

export const Default = Template.bind({});
