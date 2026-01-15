import React, { useEffect } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { Color } from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import dayjs from 'dayjs';

import { NexoyaFunnelStepPredictionScore, NexoyaPredictionTotal } from '../../../../../types';

import {
  ChartContainerStyled,
  NexyChartClasses,
} from '../../../../../components/Charts/styles/PortfolioPerformanceChart';

import { nexyColors } from '../../../../../theme';

am4core.useTheme(am4themes_animated);

const CHART_CONTAINER = 'prediction-score-bar';

interface Props {
  dateFrom: Date;
  dateTo: Date;
  predictionFunnelSteps: NexoyaFunnelStepPredictionScore[];
  totalPredictionData: NexoyaPredictionTotal;
  selectedFunnelStepId: number;
}

const getColorBasedOnThreshold = (threshold: number): Color => {
  if (threshold > 70) {
    return am4core.color('#88E7B7');
  } else if (threshold > 30) {
    return am4core.color('#E8C389');
  }
  return am4core.color('#E88990');
};

export const PredictionThresholdsChart = ({
  dateFrom,
  dateTo,
  predictionFunnelSteps,
  totalPredictionData,
  selectedFunnelStepId,
}: Props) => {
  const chartRef = React.useRef(null);
  const readableDate = dayjs(dateFrom).format('D MMM') + ' - ' + dayjs(dateTo).format('D MMM YYYY');

  const { accuracyBuckets } =
    selectedFunnelStepId === -1
      ? totalPredictionData
      : predictionFunnelSteps?.find((fs) => fs.funnelStepId === selectedFunnelStepId) ?? {};

  function generateTooltipItem(threshold: number, range: string) {
    const color = getColorBasedOnThreshold(threshold);
    return `
    <div class="item-container">
      <div style="color: #F0F2FA; max-width: 250px; white-space: pre-line;">Days with scores within the ${range} range</div>
      <div class="column-right">
        <div style="color:${color}">{valueY}</div>
      </div>
    </div>
  `;
  }

  const createTooltip = (series: am4charts.ColumnSeries) => {
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
    series.columns.template.adapter.add('tooltipHTML', function (_, column) {
      const threshold = column?.dataItem?.dataContext?.['threshold'];
      const lowerBound = threshold - 10;
      const upperBound = threshold;
      const range = `${lowerBound}-${upperBound}%`;

      return `
        <div class="tooltip ${NexyChartClasses.tooltip}">${readableDate}</div>
        
        <div class="flex-container">
          ${generateTooltipItem(threshold, range)}
        </div>`;
    });

    series.tooltip.animationDuration = 150;
    series.tooltip.animationEasing = am4core.ease.sinOut;
  };

  useEffect(() => {
    chartRef.current && chartRef.current.dispose();
    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
    chartRef.current.data = accuracyBuckets
      ?.filter((bucket) => bucket.threshold)
      ?.sort((a, b) => b.threshold - a.threshold)
      ?.map((bucket, index) => ({
        category: `${bucket.threshold}%`,
        value: bucket.contentCount,
        specificName: `${index * 10}%`,
        threshold: bucket.threshold,
      }));

    // Create X axis
    const categoryAxis = chartRef.current.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.stroke = am4core.color('#DFE1ED8C');
    categoryAxis.renderer.grid.template.strokeOpacity = 1;
    categoryAxis.renderer.grid.template.strokeWidth = 2;

    categoryAxis.renderer.labels.template.location = 0;
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.labels.template.fontWeight = '400';
    categoryAxis.renderer.labels.template.opacity = 0.5;
    categoryAxis.renderer.labels.template.fill = am4core.color(nexyColors.paleSlateGray);

    // Create Y axis
    const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Number of Days';
    valueAxis.title.fill = am4core.color(nexyColors.cloudyBlue);

    valueAxis.maxPrecision = 0; // This will round off the axis labels to the nearest whole number

    valueAxis.renderer.grid.template.stroke = am4core.color('#DFE1ED8C');
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.grid.template.strokeWidth = 2;
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontWeight = '400';
    valueAxis.renderer.labels.template.opacity = 0.5;
    valueAxis.renderer.labels.template.fill = am4core.color(nexyColors.paleSlateGray);

    // Create series
    const series = chartRef.current.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'category';
    series.columns.template.strokeWidth = 0;
    series.columns.template.width = am4core.percent(98);

    series.columns.template.column.adapter.add('cornerRadiusTopLeft', function () {
      return 3;
    });
    series.columns.template.column.adapter.add('cornerRadiusTopRight', function () {
      return 3;
    });
    series.columns.template.adapter.add('fill', function (_, target) {
      const index = target.dataItem.index;

      if (index === 0 || index === 1) {
        return am4core.color('#88E7B7');
      } else {
        return am4core.color('#B4A7F6');
      }
    });

    series.columns.template.adapter.add('fill', function (_, target) {
      const threshold = target.dataItem.dataContext.threshold;

      return getColorBasedOnThreshold(threshold);
    });

    createTooltip(series);
    // Add cursor
    chartRef.current.cursor = new am4charts.XYCursor();
    chartRef.current.cursor.maxTooltipDistance = -1;
    // Disable axis lines
    chartRef.current.cursor.lineX.disabled = false;
    chartRef.current.cursor.lineY.disabled = true;
    chartRef.current.cursor.lineX.strokeDasharray = '';
    chartRef.current.cursor.lineX.stroke = nexyColors.blueGrey;
    // Disable axis tooltips
    categoryAxis.cursorTooltipEnabled = false;
    valueAxis.cursorTooltipEnabled = false;
    // Disable zoom
    chartRef.current.cursor.behavior = 'none';
    chartRef.current.zoomOutButton.disabled = true;
  }, [accuracyBuckets]);

  useEffect(() => {
    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);

  return (
    <ChartContainerStyled
      data-cy="predictionScoreBar"
      id={CHART_CONTAINER}
      style={{
        width: '100%',
        height: 700,
        marginBottom: 0,
      }}
    />
  );
};
