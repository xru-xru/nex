import React, { ReactElement, useRef } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import dayjs from 'dayjs';

import { addExportMenu } from './utils/addExportMenu';
import { addWatermark } from './utils/addWatermark';
import { CHART_TOOLTIP_DATE_FORMAT } from '../../utils/dates';

type Props = {
  data: any;
  style?: Record<string, unknown>;
};
const CHART_CONTAINER = 'kpis-compare-dates-chart';

function KPIsCompareDatesChart({ data }: Props): ReactElement {
  const chartRef = useRef(null);

  function createSeries(fieldX, fieldY, lineColor) {
    if (!chartRef.current) return;
    // Add date axis
    const dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = fieldX;
    dateAxis.renderer.labels.template.disabled = true;
    dateAxis.renderer.grid.template.strokeOpacity = 0;
    // Disable axis tooltips
    dateAxis.cursorTooltipEnabled = false;
    // Init series
    const series = chartRef.current.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = fieldY;
    series.dataFields.dateX = fieldX;
    series.strokeWidth = 3;
    series.stroke = am4core.color(lineColor);
    series.xAxis = dateAxis;
    series.tooltip.pointerOrientation = 'down';
    series.tooltip.dy = -5;
    series.tooltip.background.pointerLength = 0;
    series.tooltip.background.filters.clear(); // remove shadow

    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color('#2a2b2e');
    series.tooltip.background.stroke = am4core.color('#2a2b2e');
    series.tooltip.label.fontSize = 12;
    series.tensionX = 0.8;
    series.showOnInit = true;
    // Set up tooltip
    series.adapter.add('tooltipText', function (_, target) {
      let text = '';
      chartRef.current.series.each(function (item) {
        const dataItem = item.dataItems.getIndex(target.tooltipDataItem.index);
        const formattedDate = dayjs(dataItem?.dateX).format(CHART_TOOLTIP_DATE_FORMAT);
        text += `[${item.stroke.hex}]●[/] ${formattedDate}: [bold]{${item.dataFields.valueY}}[/]\n`;
      });
      return text;
    });
  }

  React.useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
      // Setup date formatting
      chartRef.current.dateFormatter.dateFormat = 'd MMM yyyy';
      // Add value axis
      const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.renderer.labels.template.disabled = true;
      valueAxis.renderer.grid.template.stroke = am4core.color('#f0f2fa');
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.renderer.labels.template.fill = am4core.color('rgba(183,186,199,0.8)');
      valueAxis.renderer.labels.template.fontSize = 12;
      // Init series with their own axis
      createSeries('initialDate', 'initialValue', '#0ec76b');
      createSeries('compareDate', 'compareValue', '#674ced');
      // Add cursor
      chartRef.current.cursor = new am4charts.XYCursor();
      chartRef.current.cursor.maxTooltipDistance = -1;
      // Disable axis lines
      chartRef.current.cursor.lineX.disabled = true;
      chartRef.current.cursor.lineY.disabled = true;
      // Disable zoom
      chartRef.current.cursor.behavior = 'none';
      chartRef.current.zoomOutButton.disabled = true;
      // Enable export
      addExportMenu(chartRef);
      addWatermark(chartRef);
    }
  }, []);
  // Load data into chart
  React.useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = data;
    }
  }, [data]);
  // Handle component unmounting, dispose chart
  React.useEffect(() => {
    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);
  return (
    <div
      id={CHART_CONTAINER}
      style={{
        width: '100%',
        height: '290px',
        marginBottom: '50px',
      }}
    />
  );
}

export default KPIsCompareDatesChart;
