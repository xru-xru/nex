import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { NexoyaContentFilterFieldName } from '../../types';
import { FilterItem } from '../../routes/portfolio/components/Content/PortfolioRule/filter/FilterItem';
import { ProviderDropdownFilter } from '../../routes/portfolio/components/Content/PortfolioRule/filter/ProviderDropdownFilter';
import { mock_decorators } from '../../../.storybook/preview.jsx';
import { mockTranslationStoreData } from '../utils';

export default {
  title: 'Portfolio Rules/Filters / Provider',
  decorators: mock_decorators(),
  argTypes: {
    allowMultipleProviderSelection: {
      control: { type: 'boolean' },
      defaultValue: true, // Default to true, can be toggled from Storybook UI
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'This is the provider filter that can be switched from single to multiple selection. It is used in the create rule sidepanel to filter the content based on the selected provider.',
      },
    },
    controls: {
      sort: 'requiredFirst',
    },
  },
  tags: ['autodocs'],
} as Meta;

const Template: StoryFn<{ allowMultipleProviderSelection: boolean }> = ({ allowMultipleProviderSelection }) => {
  mockTranslationStoreData();

  const [selectedProviderIds, setSelectedProviderIds] = useState([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  return (
    <div className="flex justify-between">
      <div className="flex flex-wrap gap-2">
        <ProviderDropdownFilter
          portfolioId={1}
          selectedProviderIds={selectedProviderIds}
          setSelectedProviderIds={setSelectedProviderIds}
          selectedAccountIds={selectedAccountIds}
          setSelectedAccountIds={setSelectedAccountIds}
          setShouldFetch={() => null}
          allowMultipleProviderSelection={allowMultipleProviderSelection} // Use Storybook control
          initialSubAccounts={subAccounts}
        />

        <div className="mx-3 my-auto h-8 w-[1px] bg-neutral-100" />

        {selectedOptions
          ?.filter((selectedOption) => selectedOption.value !== NexoyaContentFilterFieldName.ContentId)
          ?.map((selectedOption) => (
            <FilterItem
              key={selectedOption.id}
              selectedOptions={selectedOptions}
              selectedOption={selectedOption}
              setSelectedOptions={setSelectedOptions}
              defaultOpen={false}
              setShouldFetch={() => null}
            />
          ))}
      </div>
    </div>
  );
};

export const Default = Template.bind({});

const subAccounts = [
  {
    contentId: 1201375442,
    title: '{collection:linkedin} Generali Switzerland - DEPRECATED',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 13,
      name: '{provider.linkedin}',
    },
  },
  {
    contentId: 431137807,
    title: 'Generali_CH',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 540239581,
    title: '{collection:facebook} Maurizio Miggiano',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 540239584,
    title: '{collection:facebook} 10150195770979464',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 540239587,
    title: '{collection:facebook} Generali CH intern',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 540239590,
    title: '{collection:facebook} GeneraliCH_baseline',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 1304581756,
    title: '{collection:googledcm} Generali Versicherung c/o Vivaki DE - DCM EMEA - Generali_CH (Source DV360)',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 431168824,
    title: 'Generali Personenversicherungen AG(2679779474)',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 972824162,
    title: 'Generali_CH',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 34,
      name: '{provider.googledv360}',
    },
  },
  {
    contentId: 946206328,
    title: '{collection:googledcm} Generali Versicherung c/o Vivaki DE - DCM EMEA - Generali_CH',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 946206329,
    title:
      '{collection:googledcm} Generali Versicherung c/o Vivaki DE - DCM EMEA - BidManager_SeparateSpotlightAdvertiser_DO_NOT_EDIT',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 946206330,
    title:
      '{collection:googledcm} Generali Versicherung c/o Vivaki DE - DCM EMEA - BidManager_Advertiser_DO_NOT_EDIT_1045245',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 946206331,
    title:
      '{collection:googledcm} Generali Versicherung c/o Vivaki DE - DCM EMEA - BidManager_Advertiser_DO_NOT_EDIT_4965343',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 2740758423,
    title: 'Generali Versicherung c/o Vivaki DE - DCM EMEA - Generali_CH',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 2740758424,
    title: 'Generali Versicherung c/o Vivaki DE - DCM EMEA - BidManager_SeparateSpotlightAdvertiser_DO_NOT_EDIT',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 2740758425,
    title: 'Generali Versicherung c/o Vivaki DE - DCM EMEA - BidManager_Advertiser_DO_NOT_EDIT_1045245',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 2740758426,
    title: 'Generali Versicherung c/o Vivaki DE - DCM EMEA - BidManager_Advertiser_DO_NOT_EDIT_4965343',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 2740758427,
    title: 'Generali Versicherung c/o Vivaki DE - DCM EMEA - Generali_CH (Source DV360)',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 32,
      name: '{provider.googledcm}',
    },
  },
  {
    contentId: 431183824,
    title: '{collection:ads:account} Generali MCC (1629614633)',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 24,
      name: '{provider.google.ads}',
    },
  },
  {
    contentId: 4963004539,
    title: '{collection:facebook} Generali_Swissfluencer',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
  {
    contentId: 2740787529,
    title: '{collection:facebook} Dominik Mönnighoff',
    contentType: {
      collection_type_id: 2,
      name: 'Account',
    },
    provider: {
      provider_id: 12,
      name: '{provider.facebook}',
    },
  },
];
