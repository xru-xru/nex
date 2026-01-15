import { addLicense } from '@amcharts/amcharts4/core';

import { ENV_VARS_WRAPPER } from '../../../configs/envVariables';

// globally registers amcharts license

export default function addAmChartsLicense() {
  if (window[ENV_VARS_WRAPPER]?.REACT_APP_AMCHARTS_KEY) {
    addLicense(window[ENV_VARS_WRAPPER].REACT_APP_AMCHARTS_KEY);
  }
}
