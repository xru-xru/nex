import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { mock_decorators } from '../../../.storybook/preview.jsx';
import { OptimizationView } from '../../routes/portfolio/components/OptimizationView';

export default {
  title: 'Portfolio Events/Optimization',
  component: OptimizationView,
  decorators: mock_decorators(),
  parameters: {
    docs: {
      description: {
        component: 'This story demonstrates the Optimization view component with pre-populated events from the store.',
      },
    },
    controls: {
      sort: 'requiredFirst',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    portfolioEvents: {
      control: 'object',
      description: 'Portfolio events to display in the optimization',
    },
  },
} as Meta;

const baseOptimization = {
  optimizationId: 143117,
  title: 'Optimization Jun 04 - Jun 10, 2025',
  description: '',
  appliedAt: null,
  start: '2025-06-04',
  end: '2025-06-10',
  totalBudget: 12558.92,
  status: 'RUNNING',
  target: null,
  onlyVisibleToSupportUsers: false,
  user: {
    __typename: 'User',
    firstname: 'Storybook',
    lastname: 'Support',
  },
  tasks: {
    __typename: 'OptimizationTasks',
    FETCHING_DATA: 'SUCCESSFUL',
    COMPUTING_BUDGET: 'SUCCESSFUL',
    RUNNING_OPTIMIZATION: 'SUCCESSFUL',
    GENERATING_BUDGET_PROPOSAL: 'RUNNING',
    PROPOSAL_WAITING: 'PENDING',
    APPLYING_BUDGET_PROPOSAL: 'PENDING',
  },
};

const Template: StoryFn = ({ portfolioEvents }) => {
  const optimization = {
    ...baseOptimization,
    portfolioEvents,
  };
  return <OptimizationView portfolioId={1} resetState={() => null} optimization={optimization} />;
};

export const Default = Template.bind({});
Default.args = {
  portfolioEvents: [
    {
      __typename: 'PortfolioEventSnapshot',
      name: 'High season',
      start: '2025-05-11',
      end: '2025-08-10',
    },
  ],
};
