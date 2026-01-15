import React from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import { ColumnSeries } from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { nexyColors } from 'theme';
import { StringParam, useQueryParams } from 'use-query-params';

import { NexoyaPortfolioType, NexoyaTargetDailyItem } from '../../../types';
import { NexoyaDailyMetric } from 'types/types';

import { determinePadding } from '../utils/budgetChart';

import { calculateCostRatioPerDay, findTargetItemForDay } from '../../../routes/portfolio/components/TargetItem/utils';

import { ChartContainerStyled, NexyChartClasses } from '../styles/PortfolioPerformanceChart';
import { addDays } from '../../../utils/overviewUtils';
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';
import { formatNumber } from '../../../utils/formater';
import { CHART_TOOLTIP_DATE_FORMAT } from '../../../utils/dates';

dayjs.extend(isoWeek);
am4core.useTheme(am4themes_animated);

interface Props {
  dailyMetrics: NexoyaDailyMetric[];
  targetDailyItems: NexoyaTargetDailyItem[];
  portfolioType: NexoyaPortfolioType;
}

const CHART_CONTAINER = 'portfolio-overview-target-chart';

type CornerRadiusType =
  | 'cornerRadiusTopLeft'
  | 'cornerRadiusTopRight'
  | 'cornerRadiusBottomRight'
  | 'cornerRadiusBottomLeft';

function TargetOverview({ dailyMetrics, targetDailyItems, portfolioType }: Props) {
  const chartRef = React.useRef(null);

  const [queryParams] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });

  const { currency, numberFormat } = useCurrencyStore();

  const setDynamicCornerRadiusForColumns = (series: am4charts.ColumnSeries, cornerKey: CornerRadiusType) => {
    series.columns.template.column.adapter.add(cornerKey, function (radius, target) {
      const dataItem = target.dataItem;
      if (dataItem) {
        // @ts-ignore
        const value = dataItem.valueY;
        // @ts-ignore
        const open = dataItem.openValueY;
        if ((cornerKey === 'cornerRadiusTopLeft' || cornerKey === 'cornerRadiusTopRight') && value > open) {
          return 4;
        } else if (
          (cornerKey === 'cornerRadiusBottomLeft' || cornerKey === 'cornerRadiusBottomRight') &&
          value <= open
        ) {
          return 4;
        } else {
          return 0;
        }
      }
      return radius;
    });
  };

  const createSeries = (fieldX, fieldY, name, lineColor, isDashed = false, isLineSeries = true) => {
    if (!chartRef.current) return;
    // Init series
    const seriesType = isLineSeries
      ? isDashed
        ? am4charts.StepLineSeries
        : am4charts.LineSeries
      : am4charts.ColumnSeries;

    const series = chartRef.current.series.push(new seriesType());

    series.name = name;
    series.id = fieldY;
    series.dataFields.valueY = fieldY;
    series.dataFields.dateX = fieldX;
    series.strokeWidth = 3;
    series.stroke = am4core.color(lineColor);
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
    series.tensionX = 0.9;
    series.clustered = true;

    if (seriesType === ColumnSeries) {
      series.zIndex = -10;
      series.strokeWidth = 0;
      series.stacked = true;
      series.columns.template.fillOpacity = 1;
      series.columns.template.fill = am4core.color(lineColor);
      series.dataFields.openValueY = 'open';

      setDynamicCornerRadiusForColumns(series, 'cornerRadiusTopLeft');
      setDynamicCornerRadiusForColumns(series, 'cornerRadiusTopRight');
      setDynamicCornerRadiusForColumns(series, 'cornerRadiusBottomLeft');
      setDynamicCornerRadiusForColumns(series, 'cornerRadiusBottomRight');
    }

    if (isDashed) {
      series.tensionX = 1.0;
      series.tensionY = 1.0;
    }
    series.showOnInit = true;

    if (name === 'Potential') {
      series.zIndex = 20;
    }

    // Tooltip shadow
    const tooltipShadow = series.tooltip.background.filters.getIndex(0);
    tooltipShadow.dx = 5;
    tooltipShadow.dy = 5;
    tooltipShadow.blur = 8;
    tooltipShadow.color = am4core.color(nexyColors.darkGrey);
    tooltipShadow.opacity = 0.2;

    if (isDashed) {
      series.strokeDasharray = '16,6';
    }

    // Set up tooltip
    series.adapter.add('tooltipHTML', function (_, target) {
      const formattedDate = dayjs(target.tooltipDataItem.dateX).format(CHART_TOOLTIP_DATE_FORMAT);
      let content = `<div class="${NexyChartClasses.tooltip}">${formattedDate}</div>`;
      const seriesLength = chartRef.current.series.length;
      chartRef.current.series.each(function (item, index) {
        const value = item.dataItems.getIndex(target.tooltipDataItem.index)?.valueY;
        let formattedValue = 'N/A';
        if (value) {
          if (portfolioType === NexoyaPortfolioType.CostPer) {
            formattedValue = `${currencySymbol[currency]} ${formatNumber(value, numberFormat)}`;
          } else if (portfolioType === NexoyaPortfolioType.Roas) {
            formattedValue = `${value.toFixed(2)}%`;
          }
        }

        const padding = determinePadding(index, seriesLength);

        content += `<div style="display:flex;justify-content:space-between;align-items:center;gap: 16px;padding:${padding};">
      <span style="color: #C7C8D1; font-weight: 400; display: flex; align-items: center">
        <span style="color: ${item.stroke}; font-size: 8px; margin-right: 4px;">●</span>${item.name}:</span>
      <span>${formattedValue}</span>
      </div>`;
      });

      return content;
    });

    return series;
  };

  React.useEffect(() => {
    // destroy chart in case of re-render
    chartRef.current && chartRef.current.dispose();
    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
    const dateFrom = dayjs(queryParams.dateFrom);
    const dateTo = dayjs(queryParams.dateTo);
    const lastSpendingDate = dailyMetrics?.at(-1)?.day;

    const startDate =
      lastSpendingDate && dayjs(lastSpendingDate).isAfter(dateFrom) ? dayjs(lastSpendingDate).add(1, 'day') : dateFrom;

    const daysToAdd = dateTo.diff(startDate, 'day');

    const extendedDailyMetrics = dailyMetrics || addDays([], dateFrom, dateTo.diff(dateFrom, 'day'));

    if (dateTo.isAfter(dayjs()) && lastSpendingDate && dateTo.isAfter(lastSpendingDate)) {
      extendedDailyMetrics.push(...addDays([], startDate, daysToAdd));
    }

    chartRef.current.data = extendedDailyMetrics?.map((dailyMetric: NexoyaDailyMetric) => {
      const target = findTargetItemForDay(dailyMetric.day, targetDailyItems)?.value || 0;
      const { costRatio, roas } = calculateCostRatioPerDay(dailyMetric);
      const achieved = portfolioType === NexoyaPortfolioType.Roas ? roas : costRatio || 0;
      return {
        timestamp: dailyMetric.day,
        target,
        achieved: achieved ? achieved : undefined,
        open: target,
      };
    });

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
    valueAxis.renderer.labels.template.adapter.add('text', (text) => (text ? text.toUpperCase() : text));
    // Create series
    createSeries('timestamp', 'target', 'Daily target', '#744CED', true, true);
    createSeries('timestamp', 'achieved', 'Daily achieved', '#05A8FA', false, false);

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
    dateAxis.renderer.labels.template.dy = 8;
    // Disable zoom
    chartRef.current.cursor.behavior = 'none';
    chartRef.current.zoomOutButton.disabled = true;
    // Legend
    chartRef.current.legend = new am4charts.Legend();
    chartRef.current.legend.contentAlign = 'left';
    chartRef.current.legend.marginTop = 40;
    chartRef.current.legend.paddingLeft = 40;

    // Add "today line" guide
    const today = new Date();
    const todayRange = dateAxis.axisRanges.create();
    todayRange.zIndex = 10;
    todayRange.date = today;
    todayRange.grid.stroke = am4core.color('#C12017');
    todayRange.grid.strokeWidth = 1.5;
    todayRange.grid.strokeOpacity = 1;
    todayRange.grid.above = true; // This ensures the line is above the chart
  }, [dailyMetrics, targetDailyItems, portfolioType, queryParams.dateFrom, queryParams.dateTo]);

  return (
    <ChartContainerStyled
      data-cy="targetPacingChart"
      id={CHART_CONTAINER}
      style={{
        width: '100%',
        height: '330px',
        marginBottom: '50px',
      }}
    />
  );
}

export default TargetOverview;
