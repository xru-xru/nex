import React, { useCallback } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { nexyColors } from 'theme';

import { NexoyaValidationPerformance } from 'types';

import { addExportMenu } from '../../../../components/Charts/utils/addExportMenu';
import { addWatermark } from '../../../../components/Charts/utils/addWatermark';

import * as Styles from '../../../../components/Charts/styles/PortfolioPerformanceChart';
import { NexyChartClasses } from '../../../../components/Charts/styles/PortfolioPerformanceChart';
import dayjs from 'dayjs';
import { CHART_TOOLTIP_DATE_FORMAT } from '../../../../utils/dates';

am4core.useTheme(am4themes_animated);

interface Props {
  data: NexoyaValidationPerformance[];
  targetFunnelStepId: number;
  showOptimized: boolean;
  portfolioName: string;
}

const CHART_CONTAINER = 'detailed-report-performance-chart';

const getNameForChartTooltip = (title: 'achieved' | 'nonOptimized') =>
  title === 'achieved' ? 'Achieved' : title === 'nonOptimized' ? 'Non-optimized' : '';

function DetailedReportPerformanceChart({ data, targetFunnelStepId, showOptimized, portfolioName }: Props) {
  const targetFunnel: any = data.find((item) => item.funnelStep.funnel_step_id === targetFunnelStepId) || {};
  const chartRef = React.useRef(null);

  const createBullet = (series, lineColor) => {
    const circleBullet = series.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.radius = 6;
    circleBullet.circle.fill = lineColor;
    circleBullet.circle.stroke = am4core.color(nexyColors.white);
    circleBullet.circle.strokeWidth = 3;

    const bulletShadow = circleBullet.filters.push(new am4core.DropShadowFilter());
    bulletShadow.opacity = 0.1;

    return circleBullet;
  };

  const createSeries = useCallback(
    (name, color) => {
      if (!chartRef.current) return;
      // Init series
      const series = chartRef.current.series.push(new am4charts.LineSeries());

      series.name = 'value';
      series.dataFields.valueY = name;
      series.dataFields.dateX = 'timestamp';
      series.strokeWidth = 3;
      series.stroke = am4core.color(color);
      series.tensionX = 0.8;
      series.showOnInit = true;
      series.tooltip.pointerOrientation = 'down';
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fillOpacity = 1;
      series.tooltip.background.fill = am4core.color(nexyColors.darkGrey);
      series.tooltip.background.stroke = am4core.color(nexyColors.darkGrey);
      series.tooltip.label.fontSize = 12;
      series.tooltip.background.pointerLength = 0;
      series.tooltip.label.paddingLeft = 0;
      series.tooltip.label.paddingRight = 0;
      series.tooltip.label.paddingBottom = 0;
      series.tooltip.label.interactionsEnabled = true;
      series.tooltip.clickable = true;
      series.tooltip.keepTargetHover = true;
      series.tooltip.dy = -5;
      series.tooltip.animationDuration = 150;
      series.tooltip.animationEasing = am4core.ease.sinOut;
      // Allow gaps in data
      series.connect = false;

      series.adapter.add('tooltipHTML', function (_, target) {
        const formattedDate = dayjs(target.tooltipDataItem.dateX).format(CHART_TOOLTIP_DATE_FORMAT);
        let content = `<div class="${NexyChartClasses.tooltip}">${formattedDate}</div>`;
        chartRef.current.series.each(function (item, idx) {
          content += `<div style="padding:12px;display: flex;justify-content: space-between; align-items: baseline; gap: 16px; min-width: 125px; margin-bottom: ${
            idx === chartRef.current.series?.length - 1 ? '0' : '-14px'
          }"><span style="color: #C7C8D1; font-weight: 300;"><span style=" font-size: 16px; margin-right: 2px; color:${
            item.stroke
          } ">●</span>${getNameForChartTooltip(item.dataFields.valueY)}</span>{${item.dataFields.valueY}}</div>`;
        });
        return content;
      });

      if (data.some((validationPerformance) => validationPerformance.validationData.length <= 1)) {
        createBullet(series, am4core.color(color));
      }

      return series;
    },
    [data],
  );

  React.useEffect(() => {
    chartRef.current && chartRef.current.dispose();
    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
    chartRef.current.data = targetFunnel?.validationData;
    chartRef.current.paddingLeft = 0;
    chartRef.current.dateFormatter.dateFormat = 'MMM d, yyyy';
    // Add date axis
    const dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    dateAxis.renderer.grid.template.strokeOpacity = 0;
    // Add value axis
    const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.gridContainer.toFront();
    valueAxis.renderer.labels.template.adapter.add('text', (text: string) => (text ? text.toUpperCase() : text));
    // Add cursor
    chartRef.current.cursor = new am4charts.XYCursor();
    chartRef.current.cursor.maxTooltipDistance = -1;
    // Disable axis lines
    chartRef.current.cursor.lineX.disabled = false;
    chartRef.current.cursor.lineY.disabled = true;
    chartRef.current.cursor.lineX.strokeDasharray = '';
    chartRef.current.cursor.lineX.stroke = nexyColors.blueGrey;
    // Disable axis tooltips
    dateAxis.cursorTooltipEnabled = false;
    valueAxis.cursorTooltipEnabled = false;
    // Disable zoom
    chartRef.current.cursor.behavior = 'none';
    chartRef.current.zoomOutButton.disabled = true;

    createSeries('achieved', '#744CED');
    createSeries('nonOptimized', '#F6820D');

    // Enable export
    addExportMenu(chartRef, `Detailed Report Performance-${portfolioName}`);
    addWatermark(chartRef);

    if (showOptimized) {
      createSeries('optimized', '#0EC76A');
    }
  }, [createSeries, showOptimized, targetFunnel.validationData]);

  React.useEffect(() => {
    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);

  return (
    <Styles.ChartContainerStyled
      data-cy="portfolioDetailedPerformanceChart"
      id={CHART_CONTAINER}
      style={{
        marginTop: 24,
        width: '100%',
        height: 300,
      }}
    />
  );
}

export default DetailedReportPerformanceChart;
