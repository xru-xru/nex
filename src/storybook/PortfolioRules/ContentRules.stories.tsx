import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { PortfolioRuleCard } from '../../routes/portfolio/Settings/PortfolioRuleCard';
import {
  NexoyaContentFilterFieldName,
  NexoyaContentFilterOperator,
  NexoyaContentRule,
  NexoyaFunnelStepType,
  NexoyaFunnelStepV2,
} from '../../types';
import { mock_decorators } from '../../../.storybook/preview.jsx';

export default {
  title: 'Portfolio Rules/Content rule card',
  component: PortfolioRuleCard,
  decorators: mock_decorators(),
  parameters: {
    docs: {
      description: {
        component:
          'Displays a card with details about a specific content rule in the portfolio. This component helps users manage and edit content rules.',
      },
    },
    controls: {
      sort: 'requiredFirst',
    },
  },
  tags: ['autodocs'],
} as Meta;

const mockContentRule: Partial<NexoyaContentRule> = {
  contentRuleId: 3,
  name: 'Google 2025',
  matchingDiscoveredContentsCount: 4,
  filters: {
    __typename: 'ContentRuleFilters',
    adAccountIds: [431168824],
    providerId: 24,
    contentFilters: [
      {
        fieldName: NexoyaContentFilterFieldName.SourceProviderId,
        operator: NexoyaContentFilterOperator.Eq,
        value: {
          date: null,
          number: 24,
          numberArr: null,
          string: null,
          stringArr: null,
        },
      },
      {
        fieldName: NexoyaContentFilterFieldName.ParentContentId,
        operator: NexoyaContentFilterOperator.Eq,
        value: {
          date: null,
          number: 431168824,
          numberArr: null,
          string: null,
          stringArr: null,
        },
      },
      {
        fieldName: NexoyaContentFilterFieldName.ContentType,
        operator: NexoyaContentFilterOperator.Eq,
        value: {
          date: null,
          number: null,
          numberArr: null,
          string: null,
          stringArr: ['campaign'],
        },
      },
      {
        fieldName: NexoyaContentFilterFieldName.Title,
        operator: NexoyaContentFilterOperator.Contains,
        value: {
          date: null,
          number: null,
          numberArr: null,
          string: '2025',
          stringArr: null,
        },
      },
    ],
  },
};

const mockFunnelSteps: NexoyaFunnelStepV2[] = [
  {
    funnelStepId: 29276,
    title: 'AWARENESS',
    type: NexoyaFunnelStepType.Awareness,
  },
  {
    funnelStepId: 29277,
    title: 'CONSIDERATION',
    type: NexoyaFunnelStepType.Consideration,
  },
  {
    funnelStepId: 29278,
    title: 'Start Preonboarding',
    type: NexoyaFunnelStepType.ConversionValue,
  },
  {
    funnelStepId: 29279,
    title: 'Ende preonboarding',
    type: NexoyaFunnelStepType.ConversionValue,
  },
  {
    funnelStepId: 29280,
    title: 'Start Onboarding',
    type: NexoyaFunnelStepType.ConversionValue,
  },
  {
    funnelStepId: 32474,
    title: 'Purchase',
    type: NexoyaFunnelStepType.ConversionValue,
  },
];
const Template: StoryFn = () => (
  <PortfolioRuleCard
    handleEditRule={console.info}
    rule={mockContentRule}
    funnelSteps={mockFunnelSteps}
    config={{
      ruleType: 'content-rule',
      update: {
        mutation: () => void 0,
        loading: false,
      },
    }}
    ruleId={0}
    handleDeleteRule={console.info}
    contentActions={[]}
    setContentActions={console.info}
    resetContentActions={console.info}
    loadingDelete={false}
  />
);

export const Default = Template.bind({});
