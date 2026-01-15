import React from 'react';

import { get } from 'lodash';

import { useCollectionsQuery } from '../graphql/collection/queryCollections';

import useSearchController from './SearchController';

function useCollectionsController(initialData = []) {
  const providerIds = [2, 12, 13, 25, 22];
  const { search, setSearch } = useSearchController();
  const { data, loading, error } = useCollectionsQuery({
    where: {
      includeChildren: false,
      providerIds,
      title: search,
    },
  });
  const edges = get(data, 'collections.edges', []);
  const state = [];
  const channels = edges
    .map((edge) => {
      const providerId = edge.node.provider.provider_id;

      if (providerIds.includes(providerId) && !state.includes(providerId)) {
        state.push(providerId);
        return edge.node.collection_id;
      }

      return null;
    })
    .filter((item) => item);

  function canAdd(channelId, selectedChannels, callback) {
    return !selectedChannels.includes(channelId)
      ? callback((selectedChannels) => [...selectedChannels, channelId])
      : null;
  }

  function canRemove(channelId, selectedChannels) {
    return selectedChannels.includes(channelId)
      ? selectChannels((selectedChannels) => selectedChannels.filter((item) => item !== channelId))
      : null;
  }

  // fallback if some of the payload channels ids
  // are not in the list of supported ones
  const cleanData = initialData.filter((item) => channels.includes(item));
  const [selectedChannels, selectChannels] = React.useState(cleanData);
  const addChannel = React.useCallback(
    (channelId) => canAdd(channelId, selectedChannels, selectChannels),
    [selectedChannels]
  );
  const removeChannel = React.useCallback((channelId) => canRemove(channelId, selectedChannels), [selectedChannels]);
  return {
    data,
    edges,
    loading,
    error,
    channels,
    selectedChannels,
    addChannel,
    removeChannel,
    search: {
      value: search,
      setSearch,
    },
  };
}

export default useCollectionsController;
