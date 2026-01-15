import { NexoyaMeasurement } from '../types/types';

import useSiftSelection from '../hooks/useSiftSelection';
import { equalKpis, getKpiKey } from '../utils/kpi';

type Props = {
  initialData?: NexoyaMeasurement[];
};

function useKpiSelectionController({ initialData = [] }: Props = {}) {
  return useSiftSelection<NexoyaMeasurement>({
    initialData,
    compareFn: equalKpis,
    keyFn: getKpiKey,
  });
}

export default useKpiSelectionController;
