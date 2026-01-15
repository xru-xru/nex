import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { DiscoveredContents } from '../../routes/portfolio/Content/DiscoveredContents';
import { useDiscoverContentsStore } from '../../store/discovered-contents';
import { mock_decorators } from '../../../.storybook/preview.jsx';
import { NexoyaDiscoveredContent } from '../../types';

export default {
  title: 'Portfolio Rules/Discovered contents',
  component: DiscoveredContents,
  decorators: mock_decorators(),
  parameters: {
    docs: {
      description: {
        component:
          'Displays a list of discovered contents in the portfolio. This component helps users manage and review discovered contents.',
      },
    },
    controls: {
      sort: 'requiredFirst',
    },
  },
  tags: ['autodocs'],
} as Meta;

const setStoreData = () => {
  const { setFilteredContents } = useDiscoverContentsStore.getState();
  setFilteredContents(dummyFilteredContents);
};

const Template: StoryFn = () => {
  // Pre-populate the Zustand store with dummy data
  setStoreData();

  return <DiscoveredContents />;
};

export const Default = Template.bind({});

const dummyFilteredContents: NexoyaDiscoveredContent[] = [
  {
    __typename: 'DiscoveredContent',
    discoveredContentId: 1,
    content: {
      portfolioContentId: 1170229,
      contentId: 54121091571,
      title: '{collection:adform} Campaign: Test',
      latestMeasurementDataDate: null,
      startDatetime: '2023-02-07T23:00:00.000Z',
      endDatetime: '2025-05-31T21:59:00.000Z',
      biddingStrategy: null,
      budget: null,
      status: 'ACTIVE',
      provider: {
        provider_id: 50,
        name: '{provider.adform}',
        __typename: 'Provider',
      },
      contentType: {
        collection_type_id: 7,
        name: 'Campaign',
        __typename: 'CollectionType',
      },
      // @ts-ignore
      parent: {
        teamId: 1,
        contentId: 5412109146,
        title: '{collection:adform} Account: VF-IT',
      },
      __typename: 'ContentV2',
    },
  },
  {
    __typename: 'DiscoveredContent',
    discoveredContentId: 2,
    content: {
      portfolioContentId: 1170229,
      contentId: 54121091572,
      title: '{collection:adform} Super adform',
      latestMeasurementDataDate: null,
      startDatetime: '2023-02-07T23:00:00.000Z',
      endDatetime: '2025-05-31T21:59:00.000Z',
      biddingStrategy: null,
      budget: null,
      status: 'ACTIVE',
      provider: {
        provider_id: 50,
        name: '{provider.adform}',
        __typename: 'Provider',
      },
      contentType: {
        collection_type_id: 7,
        name: 'Campaign',
        __typename: 'CollectionType',
      },
      // @ts-ignore
      parent: {
        teamId: 1,
        contentId: 5412109146,
        title: '{collection:adform} Account: VF-IT',
        contentType: null,
      },
      __typename: 'ContentV2',
    },
  },
  {
    __typename: 'DiscoveredContent',
    discoveredContentId: 3,
    content: {
      portfolioContentId: 1170229,
      contentId: 54121091573,
      title: '{collection:adform} Adform super test',
      latestMeasurementDataDate: null,
      startDatetime: '2023-02-07T23:00:00.000Z',
      endDatetime: '2025-05-31T21:59:00.000Z',
      biddingStrategy: null,
      budget: null,
      status: 'ACTIVE',
      provider: {
        provider_id: 50,
        name: '{provider.adform}',
        __typename: 'Provider',
      },
      contentType: {
        collection_type_id: 7,
        name: 'Campaign',
        __typename: 'CollectionType',
      },
      // @ts-ignore
      parent: {
        teamId: 1,
        contentId: 5412109146,
        title: '{collection:adform} Account: VF-IT',
      },
      __typename: 'ContentV2',
    },
  },
  {
    __typename: 'DiscoveredContent',
    discoveredContentId: 4,
    content: {
      portfolioContentId: 1170229,
      contentId: 54121091574,
      title: '{collection:adform} Campaign: Test',
      latestMeasurementDataDate: null,
      startDatetime: '2023-02-07T23:00:00.000Z',
      endDatetime: '2025-05-31T21:59:00.000Z',
      biddingStrategy: null,
      budget: null,
      status: 'ACTIVE',
      provider: {
        provider_id: 50,
        name: '{provider.adform}',
        __typename: 'Provider',
      },
      contentType: {
        collection_type_id: 7,
        name: 'Campaign',
        __typename: 'CollectionType',
      },
      // @ts-ignore
      parent: {
        teamId: 1,
        contentId: 5412109146,
        title: '{collection:adform} Account: VF-IT',
      },
      __typename: 'ContentV2',
    },
  },
  {
    __typename: 'DiscoveredContent',
    discoveredContentId: 5,
    content: {
      portfolioContentId: 1170229,
      contentId: 541210915755,
      title: '{collection:adform} Campaign: Test',
      latestMeasurementDataDate: null,
      startDatetime: '2023-02-07T23:00:00.000Z',
      endDatetime: '2025-05-31T21:59:00.000Z',
      biddingStrategy: null,
      budget: null,
      status: 'ACTIVE',
      provider: {
        provider_id: 50,
        name: '{provider.adform}',
        __typename: 'Provider',
      },
      contentType: {
        collection_type_id: 7,
        name: 'Campaign',
        __typename: 'CollectionType',
      },
      // @ts-ignore
      parent: {
        teamId: 1,
        contentId: 5412109146,
        title: '{collection:adform} Account: VF-IT',
      },
      __typename: 'ContentV2',
    },
  },
];
