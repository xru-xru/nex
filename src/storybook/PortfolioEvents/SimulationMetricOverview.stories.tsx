import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { mock_decorators } from '../../../.storybook/preview.jsx';
import { MetricOverview } from '../../routes/portfolio/components/Simulations/charts/MetricOverview';
import usePortfolioEventsStore from '../../store/portfolio-events';

const mockEvents = [
  {
    __typename: 'PortfolioEventSnapshot',
    portfolioEventId: 2936,
    name: 'Seasonal sale',
    start: '2025-06-11',
    end: '2025-06-27',
    category: 'PROMOTION_AND_DISCOUNTS',
    impact: 'LARGE',
    contentIds: [],
  },
  {
    __typename: 'PortfolioEventSnapshot',
    portfolioEventId: 2937,
    name: 'High season',
    start: '2025-05-11',
    end: '2025-08-10',
    category: 'POSITIVE_EXTERNAL_EFFECTS',
    impact: 'SMALL',
    contentIds: [],
  },
];

const mockDailyMetrics = [
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-16',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 7,
      changePercent: 0,
      currentScenario: 7,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 300451,
      changePercent: 0,
      currentScenario: 300451,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-17',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 281999,
      changePercent: 0,
      currentScenario: 281999,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-18',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 284929,
      changePercent: 0,
      currentScenario: 284929,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-19',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 291779,
      changePercent: 0,
      currentScenario: 291779,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-20',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 282390,
      changePercent: 0,
      currentScenario: 282390,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-21',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 272531,
      changePercent: 0,
      currentScenario: 272531,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-22',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 284744,
      changePercent: 0,
      currentScenario: 284744,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-23',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 7,
      changePercent: 0,
      currentScenario: 7,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 300451,
      changePercent: 0,
      currentScenario: 300451,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-24',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 281999,
      changePercent: 0,
      currentScenario: 281999,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-25',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 284929,
      changePercent: 0,
      currentScenario: 284929,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-26',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 291779,
      changePercent: 0,
      currentScenario: 291779,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-27',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 282390,
      changePercent: 0,
      currentScenario: 282390,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-28',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 272531,
      changePercent: 0,
      currentScenario: 272531,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-29',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 8,
      changePercent: 0,
      currentScenario: 8,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 284744,
      changePercent: 0,
      currentScenario: 284744,
      lowerIsBetter: false,
    },
  },
  {
    __typename: 'ScenarioDailyMetric',
    day: '2025-06-30',
    costPer: {
      __typename: 'ScenarioMetric',
      baseScenario: 7,
      changePercent: 0,
      currentScenario: 7,
      lowerIsBetter: true,
    },
    roas: null,
    value: {
      __typename: 'ScenarioMetric',
      baseScenario: 300451,
      changePercent: 0,
      currentScenario: 300451,
      lowerIsBetter: false,
    },
  },
];

const setStoreData = (events: any[]) => {
  const { setPortfolioEvents, setShowEvents } = usePortfolioEventsStore.getState();
  setShowEvents(true);
  setPortfolioEvents(events);
};

export default {
  title: 'Portfolio Events/Metric Overview',
  component: MetricOverview,
  decorators: mock_decorators(),
  parameters: {
    docs: {
      description: {
        component: 'This story demonstrates the MetricOverview component with visible portfolio events.',
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
      description: 'Portfolio events to display in the chart',
    },
  },
} as Meta;

const Template: StoryFn = ({ portfolioEvents }) => {
  setStoreData(portfolioEvents);
  return (
    <MetricOverview
      dailyMetrics={mockDailyMetrics}
      isBaseScenarioSelected={false}
      title="Budget"
      numberType="currency"
      metricSwitch="value"
      portfolioEvents={portfolioEvents}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  portfolioEvents: mockEvents,
};
