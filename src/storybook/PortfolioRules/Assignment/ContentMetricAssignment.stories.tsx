import { Meta, StoryObj } from '@storybook/react';
import { ContentMetricAssignment } from '../../../routes/portfolio/components/Content/PortfolioRule/ContentMetricAssignment';
import { NexoyaFunnelStepType } from '../../../types';
import { expect, fn, screen, waitFor, within } from '@storybook/test';
import { MEASUREMENTS_QUERY } from '../../../graphql/measurement/queryMeasurements';
import { LIST_CONVERSIONS_QUERY } from '../../../graphql/portfolioRules/queryConversions';
import { mock_decorators } from '../../../../.storybook/preview';
import { LIST_FUNNEL_STEP_UTM_VARIABLES } from '../../../graphql/portfolioRules/queryUTMVariables';
import { FUNNEL_STEP_UTM_MAPPING_QUERY } from '../../../graphql/portfolio/queryFunnelStepUtmMapping';
import { FUNNEL_STEP_MAPPING_PRESET_QUERY } from '../../../graphql/portfolioRules/queryFunnelStepMappingPreset';
import { INTEGRATION_QUERY } from '../../../graphql/integration/queryIntegration';
import { GA4_INTEGRATION_ID } from '../../../routes/portfolio/components/Content/PortfolioRule/assignment/UTMTracking';
import { camelCaseToWords } from '../../../routes/portfolio/components/Content/PortfolioRule/utils';
import { MOCK_FUNNEL_STEPS } from '../../fixtures';

const mocks = [
  {
    request: {
      query: MEASUREMENTS_QUERY,
      variables: { providerId: 44 },
    },
    result: {
      data: {
        measurements: [
          {
            measurement_id: 1,
            optimization_target_type: [NexoyaFunnelStepType.Cost],
            name: 'Cost Measurement',
            provider_id: 44,
          },
          {
            measurement_id: 1,
            optimization_target_type: [NexoyaFunnelStepType.Awareness],
            name: 'Awareness Measurement 1',
            provider_id: 44,
          },
          {
            measurement_id: 2,
            optimization_target_type: [NexoyaFunnelStepType.Consideration],
            name: 'Consideration Measurement 1',
            provider_id: 44,
          },
          {
            measurement_id: 2,
            optimization_target_type: [NexoyaFunnelStepType.Conversion],
            name: 'Conversion Measurement 1',
            provider_id: 44,
          },
          {
            measurement_id: 2,
            optimization_target_type: [NexoyaFunnelStepType.ConversionValue],
            name: 'Conversion Value Measurement 1',
            provider_id: 44,
          },
          {
            measurement_id: 2,
            optimization_target_type: [
              NexoyaFunnelStepType.Cost,
              NexoyaFunnelStepType.Awareness,
              NexoyaFunnelStepType.Conversion,
              NexoyaFunnelStepType.Consideration,
              NexoyaFunnelStepType.ConversionValue,
            ],
            name: 'All Measurement 1',
            provider_id: 44,
          },
        ],
      },
    },
  },
  {
    request: {
      query: LIST_CONVERSIONS_QUERY,
      variables: {
        adAccountContentIds: [123],
        teamId: 1,
      },
    },
    result: {
      data: {
        listConversions: [
          {
            accountConversionIds: [1, 2, 3],
            conversionName: 'Test Conversion',
          },
          {
            accountConversionIds: [1, 2, 3],
            conversionName: 'Test Conversion 2',
          },
        ],
      },
    },
  },

  {
    request: {
      query: LIST_FUNNEL_STEP_UTM_VARIABLES,
    },
    result: {
      data: {
        listFunnelStepUtmExpansionVariables: [
          'CampaignName',
          'CampaignId',
          'AdsetName',
          'AdsetId',
          'Campaign.AdAccountId',
          'Campaign.AdAccountName',
          'Adset.CampaignId',
          'Adset.CampaignName',
          'Campaign.AdsetIds',
          'Campaign.AdsetNames',
          'SharedBudget.CampaignIds',
          'SharedBudget.CampaignNames',
          'SharedBiddingStrategy.CampaignIds',
          'SharedBiddingStrategy.CampaignNames',
        ],
      },
    },
  },
  {
    request: {
      query: FUNNEL_STEP_UTM_MAPPING_QUERY,
    },
    result: {
      data: {
        listFunnelStepUtmMappingParams: [
          {
            name: 'Event Name',
            type: 'eventName',
          },
          {
            name: 'sessionCampaignName',
            type: 'sessionCampaignName',
          },
          {
            name: 'sessionCampaignId',
            type: 'sessionCampaignId',
          },
          {
            name: 'sessionManualAdContent',
            type: 'sessionManualAdContent',
          },
          {
            name: 'sessionManualTerm',
            type: 'sessionManualTerm',
          },
          {
            name: 'sessionMedium',
            type: 'sessionMedium',
          },
          {
            name: 'sessionSource',
            type: 'sessionSource',
          },
          {
            name: 'sessionSourceMedium',
            type: 'sessionSourceMedium',
          },
        ],
      },
    },
  },
  {
    request: {
      query: FUNNEL_STEP_MAPPING_PRESET_QUERY,
      variables: {
        teamId: 1,
      },
    },
    result: {
      data: {
        listFunnelStepMappingPresets: [
          {
            funnelStepMappingPresetId: 25,
            name: 'google / session_start',
            mapping: {
              conversions: null,
              metricId: 659,
              analyticsPropertyId: '293937110',
              utmParams: [
                {
                  type: 'sessionSource',
                  values: ['google'],
                },
                {
                  type: 'sessionCampaignName',
                  values: ['{CampaignName}'],
                },
                {
                  type: 'eventName',
                  values: ['session_start'],
                },
              ],
            },
          },
          {
            funnelStepMappingPresetId: 26,
            name: 'google / add_to_cart',
            mapping: {
              conversions: null,
              metricId: 659,
              analyticsPropertyId: '293937110',
              utmParams: [
                {
                  type: 'sessionSource',
                  values: ['google'],
                },
                {
                  type: 'sessionCampaignName',
                  values: ['{CampaignName}'],
                },
                {
                  type: 'eventName',
                  values: ['add_to_cart'],
                },
              ],
            },
          },
          {
            funnelStepMappingPresetId: 27,
            name: 'google / sign_up',
            mapping: {
              conversions: null,
              metricId: 659,
              analyticsPropertyId: '293937110',
              utmParams: [
                {
                  type: 'sessionSource',
                  values: ['google'],
                },
                {
                  type: 'sessionCampaignName',
                  values: ['{CampaignName}'],
                },
                {
                  type: 'eventName',
                  values: ['sign_up'],
                },
              ],
            },
          },
          {
            funnelStepMappingPresetId: 46,
            name: 'bing / add_to_cart',
            mapping: {
              conversions: null,
              metricId: 659,
              analyticsPropertyId: '293937110',
              utmParams: [
                {
                  type: 'sessionSource',
                  values: ['bing'],
                },
                {
                  type: 'sessionCampaignName',
                  values: ['{CampaignName}'],
                },
                {
                  type: 'eventName',
                  values: ['add_to_cart'],
                },
              ],
            },
          },
          {
            funnelStepMappingPresetId: 47,
            name: 'bing / session_start',
            mapping: {
              conversions: null,
              metricId: 659,
              analyticsPropertyId: '293937110',
              utmParams: [
                {
                  type: 'sessionSource',
                  values: ['bing'],
                },
                {
                  type: 'sessionCampaignName',
                  values: ['{CampaignName}'],
                },
                {
                  type: 'eventName',
                  values: ['session_start'],
                },
              ],
            },
          },
          {
            funnelStepMappingPresetId: 48,
            name: 'bing / sign_up',
            mapping: {
              conversions: null,
              metricId: 659,
              analyticsPropertyId: '293937110',
              utmParams: [
                {
                  type: 'sessionSource',
                  values: ['bing'],
                },
                {
                  type: 'sessionCampaignName',
                  values: ['{CampaignName}'],
                },
                {
                  type: 'eventName',
                  values: ['sign_up'],
                },
              ],
            },
          },
          {
            funnelStepMappingPresetId: 49,
            name: 'meta / session_start',
            mapping: {
              conversions: null,
              metricId: 659,
              analyticsPropertyId: '293937110',
              utmParams: [
                {
                  type: 'sessionSource',
                  values: ['facebook'],
                },
                {
                  type: 'sessionCampaignName',
                  values: ['{CampaignName}'],
                },
                {
                  type: 'eventName',
                  values: ['session_start'],
                },
              ],
            },
          },
          {
            funnelStepMappingPresetId: 50,
            name: 'meta / add_to_cart',
            mapping: {
              conversions: null,
              metricId: 659,
              analyticsPropertyId: '293937110',
              utmParams: [
                {
                  type: 'sessionSource',
                  values: ['facebook'],
                },
                {
                  type: 'sessionCampaignName',
                  values: ['{CampaignName}'],
                },
                {
                  type: 'eventName',
                  values: ['add_to_cart'],
                },
              ],
            },
          },
          {
            funnelStepMappingPresetId: 51,
            name: 'meta / sign_up',
            mapping: {
              conversions: null,
              metricId: 659,
              analyticsPropertyId: '293937110',
              utmParams: [
                {
                  type: 'sessionSource',
                  values: ['facebook'],
                },
                {
                  type: 'sessionCampaignName',
                  values: ['{CampaignName}'],
                },
                {
                  type: 'eventName',
                  values: ['sign_up'],
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: INTEGRATION_QUERY,
      variables: {
        integration_id: GA4_INTEGRATION_ID,
        team_id: 1,
        withUser: false,
        withConnection: false,
        withMeta: false,
        withFilters: true,
      },
    },
    result: {
      data: {
        integration: {
          integration_id: GA4_INTEGRATION_ID,
          provider_id: null,
          name: null,
          title: null,
          connectionUrl: null,
          connected: null,
          type: null,
          hasFilter: null,
          fields: null,
          user: null,
          filterOptions: [
            {
              filterName: 'property',
              filterList: [
                {
                  id: 'accounts/10101123370;properties/29332937110',
                  itemInfo: ['Team Global', 'Nexoya Global - GA4'],
                  selected: true,
                },
                {
                  id: 'accounts/1023011341370;properties/31258272119',
                  itemInfo: ['Nexoya Global', 'Nexoya ie - GA4'],
                  selected: false,
                },
              ],
            },
          ],
        },
      },
    },
  },
];
const meta: Meta<typeof ContentMetricAssignment> = {
  title: 'Portfolio Rules/ContentMetricAssignment',
  component: ContentMetricAssignment,
  decorators: mock_decorators(mocks),
};

export default meta;
type Story = StoryObj<typeof ContentMetricAssignment>;

export const Default: Story = {
  args: {
    isOpen: true,
    closeSidePanel: fn(),
    funnelSteps: MOCK_FUNNEL_STEPS,
    contentRule: {
      contentRuleId: 1,
      name: 'Content Rule',
      funnelStepMappings: [],
      filters: {
        providerId: 44,
        adAccountIds: [123],
        contentFilters: [],
      },
      appliedDiscoveredContents: [],
      matchingDiscoveredContentsCount: 0,
      portfolioId: 1,
      teamId: 1,
    },
  },
  play: async ({ userEvent }) => {
    await expect(await screen.findByText(/Assign metrics to funnel steps for Content Rule/i)).toBeInTheDocument();
    const measurements = mocks.find((m) => m.request.query === MEASUREMENTS_QUERY)?.result?.data?.measurements;
    if (!measurements) {
      throw new Error('Measurements mock not found');
    }

    for (let i = 0; i < MOCK_FUNNEL_STEPS.length; i++) {
      const funnelStep = MOCK_FUNNEL_STEPS[i];
      const measurementForStep = measurements.find((m) => m.optimization_target_type.includes(funnelStep.type));

      await userEvent.click(screen.getByRole('radio', { name: /Assign metric/i }));
      await userEvent.click(screen.getByText('Select a metric'));

      if (measurementForStep) {
        await userEvent.click(
          within(await screen.findByRole('listbox')).getByText(measurementForStep.name, { exact: false }),
        );
        await waitFor(async () => {
          const checkCircles = await screen.findAllByTestId('check_circle_icon');
          expect(checkCircles).toHaveLength(i + 1);
        });
      }

      if (i < MOCK_FUNNEL_STEPS.length - 1) {
        await userEvent.click(await screen.findByRole('button', { name: /Next funnel step/i }));
      }
    }

    await userEvent.click(await screen.findByRole('button', { name: /Review and apply/i }));
    await expect(await screen.findByText('Review and apply')).toBeInTheDocument();
    await expect(await screen.findByText('Apply metrics')).toBeInTheDocument();

    // await userEvent.click(await screen.getByRole('button', { name: /Apply metrics/i }));
  },
};

export const CustomConversions: Story = {
  args: { ...Default.args },
  play: async ({ userEvent }) => {
    await expect(await screen.findByText(/Assign metrics to funnel steps for Content Rule/i)).toBeInTheDocument();
    const conversions = mocks.find((m) => m.request.query === LIST_CONVERSIONS_QUERY)?.result?.data?.listConversions;
    if (!conversions) {
      throw new Error('Conversions mock not found');
    }

    const measurements = mocks.find((m) => m.request.query === MEASUREMENTS_QUERY)?.result?.data?.measurements;
    if (!measurements) {
      throw new Error('Measurements mock not found');
    }

    for (let i = 0; i < MOCK_FUNNEL_STEPS.length; i++) {
      const conversionForStep = conversions[Math.floor(Math.random() * conversions.length)];
      const measurementForStep = measurements[Math.floor(Math.random() * measurements.length)];

      await userEvent.click(await screen.findByRole('radio', { name: /Custom conversions/i }));
      await userEvent.click(await screen.findByText('Select a conversion goal'));

      if (conversionForStep) {
        await userEvent.click(within(await screen.findByRole('listbox')).getByText(conversionForStep.conversionName));
      }

      await userEvent.click(await screen.findByText('Select a metric'));

      if (measurementForStep) {
        await userEvent.click(within(await screen.findByRole('listbox')).getByText(measurementForStep.name));
      }

      // Special logic for the second funnel step from the original test
      if (i === 1) {
        await userEvent.click(await screen.findByTestId('add_conversion_button'));

        // The original test re-uses conversions and measurements.
        const secondConversion = conversions[1];
        const secondMeasurement = measurements[0];

        const conversionGoals = await screen.findAllByText('Select a conversion goal');
        await userEvent.click(conversionGoals[conversionGoals.length - 1]);
        if (secondConversion) {
          await userEvent.click(within(await screen.findByRole('listbox')).getByText(secondConversion.conversionName));
        }

        const metricSelectors = await screen.findAllByText('Select a metric');
        await userEvent.click(metricSelectors[metricSelectors.length - 1]);
        if (secondMeasurement) {
          await userEvent.click(within(await screen.findByRole('listbox')).getByText(secondMeasurement.name));
        }
      }

      if (i < MOCK_FUNNEL_STEPS.length - 1) {
        await userEvent.click(await screen.findByRole('button', { name: /Next funnel step/i }));
      }
    }

    await userEvent.click(await screen.findByRole('button', { name: /Review and apply/i }));

    await expect(await screen.findByText('Review and apply')).toBeInTheDocument();
    await expect(await screen.findByText('Apply metrics')).toBeInTheDocument();
  },
};

export const UTMTracking: Story = {
  args: { ...Default.args },
  play: async ({ userEvent }) => {
    await expect(await screen.findByText(/Assign metrics to funnel steps for Content Rule/i)).toBeInTheDocument();

    for (let i = 0; i < MOCK_FUNNEL_STEPS.length; i++) {
      if (i === 4) {
        await userEvent.click(await screen.findByRole('radio', { name: /UTM tracking/i }));
        const measurements = mocks.find((m) => m.request.query === MEASUREMENTS_QUERY)?.result?.data?.measurements;
        const measurementForStep = measurements?.filter((m) =>
          m.optimization_target_type.includes(MOCK_FUNNEL_STEPS[i].type),
        );
        const measurement = measurementForStep[Math.floor(Math.random() * measurementForStep.length)];

        const dimensions = mocks.find((m) => m.request.query === FUNNEL_STEP_UTM_MAPPING_QUERY)?.result?.data
          ?.listFunnelStepUtmMappingParams;
        if (!dimensions) throw new Error('UTM dimensions mock not found');
        const dimension = dimensions[Math.floor(Math.random() * dimensions.length)];

        // Open the dimension select dropdown
        await userEvent.click(await screen.findByTestId('utm_dimension_select'));
        // Click a dimension option
        await userEvent.click(await screen.findByText(camelCaseToWords(dimension.name)));

        // Type into the value input to trigger the variable suggestions
        const valueInput = await screen.findByTestId('utm_value_input');
        await userEvent.type(valueInput, 'utm_source={{}}');

        // Get variables and select one
        const variables = mocks.find((m) => m.request.query === LIST_FUNNEL_STEP_UTM_VARIABLES)?.result?.data
          ?.listFunnelStepUtmExpansionVariables;
        if (!variables) throw new Error('UTM variables mock not found');
        const variable = variables[Math.floor(Math.random() * variables.length)];

        // Click the variable from the suggestions dropdown
        await userEvent.click(await screen.findByText(`{${variable}}`));

        await userEvent.click(await screen.findByText('Select a metric'));
        await userEvent.click(within(await screen.findByRole('listbox')).getByText(measurement.name, { exact: false }));
      } else {
        await userEvent.click(await screen.findByRole('radio', { name: /Ignore mapping/i }));
      }

      // Only click "Next funnel step" if we're not at the last step
      if (i < MOCK_FUNNEL_STEPS.length - 1) {
        await userEvent.click(await screen.findByRole('button', { name: /Next funnel step/i }));
      }
    }

    // TODO: This isn't working right now because of the bug caused by apollo which is not returning
    //  the GA4 property mock, without it, the form is not allowed to be submitted.
    // await userEvent.click(await screen.findByRole('button', { name: /Review and apply/i }));

    await expect(await screen.findByText('Review and apply')).toBeInTheDocument();
    //
    // await userEvent.click(within(dialog).getByRole('button', { name: /Apply metrics/i }));
    //
    // await waitFor(() => expect(screen.queryByText('Apply metrics')).not.toBeInTheDocument());
  },
};

export const IgnoreMapping: Story = {
  args: { ...Default.args },
  play: async ({ userEvent }) => {
    await expect(await screen.findByText(/Assign metrics to funnel steps for Content Rule/i)).toBeInTheDocument();

    for (let i = 0; i < MOCK_FUNNEL_STEPS.length; i++) {
      await userEvent.click(await screen.findByRole('radio', { name: /Ignore mapping/i }));
      if (i !== MOCK_FUNNEL_STEPS.length - 1) {
        await userEvent.click(await screen.findByRole('button', { name: /Next funnel step/i }));
      }
    }
    await expect(await screen.findByRole('button', { name: /Review and apply/i })).toBeEnabled();
    await userEvent.click(await screen.findByRole('button', { name: /Review and apply/i }));
  },
};
