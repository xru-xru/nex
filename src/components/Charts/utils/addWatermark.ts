import { MutableRefObject } from 'react';

import * as am4core from '@amcharts/amcharts4/core';

export const addWatermark = (chartRef: MutableRefObject<any>) => {
  const watermark = chartRef.current.createChild(am4core.Image);
  watermark.disabled = true;
  watermark.href = 'https://cdn.nexoya.io/img/30_logo-black.png';
  watermark.align = 'right';
  watermark.fillOpacity = 1;
  watermark.width = am4core.percent(6);
  watermark.marginTop = am4core.percent(3);

  // Enable watermark on export
  chartRef.current.exporting.events.on('exportstarted', function () {
    watermark.disabled = false;
  });

  // Disable watermark when export finishes
  chartRef.current.exporting.events.on('exportfinished', function () {
    watermark.disabled = true;
  });
};
