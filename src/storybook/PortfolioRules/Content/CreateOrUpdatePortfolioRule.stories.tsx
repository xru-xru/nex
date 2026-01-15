import { Meta, StoryObj } from '@storybook/react';
import CreateOrUpdatePortfolioRule from '../../../routes/portfolio/components/Content/PortfolioRule/CreateOrUpdatePortfolioRule';
import { mock_decorators } from '../../../../.storybook/preview.jsx';
import { expect, fn, screen, userEvent } from '@storybook/test';
import { PortfolioRuleType } from '../../../routes/portfolio/components/Content/PortfolioRule/utils';
import { NexoyaContentFilterFieldName, NexoyaContentFilterOperator } from '../../../types';
import { AVAILABLE_FIELDS_AND_OPERATIONS_QUERY } from '../../../graphql/portfolioRules/queryAvailableFieldsAndOperations';
import { FILTERED_CONTENTS_QUERY } from '../../../graphql/portfolioRules/queryFilteredContents';
import { PROVIDER_SUB_ACCOUNTS_QUERY } from '../../../graphql/portfolioRules/queryProviderSubAccounts';
import { mockTranslationStoreData } from '../../utils';
import { CONTENT_TYPE_SUB_ACCOUNT_NUMBER } from '../../../routes/portfolio/utils/portfolio-rules';
import {
  MOCK_AVAILABLE_FIELDS_AND_OPERATIONS,
  MOCK_FILTERED_CONTENTS,
  MOCK_PROVIDER_SUB_ACCOUNTS,
} from '../../fixtures';

const mocks = [
  {
    request: {
      query: AVAILABLE_FIELDS_AND_OPERATIONS_QUERY,
      variables: {
        providerId: 12,
      },
    },
    result: {
      data: {
        availableFieldOperations: MOCK_AVAILABLE_FIELDS_AND_OPERATIONS,
      },
    },
  },
  {
    request: {
      query: FILTERED_CONTENTS_QUERY,
      variables: {
        inPortfolioOnly: false,
        teamId: 1,
        portfolioId: 1,
        filters: [
          { fieldName: 'sourceProviderId', operator: 'eq', value: { numberArr: [12] } },
          {
            fieldName: 'parentContentId',
            operator: 'eq',
            value: { numberArr: [5629421806, 5629421828, 5629421827, 5629421800, 5629421809, 5629421803, 5629421820] },
          },
        ],
        excludePortfolioContents: false,
      },
    },
    result: {
      data: {
        filterContents: MOCK_FILTERED_CONTENTS,
      },
    },
  },
  {
    request: {
      query: PROVIDER_SUB_ACCOUNTS_QUERY,
      variables: {
        portfolioId: 1,
        teamId: 1,
        excludePortfolioContents: false,
        filters: [
          {
            fieldName: NexoyaContentFilterFieldName.ContentType,
            operator: NexoyaContentFilterOperator.Eq,
            value: { number: CONTENT_TYPE_SUB_ACCOUNT_NUMBER },
          },
        ],
      },
    },
    result: {
      data: {
        filterContents: MOCK_PROVIDER_SUB_ACCOUNTS,
      },
    },
  },
];

const meta: Meta<typeof CreateOrUpdatePortfolioRule> = {
  title: 'Portfolio Rules/Content/CreateOrUpdatePortfolioRule',
  component: CreateOrUpdatePortfolioRule,
  decorators: mock_decorators(mocks),
};

export default meta;

type Story = StoryObj<typeof CreateOrUpdatePortfolioRule>;

const selectChannelAndAdAccount = async (channel = 'Meta', adAccountName = 'Select all') => {
  await userEvent.click(await screen.findByText('Add channel'));
  await userEvent.click(await screen.findByText(channel));

  await userEvent.click(await screen.findByText(adAccountName));

  // The body has pointer-events: none which prevents click-outside behavior
  await userEvent.keyboard('{Escape}');
};

const commonArgs = {
  isOpen: true,
  closeRuleSidepanel: fn(),
  portfolioId: 1,
  loading: {
    create: false,
    update: false,
    preview: false,
  },
  config: {
    type: 'content-rule' as PortfolioRuleType,
    createMutation: () => Promise.resolve(),
    updateMutation: () => Promise.resolve(),
    previewUpdateMutation: fn(),
    labels: {
      name: 'Content Rule',
      saveButton: 'Save Rule',
    },
  },
};

export const Default: Story = {
  args: {
    ...commonArgs,
    portfolioId: 2,
  },
  play: async () => {
    mockTranslationStoreData();
    // expect to see "Add channel", "Add filter", "Save rule"
    await selectChannelAndAdAccount('Meta', 'Select all');
    await expect(await screen.findByText('Add filter')).toBeEnabled();

    await expect(await screen.findByRole('button', { name: /Finish/i })).toBeDisabled();
    await userEvent.click(await screen.findByText('Add filter'));

    // Expect that "Parent content id" is NOT present (merged from ParentContentIdFilter)
    await expect(screen.queryByText('Parent content id')).not.toBeInTheDocument();

    await userEvent.click(await screen.findByText(/Content type/i));
    const campaignElements = await screen.getAllByText(/Campaign/i);
    await userEvent.click(campaignElements[0]); // Click the first one
    await userEvent.click(await screen.findByText(/Adset/i));

    await userEvent.click(await screen.findByText('Add filter'));
    const titleElements = screen.getAllByText(/Title/i);
    await userEvent.click(titleElements[0]); // Click the first one

    await userEvent.type(await screen.findByRole('textbox'), 'Test Title');
    userEvent.keyboard('{enter}');

    await userEvent.type(await screen.findByRole('textbox'), 'Second Test Title');
    userEvent.keyboard('{enter}');

    await userEvent.click(await screen.findByText('Add filter'));
    await userEvent.click(await screen.findByText(/Last measurement date/i));
    await userEvent.click(await screen.findByText(/Select a date/i));
    await userEvent.click(await screen.findByText(/21/i));

    await userEvent.click(await screen.findByText('Add filter'));
    await userEvent.click(await screen.findByText('Bid Strategy'));

    await userEvent.click(await screen.findByText(/Highest volume/i));
    await userEvent.click(await screen.findByText(/Fixed bid/i));
    await userEvent.click(await screen.findByText(/Target roas/i));

    await expect(await screen.findByRole('button', { name: /Finish/i })).toBeEnabled();
    await userEvent.click(await screen.findByRole('button', { name: /Finish/i }));

    const saveRuleButtons = await screen.getAllByRole('button', { name: /Save rule/i });
    await expect(saveRuleButtons[2]).toBeDisabled();

    await userEvent.type(await screen.findByRole('textbox'), 'Test content rule');
    // await expect(await screen.findByRole('button', { name: /Save rule/i })).toBeEnabled();
  },
};

// export const WithExistingRule: Story = {
//   play: async () => {
//     mockTranslationStoreData();
//     // expect to see "Meta", "2 selected", Content Type, "Campaign"
//     await expect(await screen.findByText('Meta')).toBeInTheDocument();
//     await expect(await screen.findByText(/Content Type/i)).toBeInTheDocument();
//     await expect(await screen.findByText(/Campaign/i)).toBeInTheDocument();
//     await expect(await screen.findByText('Update rule')).toBeInTheDocument();
//     await expect(await screen.findByRole('button', { name: /Update rule/i })).toBeEnabled();
//   },
//   args: {
//     ...commonArgs,
//     rule: {
//       __typename: 'ContentRule',
//       contentRuleId: 1,
//       name: 'Existing Rule',
//       filters: {
//         providerId: 12,
//         adAccountIds: [5629421806, 5629421828],
//         contentFilters: [
//           {
//             __typename: 'ContentFilter',
//             fieldName: NexoyaContentFilterFieldName.ContentType,
//             operator: NexoyaContentFilterOperator.Eq,
//             value: {
//               __typename: 'ContentFilterValue',
//               stringArr: ['campaign'],
//               string: null,
//               number: null,
//               numberArr: null,
//               date: null,
//               boolean: null,
//             },
//           },
//         ],
//       },
//       appliedDiscoveredContents: [],
//       funnelStepMappings: [],
//       matchingDiscoveredContentsCount: 0,
//       portfolioId: 1,
//       teamId: 1,
//     },
//   },
// };
