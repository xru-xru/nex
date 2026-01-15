import React from 'react';

import { get } from 'lodash';

import { PaginationConnection } from 'types/types.custom';

type Options<T> = {
  add: (adding: T | T[]) => void;
  remove?: (remove: T | T[]) => void;
  connection: PaginationConnection<T> | any;
  reset: () => void;
  selected: T[];
};

function useAllCheckboxController<T>({ add, remove, connection, reset, selected }: Options<T>) {
  if (!selected || !connection || !add || !reset) {
    throw new Error('useAllCheckboxController: you did not provide all necessary values. Please check the API.');
  }
  const [checked, setChecked] = React.useState(false);
  const allowedEdges = get(connection, 'edges', []) || [];
  const someSelected = selected.length > 0;
  const noSelectableEdges = allowedEdges.length === 0;
  const allSelected = () => {
    const visibleSelection = (selected as any).filter((item) =>
      (allowedEdges || []).some((s) => s.node.collection_id === item.collection_id)
    );
    return visibleSelection.length;
  };
  function onClick({ target }) {
    const checked = target.checked;
    setChecked(checked);
    if (checked) {
      return add(allowedEdges.map((c) => c.node));
    }
    allowedEdges.map((edge) => {
      remove((selected as any).find((s) => s.collection_id === edge.node.collection_id));
      return edge;
    });
  }
  return {
    onClick,
    checked,
    indeterminate: !allSelected() && someSelected,
    disabled: allSelected() && noSelectableEdges && !someSelected,
  };
}

export default useAllCheckboxController;
