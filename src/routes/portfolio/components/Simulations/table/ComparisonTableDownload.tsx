import React from 'react';

import writeXlsxFile from 'write-excel-file';

import { ExtendedNexoyaSimulationScenario, NexoyaScenarioFunnelStep } from 'types';

import SimulationComparisonController from '../../../../../controllers/SimulationComparisonController';

interface Props {
  scenarios: ExtendedNexoyaSimulationScenario[];
  funnelSteps: NexoyaScenarioFunnelStep[];
  onDone: () => void;
  onError: (err) => void;
}
function ComparisonTableDownload({ scenarios, funnelSteps, onDone, onError }: Props) {
  const rawData = SimulationComparisonController(scenarios, funnelSteps);
  function generateXlsx() {
    try {
      // @ts-ignore
      writeXlsxFile(rawData, {
        fileName: `Nexoya_comparison_table.xlsx`,
        sheet: 'Simulation scenarios',
      }).then(onDone);
    } catch (err) {
      console.error(err);
      onError(err);
    }
  }

  React.useEffect(() => {
    generateXlsx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default ComparisonTableDownload;
