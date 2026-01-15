import React, { useCallback } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { nexyColors } from 'theme';

import { NexoyaDailyPrediction, NexoyaDailyPredictionTotal } from '../../../../types';

import { capitalizeWords } from '../../../../utils/string';

import * as Styles from '../../../../components/Charts/styles/PortfolioPerformanceChart';
import { NexyChartClasses } from '../../../../components/Charts/styles/PortfolioPerformanceChart';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { GLOBAL_DATE_FORMAT, CHART_TOOLTIP_DATE_FORMAT } from 'utils/dates';
import { StringParam, useQueryParams } from 'use-query-params';
import ZoomOutButton from '../../../../components/Charts/ZoomOutButton';
import { useChartsStore } from 'store/charts';

am4core.useTheme(am4themes_animated);

interface Props {
  data: NexoyaDailyPrediction[] | NexoyaDailyPredictionTotal[];
}

const CHART_CONTAINER = 'prediction-score-chart';

export const PredictionTimelineChart = ({ data }: Props) => {
  const chartRef = React.useRef(null);
  const [qp, setQueryParams] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });
  const { initialDateRange } = useChartsStore();

  const handleZoomChange = useCallback(
    debounce((event: any) => {
      const minZoomed = event.target.minZoomed;
      const maxZoomed = event.target.maxZoomed;

      const dateFrom = dayjs(new Date(minZoomed)).format(GLOBAL_DATE_FORMAT);
      const dateTo = dayjs(new Date(maxZoomed)).format(GLOBAL_DATE_FORMAT);

      if (qp.dateFrom === qp.dateTo) return;

      if (dateFrom !== qp.dateFrom && dateTo !== qp.dateTo) {
        setQueryParams({ dateFrom, dateTo });
      }
    }, 10),
    [qp.dateFrom, qp.dateTo],
  );

  const createSeries = useCallback(
    (name, color, isExtension = false) => {
      if (!chartRef.current) return;
      // Init series
      const series = chartRef.current.series.push(new am4charts.LineSeries());

      series.name = 'Prediction score';
      series.dataFields.valueY = name;
      series.dataFields.dateX = 'day';
      series.strokeWidth = 3;
      series.stroke = am4core.color(color);
      series.tensionX = 0.8;
      series.showOnInit = true;

      if (isExtension) {
        series.strokeWidth = 6; // Increase line thickness here
        series.strokeOpacity = 0.3; // Decrease opacity here
      }

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
          } ">●</span>${item.name}</span>{${item.dataFields.valueY}}%</div>`;
        });
        return content;
      });

      return series;
    },
    [data],
  );

  React.useEffect(() => {
    chartRef.current && chartRef.current.dispose();
    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
    chartRef.current.numberFormatter.numberFormat = '#.00';
    chartRef.current.numberFormatter.smallNumberThreshold = 0.01;
    chartRef.current.data = data;
    chartRef.current.paddingLeft = 0;
    chartRef.current.dateFormatter.dateFormat = 'MMM d, yyyy';
    // Add date axis
    const dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
    dateAxis.animationDuration = 0;
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    dateAxis.renderer.grid.template.strokeOpacity = 0;
    dateAxis.events.on('selectionextremeschanged', handleZoomChange);
    dateAxis.rangeChangeDuration = 0;
    // Add value axis
    const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
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
    chartRef.current.zoomOutButton.disabled = true;
    // Add legend
    chartRef.current.legend = new am4charts.Legend();
    chartRef.current.legend.contentAlign = 'left';
    chartRef.current.legend.marginTop = 16;
    chartRef.current.legend.paddingLeft = 8;

    createSeries('score', nexyColors.greenTeal);
  }, [createSeries, data]);

  React.useEffect(() => {
    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);

  return (
    <div className="relative w-full">
      {initialDateRange && (qp.dateFrom !== initialDateRange.dateFrom || qp.dateTo !== initialDateRange.dateTo) && (
        <ZoomOutButton
          onClick={() =>
            setQueryParams({
              dateFrom: initialDateRange.dateFrom,
              dateTo: initialDateRange.dateTo,
            })
          }
        />
      )}
      <Styles.ChartContainerStyled
        data-cy="portfolioDetailedPerformanceChart"
        id={CHART_CONTAINER}
        style={{
          width: '100%',
          height: 700,
          marginBottom: 0,
        }}
      />
    </div>
  );
};
