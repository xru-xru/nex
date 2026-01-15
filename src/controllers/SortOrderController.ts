import React from 'react';

type SortOrder = 'ASC' | 'DESC';

function useSortOrderController(initialOrder: SortOrder = 'ASC') {
  const [order, setOrder] = React.useState<SortOrder>(initialOrder);
  return {
    order,
    setOrder,
  };
}

export default useSortOrderController;
