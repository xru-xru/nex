import React from 'react';

import useCollectionSelectionController from './useCollectionSelectionController';
import useMeasurementSelectionController from './useMeasurementSelectionController';
import useProviderSelectionController from './useProviderSelectionController';

// I just copy paste it from the return value of the controller
// so we can paste it into the react context type for better
// type checking in the react components
export type KpiFilterController = {
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

function useKpiFilterController() {
  // sum is parentOnly in measurementRangeSearchPg query
  // if true (1) search is not extended
  // if false (0) search is extended
  const [sum, setSum] = React.useState<boolean>(true);
  const [active, setActive] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const providerSelection = useProviderSelectionController();
  // TODO: We are taking away this Collection filter from the UI table
  // and using the "Search" filed for searching through the "Collections".
  // This can most likely be removed when the full transition happen.
  const collectionSelection = useCollectionSelectionController();
  const measurementSelection = useMeasurementSelectionController();
  const toggleSum = React.useCallback(() => setSum((s) => !s), [setSum]);

  return {
    providerSelection,
    collectionSelection,
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
    active: {
      value: active,
      set: setActive,
    },
  };
}

export default useKpiFilterController;
