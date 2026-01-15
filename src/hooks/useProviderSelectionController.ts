import { NexoyaProvider } from '../types/types';

import useSiftSelection from './useSiftSelection';

type Props = {
  initialData?: NexoyaProvider[];
};

function useProviderSelectionController({ initialData = [] }: Props = {}) {
  return useSiftSelection<NexoyaProvider>({
    initialData,
    compareFn: (first, second) => first.provider_id === second.provider_id,
    keyFn: (p) => String(p.provider_id),
  });
}

export default useProviderSelectionController;
