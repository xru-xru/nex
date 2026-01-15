import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { PreviewEditDialog } from '../../../routes/portfolio/components/Content/PortfolioRule/PreviewEditDialog';
import { NexoyaApplicableContentRule, NexoyaContentRule, NexoyaDiscoveredContent } from '../../../types';
import { mock_decorators } from '../../../../.storybook/preview';

export default {
  title: 'Portfolio Rules/Content/PreviewEditDialog',
  component: PreviewEditDialog,
  decorators: mock_decorators(),
} as Meta;

const mockRule: NexoyaContentRule = {
  __typename: 'ContentRule',
  contentRuleId: 1,
  name: 'Test Rule',
  filters: null,
  funnelStepMappings: [],
  appliedDiscoveredContents: [],
  matchingDiscoveredContentsCount: 0,
  portfolioId: 1,
  teamId: 1,
};

const mockNewMatchingDiscoveredContents: NexoyaDiscoveredContent[] = [
  {
    content: { contentId: 1, title: 'Matching Content 1' },
    contentRules: [
      {
        __typename: 'ApplicableContentRule',
        contentRule: { ...mockRule, contentRuleId: 2, name: 'Another Rule' },
        isApplied: false,
      },
      {
        __typename: 'ApplicableContentRule',
        contentRule: { ...mockRule, contentRuleId: 3, name: 'Applicablle rule 2' },
        isApplied: false,
      },
      {
        __typename: 'ApplicableContentRule',
        contentRule: { ...mockRule, contentRuleId: 4, name: 'Applied rule 4' },
        isApplied: true,
      },
    ],
  },
];

const mockNoLongerMatchingDiscoveredContents: NexoyaDiscoveredContent[] = [
  // @ts-ignore
  {
    content: {
      contentId: 2,
      title: 'No Longer Matching Content',
      contentType: { name: 'Campaign', collection_type_id: 1 },
      metadataHistory: null,
      provider: { provider_id: 1 },
      sourceProvider: { provider_id: 1 },
      teamId: 1,
    },
    contentRules: [], // No rules available for this content
  },
];

const Template: StoryFn = (args) => (
  <PreviewEditDialog
    isOpen={true}
    onCancel={() => {}}
    onConfirm={() => {}}
    loading={false}
    getRules={(dsc) => dsc.contentRules}
    getRuleName={(rule: NexoyaApplicableContentRule) => rule.contentRule.name}
    type="content rule"
    newMatchingDiscoveredContents={mockNewMatchingDiscoveredContents}
    noLongerMatchingDiscoveredContents={mockNoLongerMatchingDiscoveredContents}
    contentActions={[]}
    setContentActions={() => {}}
    rule={mockRule}
    {...args}
  />
);

export const Default = Template.bind({});
// Enable play function once Storybook test environment supports necessary features
// Default.play = async () => {
//   // Verify both contents are displayed
//   await expect(screen.findByText('Matching Content 1')).resolves.toBeInTheDocument();
//   await expect(screen.findByText('No Longer Matching Content')).resolves.toBeInTheDocument();
//
//   const matchingContentRow = await screen.findByText('Matching Content 1');
//   const matchingContentSelect = matchingContentRow.closest('div.grid').querySelector('button');
//   await userEvent.click(matchingContentSelect);
//
//   const anotherRuleOption = await screen.findByRole('option', { name: /Another rule/i });
//   await userEvent.click(anotherRuleOption);
//
//   const noMatchingContentRow = await screen.findByText(/No longer matching content/i);
//   const noMatchingContentSelect = noMatchingContentRow.closest('div.grid').querySelector('button');
//   await userEvent.click(noMatchingContentSelect);
//
//   await userEvent.click(await screen.findByText(/Remove from portfolio/i));
//
//   // Interact with "No Longer Matching Content"
//   const noLongerMatchingContentRow = await screen.findByText('No Longer Matching Content');
//   await expect(
//     within(noLongerMatchingContentRow.closest('div.grid')).findByText('No metrics'),
//   ).resolves.toBeInTheDocument();
// };
