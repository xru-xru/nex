import React from 'react';

import { NexoyaCollectionType } from 'types';

import useCollectionTypeSelectionController from './useCollectionTypeSelectionController';
import useMeasurementSelectionController from './useMeasurementSelectionController';
import useProviderSelectionController from './useProviderSelectionController';

export type ContentFilterController = {
  collectionSelection: any;
  extendedSearch: {
    set: (arg0: ((arg0: boolean) => boolean) | boolean) => void;
    value: boolean;
  };
  measurementSelection: any;
  providerSelection: any;
  search: {
    onChange: (arg0: ((arg0: string) => string) | string) => void;
    value: string;
  };
  sum: {
    set: (arg0: ((arg0: boolean) => boolean) | boolean) => void;
    toggle: () => void;
    value: boolean;
  };
};

function useContentFilterController(withInitial) {
  const [sum, setSum] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<string>('');
  const providerSelection = useProviderSelectionController();
  // TODO find a way to abstract this
  const portfolioCollectionType: NexoyaCollectionType[] = [{ collection_type_id: 7, name: 'Campaign' }];
  const collectionTypeSelection = useCollectionTypeSelectionController({
    initialData: withInitial ? portfolioCollectionType : [],
  });
  const measurementSelection = useMeasurementSelectionController();
  const toggleSum = React.useCallback(() => setSum((s) => !s), [setSum]);

  return {
    providerSelection,
    collectionTypeSelection,
    measurementSelection,
    search: {
      value: search,
      onChange: setSearch,
    },
    sum: {
      value: sum,
      toggle: toggleSum,
      set: setSum,
    },
  };
}

export default useContentFilterController;
