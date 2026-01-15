import { NexoyaMeasurement } from '../types/types';

import useSiftSelection from './useSiftSelection';

type Props = {
  initialData?: NexoyaMeasurement[];
};

function useMeasurementSelectionController({ initialData = [] }: Props = {}) {
  return useSiftSelection<NexoyaMeasurement>({
    initialData,
    compareFn: (first, second) => first.measurement_id === second.measurement_id,
    keyFn: (m) => String(m.measurement_id),
  });
}

export default useMeasurementSelectionController;
