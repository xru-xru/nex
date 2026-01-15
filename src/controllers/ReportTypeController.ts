import React from 'react';

import { ReportType } from '../types/types.custom';

function useReportTypeController() {
  return React.useState<null | ReportType>(null);
}

export default useReportTypeController;
