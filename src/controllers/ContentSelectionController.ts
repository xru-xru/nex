import { NexoyaMeasurement } from '../types/types';

import useSiftSelection from '../hooks/useSiftSelection';
import { equalContent, getContentKey } from '../utils/content';

type Props = {
  initialData?: any[];
};

function useContentSelectionController({ initialData = [] }: Props = {}) {
  return useSiftSelection<NexoyaMeasurement>({
    initialData,
    compareFn: equalContent,
    keyFn: getContentKey,
  });
}

export default useContentSelectionController;
