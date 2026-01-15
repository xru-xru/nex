import { NexoyaCollection } from '../types/types';

import useSiftSelection from './useSiftSelection';

type Props = {
  initialData?: NexoyaCollection[];
};

function useCollectionSelectionController({ initialData = [] }: Props = {}) {
  return useSiftSelection<NexoyaCollection>({
    initialData,
    compareFn: (first, second) => first.collection_id === second.collection_id,
    keyFn: (c) => String(c.collection_id),
  });
}

export default useCollectionSelectionController;
