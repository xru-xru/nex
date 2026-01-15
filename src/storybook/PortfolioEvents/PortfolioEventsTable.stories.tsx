import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { mock_decorators } from '../../../.storybook/preview.jsx';
import usePortfolioEventsStore from '../../store/portfolio-events';
import { PortfolioEvents } from '../../routes/portfolio/Settings/PortfolioEvents';

export default {
  title: 'Portfolio Events/Portfolio events table',
  component: PortfolioEvents,
  decorators: mock_decorators(),
  parameters: {
    docs: {
      description: {
        component:
          'This story demonstrates the Portfolio events table component with pre-populated events from the store.',
      },
    },
    controls: {
      sort: 'requiredFirst',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    events: {
      control: 'object',
      description: 'Portfolio events to display on the chart',
    },
  },
} as Meta;

const mockEvents = [
  {
    __typename: 'PortfolioEvent',
    portfolioEventId: 2929,
    name: 'Tracking issues',
    category: 'TRACKING_ISSUE',
    created: '2025-06-04',
    description: '',
    start: '2025-03-17',
    end: '2025-03-23',
    impact: 'LARGE',
    includesAllContents: true,
    assetUrl: null,
    contentRules: [],
    assignedContents: [],
  },
  {
    __typename: 'PortfolioEvent',
    portfolioEventId: 2930,
    name: 'Product launch',
    category: 'PRODUCT_LAUNCH',
    created: '2025-06-04',
    description: '',
    start: '2025-03-27',
    end: '2025-04-02',
    impact: 'LARGE',
    includesAllContents: true,
    assetUrl: null,
    contentRules: [],
    assignedContents: [],
  },
  {
    __typename: 'PortfolioEvent',
    portfolioEventId: 2931,
    name: 'Main competitor big sale',
    category: 'NEGATIVE_EXTERNAL_EFFECTS',
    created: '2025-06-04',
    description: '',
    start: '2025-04-04',
    end: '2025-04-08',
    impact: 'SMALL',
    includesAllContents: true,
    assetUrl: null,
    contentRules: [],
    assignedContents: [],
  },
  {
    __typename: 'PortfolioEvent',
    portfolioEventId: 2932,
    name: 'Social media trend',
    category: 'POSITIVE_EXTERNAL_EFFECTS',
    created: '2025-06-04',
    description: 'Social media trend related to our product category',
    start: '2025-04-15',
    end: '2025-05-17',
    impact: 'SMALL',
    includesAllContents: true,
    assetUrl: null,
    contentRules: [],
    assignedContents: [],
  },
  {
    __typename: 'PortfolioEvent',
    portfolioEventId: 2934,
    name: 'Brand Awareness Push',
    category: 'BRAND_AWARENESS',
    created: '2025-06-04',
    description: '',
    start: '2025-04-28',
    end: '2025-05-08',
    impact: 'SMALL',
    includesAllContents: true,
    assetUrl: null,
    contentRules: [],
    assignedContents: [],
  },
  {
    __typename: 'PortfolioEvent',
    portfolioEventId: 2937,
    name: 'High season',
    category: 'POSITIVE_EXTERNAL_EFFECTS',
    created: '2025-06-04',
    description: '',
    start: '2025-05-11',
    end: '2025-08-10',
    impact: 'SMALL',
    includesAllContents: true,
    assetUrl: null,
    contentRules: [],
    assignedContents: [],
  },
  {
    __typename: 'PortfolioEvent',
    portfolioEventId: 2933,
    name: 'Price increase',
    category: 'PRICE_INCREASE',
    created: '2025-06-04',
    description: '',
    start: '2025-05-18',
    end: '2025-05-24',
    impact: 'LARGE',
    includesAllContents: true,
    assetUrl: null,
    contentRules: [],
    assignedContents: [],
  },
  {
    __typename: 'PortfolioEvent',
    portfolioEventId: 2935,
    name: 'Product launch',
    category: 'PRODUCT_LAUNCH',
    created: '2025-06-04',
    description: '',
    start: '2025-05-27',
    end: '2025-06-02',
    impact: 'SMALL',
    includesAllContents: true,
    assetUrl: null,
    contentRules: [],
    assignedContents: [],
  },
  {
    __typename: 'PortfolioEvent',
    portfolioEventId: 2936,
    name: 'Seasonal sale',
    category: 'PROMOTION_AND_DISCOUNTS',
    created: '2025-06-04',
    description: 'Large sale we do every half a year',
    start: '2025-06-11',
    end: '2025-06-17',
    impact: 'LARGE',
    includesAllContents: true,
    assetUrl: null,
    contentRules: [],
    assignedContents: [],
  },
];

const setStoreData = (events: any[]) => {
  const { setPaginatedPortfolioEvents } = usePortfolioEventsStore.getState();

  setPaginatedPortfolioEvents(events, 0);
};

const Template: StoryFn = ({ events }) => {
  setStoreData(events);
  return <PortfolioEvents />;
};

export const Default = Template.bind({});
Default.args = {
  events: mockEvents,
};
