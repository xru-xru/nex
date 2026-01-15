import React from 'react';

import { XYSeries } from '@amcharts/amcharts4/.internal/charts/series/XYSeries';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { capitalize } from 'lodash';
import { nexyColors } from 'theme';
import { NumberParam, useQueryParam } from 'use-query-params';

import { NexoyaScenarioReliabilityLabel, NexoyaSimulationScenario } from '../../../../../types';

import { getAccuracyColorByLabel } from '../../../utils/simulation';
import { Color } from '@amcharts/amcharts4/.internal/core/utils/Color';

import {
  ChartContainerStyled,
  NexyChartClasses,
} from '../../../../../components/Charts/styles/PortfolioPerformanceChart';
import { getPercentageColor } from '../../../../../utils/number';

dayjs.extend(isoWeek);
am4core.useTheme(am4themes_animated);

export interface AxisMetric {
  baseScenario: number;
  changePercent: number;
  currentScenario: number;
  scenarioId: number;
  name: string;
  isBaseScenario: boolean;
  isApplied: boolean;
  label: NexoyaScenarioReliabilityLabel;
}

interface Props {
  selectedScenarioId: number;
  simulationHasBaseScenario: boolean;
  appliedScenario: NexoyaSimulationScenario;
  axisMetrics: {
    xAxis: AxisMetric;
    yAxis: AxisMetric;
  }[];
}

const CHART_CONTAINER = 'scenario-overview-target-chart';

function SimulationOverview({ axisMetrics, selectedScenarioId, simulationHasBaseScenario, appliedScenario }: Props) {
  const chartRef = React.useRef(null);
  const [, setSelectedScenarioId] = useQueryParam('selectedScenarioId', NumberParam);

  const createTooltip = (series: am4charts.XYChart) => {
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
    series.tooltip.dx = -20;

    series.tooltip.animationDuration = 150;
    series.tooltip.animationEasing = am4core.ease.sinOut;
    series.tooltip.pointerOrientation = 'right';
    series.adapter.add('tooltipHTML', (_, target) => {
      let content = `<div class="${NexyChartClasses.tooltip}" style="font-size: 10px; text-align: center">Scenario {idx}</div>`;

      // Get the hovered data item
      const dataItem = target?.tooltipDataItem;
      // @ts-ignore
      const xAxis = dataItem?.dataContext?.xAxis;
      // @ts-ignore
      const yAxis = dataItem?.dataContext?.yAxis;
      // @ts-ignore
      const shouldRenderDiffTooltip = xAxis?.isBaseScenario || !simulationHasBaseScenario;

      chartRef.current.series.each((item, idx) => {
        content += `
    <div style="padding:12px;display: flex;justify-content: space-between; align-items: baseline; gap: 16px; min-width: 125px; margin-bottom: ${
      idx === chartRef.current.series.length - 1 ? '0' : '-14px'
    }">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="color: ${nexyColors.paleGrey}; font-size: 13px">${xAxis?.name}</span>
        ${
          shouldRenderDiffTooltip
            ? ''
            : `<span style="color: ${nexyColors.blueyGrey}; font-weight: 400; font-size: 10px;">% diff. from base</span>`
        }
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="color: ${nexyColors.white}; font-weight: 500;">{${item.dataFields.valueX}}</span>
               ${
                 shouldRenderDiffTooltip
                   ? ''
                   : `        <span style="color: ${getPercentageColor(
                       xAxis?.changePercent,
                       xAxis?.lowerIsBetter,
                     )}; font-weight: 500; font-size: 10px; text-align: end">${xAxis?.changePercent < 0 ? '' : '+'}${
                       xAxis?.changePercent
                     }%
        </span>`
               }
      </div>
    </div>
    <div style="padding:2px 12px 12px; display: flex;justify-content: space-between; align-items: baseline; gap: 16px; min-width: 125px; margin-bottom: ${
      idx === chartRef.current.series.length - 1 ? '0' : '-14px'
    }">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="color: ${nexyColors.paleGrey}; font-size: 13px">${yAxis?.name}</span>
        ${
          shouldRenderDiffTooltip
            ? ''
            : `<span style="color: ${nexyColors.blueyGrey}; font-weight: 400; font-size: 10px;">% diff. from base</span>`
        }
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="color: ${nexyColors.white}; font-weight: 500;">{${item.dataFields.valueY}}</span>
               ${
                 shouldRenderDiffTooltip
                   ? ''
                   : `        <span style="color: ${getPercentageColor(
                       yAxis?.changePercent,
                       yAxis?.lowerIsBetter,
                     )}; font-weight: 500; font-size: 10px; text-align: end">${yAxis?.changePercent < 0 ? '' : '+'}${
                       yAxis?.changePercent
                     }%
        </span>`
               }

      </div>
    </div>
      </div>
        <div style="padding:2px 12px 12px;display: flex;justify-content: space-between; align-items: baseline; gap: 16px; min-width: 125px; margin-bottom: ${
          idx === chartRef.current.series.length - 1 ? '0' : '-14px'
        }">
      <span style="color: #C7C8D1; font-size: 10px;">
        Reliability
      </span><span style=" font-size: 8.5px; color: ${nexyColors.neutral900}; background: ${getAccuracyColorByLabel(
        yAxis?.label,
      )};display: inline-flex;padding: 2px 8px;justify-content: center;align-items: center;border-radius: 25px;">${capitalize(
        yAxis?.label,
      )}</span>
    </div>
    `;
      });

      return content;
    });
  };

  const createBullet = (series: XYSeries, lineColor: string | Color) => {
    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 10;
    bullet.fill = am4core.color(lineColor);
    bullet.fillOpacity = 1;
    bullet.circle.strokeWidth = 1;
    bullet.strokeOpacity = 0;
    bullet.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    // Add click event handler to show an alert on bullet click
    bullet.events.on(
      'hit',
      (event) => {
        const dataItem = event.target.dataItem;
        // Check if dataItem exists and has dataContext
        if (dataItem && dataItem.dataContext) {
          // @ts-ignore -- change selected scenario id based on the bullet you click
          setSelectedScenarioId(dataItem.dataContext.scenarioId);
        }
      },
      this,
    );

    // Use an adapter to dynamically set the bullet color based on data
    bullet.adapter.add('fill', (color, target) => {
      const dataItem = target.dataItem;
      if (dataItem && dataItem.dataContext) {
        // @ts-ignore
        if (dataItem.dataContext.isBaseScenario) {
          return am4core.color(nexyColors.lilac);
        }
        // @ts-ignore
        if (dataItem.dataContext.isApplied) {
          return am4core.color(nexyColors.pumpkinOrange);
        }
        // @ts-ignore
        if (dataItem.dataContext.scenarioId === selectedScenarioId) {
          return am4core.color(nexyColors.azure);
        }
      }
      return color; // Return the default color if there's no dataItem or dataContext
    });

    const shadow = bullet.circle.filters.push(new am4core.DropShadowFilter());
    shadow.dx = 0;
    shadow.dy = 1;
    shadow.blur = 1.5;
    shadow.opacity = 0.2;
    shadow.color = am4core.color('rgba(5, 168, 250, 1)'); // Set the shadow color here

    const label = bullet.createChild(am4core.Label);
    label.adapter.add('textOutput', function (text, target) {
      // @ts-ignore
      if (target.dataItem && target.dataItem?.idx != null) {
        // @ts-ignore Directly return the idx value without formatting due to the '#.0aa' formatting affecting the idx
        return target.dataItem.idx.toString();
      }
      return text;
    });

    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fill = am4core.color(nexyColors.raisinBlack);
    label.fontSize = 10;
    // Use an adapter to dynamically set the label color based on data
    label.adapter.add('fill', (color, target) => {
      const dataItem = target.dataItem;
      if (dataItem && dataItem.dataContext) {
        // @ts-ignore
        if (dataItem.dataContext.isBaseScenario) {
          return am4core.color(nexyColors.white);
        }
        // @ts-ignore
        if (dataItem.dataContext.scenarioId === selectedScenarioId) {
          return am4core.color(nexyColors.white);
        }
      }
      return color; // Return the default color if there's no dataItem or dataContext
    });
  };

  const createSeries = (
    fieldX: string,
    fieldY: string,
    name: string,
    lineColor: string | Color,
    isDashed = false,
    isStepLine = false,
  ) => {
    if (!chartRef.current) return;
    // Init series
    const seriesType = isStepLine ? am4charts.StepLineSeries : am4charts.LineSeries;
    const series = chartRef.current.series.push(new seriesType());

    series.name = name;
    series.id = fieldY;
    series.dataFields.valueY = fieldY;
    series.dataFields.valueX = fieldX;
    series.dataFields.idx = 'idx';
    series.dataFields.isBaseScenario = 'isBaseScenario';
    series.dataFields.isApplied = 'isApplied';

    series.strokeWidth = 3;
    series.stroke = am4core.color(lineColor);

    series.tensionX = 0.9;
    series.clustered = true;
    // series.showOnInit = true;

    if (isDashed) {
      series.tensionX = 1.0;
      series.tensionY = 1.0;
      series.strokeDasharray = '16,6';
    }

    createBullet(series, lineColor);
    createTooltip(series);

    return series;
  };

  const createCustomLegendItem = (title, color) => {
    const container = chartRef.current.legend.createChild(am4core.Container);
    container.layout = 'grid';
    container.width = 200;
    container.padding(0, 10, 0, 10); // Adjust as needed
    container.valign = 'middle'; // Vertical alignment in
    // container.horizontalCenter = 'middle'; // Horizontally center the container itself
    // container.verticalCenter = 'middle'; // Vertically center the container itself

    const marker = container.createChild(am4core.Circle);
    marker.width = 12;
    marker.height = 12;
    marker.fill = am4core.color(color);
    marker.strokeWidth = 0;
    marker.marginRight = 5;
    marker.verticalCenter = 'middle'; // Vertically align the

    const label = container.createChild(am4core.Label);
    label.text = title;
    label.fill = am4core.color(nexyColors.raisinBlack); // Text color
    label.marginLeft = 5;
  };

  React.useEffect(() => {
    // destroy chart in case of re-render
    chartRef.current && chartRef.current.dispose();
    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);

    chartRef.current.data = axisMetrics.map((axisMetric, index) => ({
      ...axisMetric,
      // We need to display a bullet number representing the scenario index, but we can't use the scenarioId
      idx: index + 1,
      scenarioId: axisMetric.xAxis?.scenarioId,
      fieldX: axisMetric.xAxis?.currentScenario,
      fieldY: axisMetric.yAxis?.currentScenario,
      isBaseScenario: axisMetric.xAxis?.isBaseScenario || axisMetric.yAxis?.isBaseScenario,
      isApplied: axisMetric.xAxis.isApplied || axisMetric.yAxis.isApplied,
    }));

    //Any number smaller than this will be considered "small" number, which will
    //trigger special formatting if "a" format modifier is used.
    chartRef.current.numberFormatter.smallNumberThreshold = 0.01;
    chartRef.current.numberFormatter.numberFormat = '#.00aa';

    chartRef.current.marginRight = 200;
    chartRef.current.marginLeft = 20;

    const xValueAxis = chartRef.current.xAxes.push(new am4charts.ValueAxis());
    xValueAxis.renderer.labels.template.fontSize = 12;
    xValueAxis.renderer.minGridDistance = 50;
    xValueAxis.renderer.grid.template.location = 0.5;
    xValueAxis.startLocation = 0.5;
    xValueAxis.endLocation = 0.5;
    xValueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    xValueAxis.renderer.grid.template.strokeOpacity = 0;

    // Add value axis
    const yValueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    yValueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
    yValueAxis.renderer.grid.template.strokeOpacity = 1;
    yValueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    yValueAxis.renderer.labels.template.fontSize = 12;
    yValueAxis.renderer.gridContainer.toFront();
    yValueAxis.renderer.labels.template.adapter.add('text', (text) => (text ? text.toUpperCase() : text));

    xValueAxis.renderer.labels.template.dy = 8;
    xValueAxis.title.text = axisMetrics[0].xAxis.name?.toUpperCase() || '';
    xValueAxis.title.fontSize = 11;
    xValueAxis.title.align = 'center';
    xValueAxis.title.fontWeight = 'bold';
    xValueAxis.title.fill = am4core.color(nexyColors.cloudyBlue80);
    xValueAxis.title.dy = 10;

    // yValueAxis.cursorTooltipEnabled = false;
    yValueAxis.title.text = axisMetrics[0].yAxis.name?.toUpperCase() || '';
    yValueAxis.title.fill = am4core.color(nexyColors.cloudyBlue80);
    yValueAxis.title.fontSize = 11;
    yValueAxis.title.fontWeight = 'bold';

    yValueAxis.extraMin = 0.05;
    yValueAxis.extraMax = 0.05;

    xValueAxis.extraMin = 0.05;
    xValueAxis.extraMax = 0.05;

    // Create series
    const series = createSeries('fieldX', 'fieldY', 'Scenarios', '#c3ebf9', true);

    chartRef.current.cursor = new am4charts.XYCursor();
    chartRef.current.cursor.snapToSeries = series;
    chartRef.current.cursor.maxTooltipDistance = -1;
    // Disable axis lines
    chartRef.current.cursor.lineX.disabled = false;
    chartRef.current.cursor.lineY.disabled = false;

    chartRef.current.cursor.lineX.stroke = nexyColors.frenchGray;
    chartRef.current.cursor.lineY.stroke = nexyColors.frenchGray;

    chartRef.current.cursor.lineX.strokeDasharray = '6 6';
    chartRef.current.cursor.lineY.strokeDasharray = '6 6';

    chartRef.current.cursor.lineX.strokeWidth = 2;
    chartRef.current.cursor.lineY.strokeWidth = 2;

    // Enabling cursor tooltips for both axes
    xValueAxis.cursorTooltipEnabled = true;
    yValueAxis.cursorTooltipEnabled = true;

    // Styling the xValueAxis cursor tooltip
    xValueAxis.tooltip.background.fill = am4core.color(nexyColors.white);
    xValueAxis.tooltip.background.stroke = am4core.color('rgba(0,0,0,0)');
    xValueAxis.tooltip.background.strokeWidth = 0;
    xValueAxis.tooltip.label.fill = am4core.color(nexyColors.coolGray);
    xValueAxis.tooltip.label.fontSize = 12;
    xValueAxis.tooltip.label.fontWeight = 'bold';

    // Styling the yValueAxis cursor tooltip
    yValueAxis.tooltip.background.fill = am4core.color(nexyColors.white);
    yValueAxis.tooltip.background.stroke = am4core.color('rgba(0,0,0,0)');
    yValueAxis.tooltip.background.strokeWidth = 0;
    yValueAxis.tooltip.label.fill = am4core.color(nexyColors.coolGray);
    yValueAxis.tooltip.label.fontSize = 12;
    yValueAxis.tooltip.label.fontWeight = 'bold';

    xValueAxis.renderer.labels.template.dy = 8;
    // Disable zoom
    chartRef.current.cursor.behavior = 'none';
    chartRef.current.zoomOutButton.disabled = true;
    // Legend
    chartRef.current.legend = new am4charts.Legend();
    chartRef.current.legend.contentAlign = 'left';
    chartRef.current.legend.marginTop = 40;
    chartRef.current.legend.paddingLeft = 40;
    // Remove default legend items, but keep the custom legend items
    chartRef.current.legend.data = [];

    if (appliedScenario) {
      createCustomLegendItem('Applied scenario', nexyColors.pumpkinOrange);
    }

    createCustomLegendItem('Base scenario', nexyColors.lilac);
    createCustomLegendItem('Selected scenario', nexyColors.azure);
    createCustomLegendItem('Unselected scenario', nexyColors.lightBlue100);

    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, [axisMetrics, selectedScenarioId]);

  return (
    <ChartContainerStyled
      data-cy="scenarioOverviewChart"
      id={CHART_CONTAINER}
      style={{
        width: '100%',
        height: '530px',
        marginBottom: '50px',
      }}
    />
  );
}

export default SimulationOverview;
