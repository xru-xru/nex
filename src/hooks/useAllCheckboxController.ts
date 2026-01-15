import { get } from 'lodash';

import { ConnectionEdges, PaginationConnection } from '../types/types.custom';

import { fullVisibleSelection } from '../utils/array';

type Options<T> = {
  add: (adding: T | T[]) => void;
  connection: PaginationConnection<T>;
  filter: (a: T, b: T) => boolean;
  filterAllowedEdges?: (a: ConnectionEdges<T>) => boolean;
  reset: () => void;
  selected: T[];
};

function useAllCheckboxController<T>({ add, connection, filter, filterAllowedEdges, reset, selected }: Options<T>) {
  if (import.meta.env.MODE !== 'production') {
    if (!selected || !connection || !filter || !add || !reset) {
      throw new Error('useAllCheckboxController: you did not provide all necessary values. Please check the API.');
    }
  }

  let allowedEdges = get(connection, 'edges', []) || [];
  const someSelected = selected.length > 0;

  // In case we want to filter out the edges from some values.
  // Example is if some of the edges are "disabled" from selection
  // we want to exclude them from the list
  if (typeof filterAllowedEdges === 'function') {
    allowedEdges = allowedEdges.filter(filterAllowedEdges);
  }

  // It needs to be after the filtered value by provided function
  const noSelectableEdges = allowedEdges.length === 0;
  const areAllVisibleSelected = fullVisibleSelection<T>(selected, { ...connection, edges: allowedEdges }, filter);

  // TODO: this is not a very flexible way of doing it. Let's worry about it when we
  // actually need to adjust it and accept something else.
  function handleAllCheckbox() {
    if (areAllVisibleSelected || (noSelectableEdges && someSelected)) {
      reset();
    } else if (!noSelectableEdges) {
      add(allowedEdges.map((c) => c.node));
    }
  }

  return {
    onClick: handleAllCheckbox,
    checked: someSelected,
    indeterminate: !areAllVisibleSelected,
    disabled: !areAllVisibleSelected && noSelectableEdges && !someSelected,
  };
}

export default useAllCheckboxController;
