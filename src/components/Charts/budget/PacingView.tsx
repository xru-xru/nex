import React, { useCallback, useEffect, useRef } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import { ColumnSeries } from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import dayjs from 'dayjs';
import { capitalize, debounce } from 'lodash';
import isoWeek from 'dayjs/plugin/isoWeek';
import { nexyColors } from 'theme';

import { NexoyaBudgetDailyItem, NexoyaBudgetReallocation, NexoyaDailyMetric } from 'types/types';

import { usePortfolio } from '../../../context/PortfolioProvider';

import { addExportMenu } from '../utils/addExportMenu';
import { addWatermark } from '../utils/addWatermark';
import {
  determineItemName,
  determinePadding,
  OVERSPEND_VS_UNDERSPEND_NAME,
  PLANNED_TOOLTIP_NAME,
  REALLOCATED_TOOLTIP_NAME,
} from '../utils/budgetChart';

import {
  findBudgetItemAmountForDay,
  findReallocatedBudgetForDay,
} from '../../../routes/portfolio/components/BudgetItem/utils';

import { ChartContainerStyled, NexyChartClasses } from '../styles/PortfolioPerformanceChart';
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';
import { formatNumber } from 'utils/formater';
import { GLOBAL_DATE_FORMAT, CHART_TOOLTIP_DATE_FORMAT } from 'utils/dates';
import { StringParam, useQueryParams } from 'use-query-params';
import { useChartsStore } from 'store/charts';
import ZoomOutButton from '../ZoomOutButton';

dayjs.extend(isoWeek);
am4core.useTheme(am4themes_animated);

interface Props {
  portfolioName: string;
  dailySpendings: NexoyaDailyMetric[];
  budgetDailyItems: NexoyaBudgetDailyItem[];
  budgetReallocation: NexoyaBudgetReallocation;
}

const CHART_CONTAINER = 'portfolio-pacing-budget-chart';

type CornerRadiusType =
  | 'cornerRadiusTopLeft'
  | 'cornerRadiusTopRight'
  | 'cornerRadiusBottomRight'
  | 'cornerRadiusBottomLeft';
function PacingView({ portfolioName, dailySpendings, budgetDailyItems, budgetReallocation }: Props) {
  const chartRef = useRef(null);
  const [qp, setQueryParams] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });
  const {
    providers: { providersFilter },
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();
  const { currency, numberFormat } = useCurrencyStore();
  const { initialDateRange } = useChartsStore();

  const formatCurrencyValue = useCallback(
    (value?: number | null) => {
      const safeValue = typeof value === 'number' && Number.isFinite(value) ? value : 0;
      return `${currencySymbol[currency]} ${formatNumber(safeValue, numberFormat, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [currency, numberFormat],
  );

  const setDynamicCornerRadiusForColumns = (series: am4charts.ColumnSeries, cornerKey: CornerRadiusType) => {
    // @ts-ignore
    series.columns.template.column.adapter.add(cornerKey, function (radius, target) {
      const dataItem = target.dataItem;
      if (dataItem) {
        // @ts-ignore
        const value = dataItem?.valueY;
        // @ts-ignore
        const open = dataItem?.openValueY;
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
    series.clustered = false;

    if (seriesType === ColumnSeries) {
      series.zIndex = -10;
      series.strokeWidth = 0;
      // series.stacked = true;
      series.columns.template.fillOpacity = 1;
      series.columns.template.fill = am4core.color(lineColor);
      series.dataFields.openValueY = 'open';
      series.dataFields.reallocatedValueY = 'reallocated';

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
      let showReallocatedTooltip = false;
      const seriesLength = chartRef.current.series.length;
      chartRef.current.series.each(function (item, index) {
        let currencyValue;
        const dataItem = item.dataItems.getIndex(target.tooltipDataItem.index);
        const valueY = dataItem?.valueY;
        const openValueY = dataItem?.openValueY;
        const reallocatedValueY = dataItem?.reallocatedValueY;
        const isTodayOrInFuture =
          dayjs(dataItem?.dateX).isSame(dayjs(), 'day') || dayjs(dataItem?.dateX).isAfter(dayjs(), 'day');

        const underspendOrOverspend = valueY - openValueY;
        const reallocatedUnderspendOrOverspend = reallocatedValueY - openValueY;

        if (item.name === REALLOCATED_TOOLTIP_NAME && !reallocatedValueY) {
          return;
        }

        if (reallocatedValueY) {
          showReallocatedTooltip = true;
        }

        if (item.name === OVERSPEND_VS_UNDERSPEND_NAME && isTodayOrInFuture) {
          return;
        }

        if (item.name === PLANNED_TOOLTIP_NAME) {
          currencyValue = formatCurrencyValue(valueY);
        } else if (item.name === OVERSPEND_VS_UNDERSPEND_NAME) {
          currencyValue = formatCurrencyValue(underspendOrOverspend);
        } else if (item.name === REALLOCATED_TOOLTIP_NAME) {
          currencyValue = formatCurrencyValue(reallocatedUnderspendOrOverspend);
        }

        const padding = determinePadding(index, seriesLength);
        const itemName = determineItemName(item, valueY, openValueY);

        content += `<div style="display:flex;justify-content:space-between;align-items:center;gap: 16px;padding:${padding};">
      <span style="color: #C7C8D1; font-weight: 400;">
        <span style="color: ${item.stroke}; font-size: 16px; margin-right: 4px">●</span>${itemName}:</span>
      <span>${currencyValue}</span>
      </div>`;
      });

      if (showReallocatedTooltip) {
        content += `
      <div style="background: ${nexyColors.charcoalGrey}; height: 1px; padding: 0; margin: 4px 12px;"></div>
      <div style="color: ${
        nexyColors.frenchGray
      }; font-weight: 400; display:flex;justify-content:space-between;align-items:center;gap: 16px;padding: 12px 9px;">

    <div>Active budget delta:</div> <span style="color: white">${capitalize(
      portfolioMeta?.budgetDeltaHandlingPolicy.replaceAll('_', ' '),
    )}</span></div>
    <div style="font-weight: 400; font-size: 9px; padding: 0 8px 12px; max-width: 256px; white-space: pre-line;color: ${
      nexyColors.frenchGray
    }">Note: The active budget delta type can be changed or turned off under the edit portfolio in the settings menu.</div>
  `;
      }
      return content;
    });

    return series;
  };

  const handleZoomChange = useCallback(
    debounce((event: any) => {
      const minZoomed = event.target.minZoomed;
      const maxZoomed = event.target.maxZoomed;

      const dateFrom = dayjs(new Date(minZoomed)).format(GLOBAL_DATE_FORMAT);
      const dateTo = dayjs(new Date(maxZoomed)).format(GLOBAL_DATE_FORMAT);

      if (qp.dateFrom === qp.dateTo) {
        return;
      }

      if (dateFrom !== qp.dateFrom && dateTo !== qp.dateTo) {
        setQueryParams({
          dateFrom,
          dateTo,
        });
      }
    }, 10),
    [qp.dateFrom, qp.dateTo],
  );

  useEffect(() => {
    // destroy chart in case of re-render
    chartRef.current && chartRef.current.dispose();

    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
    chartRef.current.data = dailySpendings?.map((dailySpend) => {
      const planned = findBudgetItemAmountForDay(dailySpend.day, budgetDailyItems);
      const reallocated = findReallocatedBudgetForDay(dailySpend.day, budgetReallocation.dates);
      const spent = dailySpend.providers.reduce((acc, curr) => acc + curr?.value?.adSpend, 0);
      return {
        timestamp: dailySpend.day,
        planned,
        spent: spent ? spent : undefined,
        reallocated: reallocated
          ? reallocated < 0
            ? planned - Math.abs(reallocated)
            : planned + reallocated
          : undefined,
        open: planned,
      };
    });

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
    valueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.gridContainer.toFront();
    valueAxis.renderer.labels.template.adapter.add('text', (text) => (text ? text.toUpperCase() : text));
    // Create series
    createSeries('timestamp', 'planned', PLANNED_TOOLTIP_NAME, '#744CED', true, true);
    createSeries('timestamp', 'reallocated', REALLOCATED_TOOLTIP_NAME, '#E7E2FC', false, false);
    createSeries('timestamp', 'spent', OVERSPEND_VS_UNDERSPEND_NAME, '#05A8FA', false, false);

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

    // Enable export
    addExportMenu(chartRef, `Planned budgets chart_${portfolioName}`);
    addWatermark(chartRef);
  }, [dailySpendings, providersFilter]);

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
      <ChartContainerStyled
        data-cy="budgetPacingChart"
        id={CHART_CONTAINER}
        style={{
          width: '100%',
          height: '330px',
          marginTop: '32px',
          marginBottom: '50px',
        }}
      />
    </div>
  );
}

export default PacingView;
