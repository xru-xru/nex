import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

import { nexyColors } from '../../../theme';

const am4themes_nexyTheme = function (target) {
  if (target instanceof am4charts.AxisRenderer) {
    target.labels.template.fontSize = 12;
    target.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
  }
};

export { am4themes_nexyTheme };
