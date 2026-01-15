import { MutableRefObject } from 'react';

import * as am4core from '@amcharts/amcharts4/core';

export const addExportMenu = (chartRef: MutableRefObject<any>, filePrefix?: string) => {
  chartRef.current.exporting.menu = new am4core.ExportMenu();
  chartRef.current.exporting.menu.items = [
    {
      label: '...',
      menu: [{ type: 'png', label: 'PNG', options: { quality: 1 } }],
    },
  ];
  chartRef.current.exporting.filePrefix = filePrefix ? filePrefix : 'chart';
};
