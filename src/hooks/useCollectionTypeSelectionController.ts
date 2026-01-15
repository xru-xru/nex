import { NexoyaCollectionType } from '../types/types';

import useSiftSelection from './useSiftSelection';

type Props = {
  initialData?: NexoyaCollectionType[];
};

function useCollectionTypeSelectionController({ initialData = [] }: Props = {}) {
  return useSiftSelection<NexoyaCollectionType>({
    initialData,
    compareFn: (first, second) => first.collection_type_id === second.collection_type_id,
    keyFn: (c) => String(c.collection_type_id),
  });
}

export default useCollectionTypeSelectionController;
