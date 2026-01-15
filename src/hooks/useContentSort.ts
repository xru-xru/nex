import React from 'react';

import { orderBy, get } from 'lodash';

type SortOrder = boolean | 'asc' | 'desc';
interface ReturnTypes<T> {
  order: SortOrder;
  setOrder: (order: SortOrder) => void;
  field: keyof T | '';
  setField: (field: keyof T) => void;
  sortedContent: T[];
  setSortedContent: (sortedContent: T[]) => void;
  sort: (field: keyof T) => void;
}

function useContentSort<T>(initialContent: T[]): ReturnTypes<T> {
  const [order, setOrder] = React.useState<SortOrder>(false);
  const [field, setField] = React.useState<'' | keyof T>('');
  const [sortedContent, setSortedContent] = React.useState(initialContent);

  const sort = React.useCallback(
    (newField) => {
      let newOrder;
      field === newField ? (newOrder = order === 'asc' ? 'desc' : 'asc') : (newOrder = 'desc');
      setOrder(newOrder);
      setField(newField);
      setSortedContent(orderBy(sortedContent, (item) => get(item, newField, item), [newOrder]));
    },
    [order, sortedContent, field]
  );

  return {
    order,
    setOrder,
    field,
    setField,
    sortedContent,
    setSortedContent,
    sort,
  };
}

export default useContentSort;
