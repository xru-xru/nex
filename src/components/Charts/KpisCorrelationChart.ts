import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import { CorrelationChartData } from '../../types/types.custom';

import { CHARTS_CONFIG } from './config/ChartsConfig';

interface Props {
  dimension: number;
  chartData: CorrelationChartData[];
}

function kpisToCorrelationChart({ dimension, chartData }: Props) {
  let chart;

  function init() {
    am4core.useTheme(am4themes_animated);
    chart = am4core.create(CHARTS_CONFIG.CORRELATION_CONTAINER_ID, am4charts.XYChart);
    am4core.options.autoDispose = true;
    chart.paddingTop = 0;
    chart.paddingBottom = 0;
    chart.paddingLeft = 0;
    chart.paddingRight = 0;
    chart.maskBullets = false;
    chart.events.on('datavalidated', (ev) => {
      const chart = ev.target;
      const categoryAxis = chart.yAxes.getIndex(0);
      const metricAxis = chart.xAxes.getIndex(0);
      // +1 to accommodate dummy header row
      const adjustHeight = (dimension + 1) * CHARTS_CONFIG.CORRELATION_CELL_SIZE - categoryAxis.pixelHeight;
      const adjustWidth = (dimension + 1) * CHARTS_CONFIG.CORRELATION_CELL_SIZE - metricAxis.pixelWidth;
      const targetHeight = chart.pixelHeight + adjustHeight;
      const targetWidth = chart.pixelWidth + adjustWidth;
      chart.svgContainer.htmlElement.style.height = targetHeight + 'px';
      chart.svgContainer.htmlElement.style.width = targetWidth + 'px';
    });
    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = 'order';
    yAxis.dataFields.category = 'metric';
    xAxis.renderer.labels.template.disabled = false;
    xAxis.renderer.grid.template.disabled = false;
    xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.grid.template.stroke = am4core.color(CHARTS_CONFIG.CORRELATION_GRID_FILL);
    xAxis.renderer.minGridDistance = CHARTS_CONFIG.CORRELATION_CELL_SIZE;
    xAxis.renderer.inside = true;
    xAxis.renderer.labels.template.valign = 'top';
    xAxis.renderer.labels.template.fontSize = 16;
    xAxis.renderer.labels.template.fontWeight = '500';
    xAxis.renderer.labels.template.fontFamily = 'EuclidCircularB';
    xAxis.renderer.labels.template.dy = 10;
    xAxis.renderer.labels.template.fill = am4core.color(CHARTS_CONFIG.CORRELATION_GRID_FILL);
    xAxis.renderer.labels.template.adapter.add('text', (label) => `${label}.`);
    yAxis.renderer.labels.template.disabled = true;
    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.inversed = true;
    yAxis.renderer.fixedWidthGrid = true;
    yAxis.renderer.minGridDistance = CHARTS_CONFIG.CORRELATION_CELL_SIZE;
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = 'order';
    series.dataFields.categoryY = 'metric';
    series.dataFields.value = 'value';
    series.sequencedInterpolation = true;
    const columnTemplate = series.columns.template;
    series.tooltip.pointerOrientation = 'down';
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fillOpacity = 1;
    series.tooltip.background.fill = am4core.color(CHARTS_CONFIG.TOOLTIP_BACKGROUND_FILL);
    series.tooltip.background.stroke = am4core.color(CHARTS_CONFIG.TOOLTIP_BACKGROUND_FILL);
    series.tooltip.label.fontSize = 12;
    series.tooltip.background.pointerLength = 0;
    series.tooltip.label.paddingLeft = 0;
    series.tooltip.label.paddingRight = 0;
    series.tooltip.label.paddingBottom = 0;
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.clickable = true;
    series.tooltip.keepTargetHover = true;
    series.tooltip.label.maxWidth = 140;
    series.tooltip.label.wrap = true;
    columnTemplate.tooltipHTML = '';
    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);
    columnTemplate.stroke = am4core.color(CHARTS_CONFIG.CORRELATION_HEADER_BACKGROUND);
    columnTemplate.strokeOpacity = 0.2;
    columnTemplate.strokeWidth = 0;
    columnTemplate.propertyFields.fill = 'color';
    // Tooltip shadow
    const tooltipShadow = series.tooltip.background.filters.getIndex(0);
    tooltipShadow.dx = 5;
    tooltipShadow.dy = 5;
    tooltipShadow.blur = 8;
    tooltipShadow.color = am4core.color(CHARTS_CONFIG.TOOLTIP_BACKGROUND_FILL);
    tooltipShadow.opacity = 0.2;
    series.columns.template.adapter.add('tooltipHTML', function (_, target) {
      const value = target.dataItem.value ? target.dataItem.value.toFixed(3) : 0;
      const metricValue = target.dataItem.dataContext.metric.replace(/^[0-9]+/g, '');
      const html = `<div style="border-bottom:1px solid ${CHARTS_CONFIG.AXIS_GRID_FILL};color:${CHARTS_CONFIG.CORRELATION_GRID_FILL};text-align:center;padding:0 15px 5px 15px;">${metricValue}</div><div style="padding:8px;text-align:center;">${value}</div>`;

      if (target.dataItem.value === undefined || (target.dataItem.value === 0 && target.categoryY === undefined)) {
        return ``;
      }

      return html;
    });
    series.columns.template.column.adapter.add('fill', function (fill, target) {
      if (target.dataItem) {
        const absValue = Math.abs(target.dataItem.value);

        if (target.dataItem.categoryY === '') {
          return am4core.color(CHARTS_CONFIG.CORRELATION_HEADER_BACKGROUND);
        }

        if (target.dataItem.value < 0) {
          // orange red
          return am4core.color(`rgba(237, 52, 52, ${absValue})`);
        } else if (target.dataItem.value > 0) {
          // primary green
          return am4core.color(`rgba(14, 199, 106, ${absValue})`);
        } else {
          return am4core.color(CHARTS_CONFIG.CORRELATION_TEMPLATE_FILL);
        }
      }

      return fill;
    });
    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      minValue: -1,
      maxValue: 1,
    });
    chart.data = chartData;
  }

  return {
    init,
  };
}

export default kpisToCorrelationChart;
