import React, { useEffect, useRef } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { nexyColors } from 'theme';
import { StringParam, useQueryParams } from 'use-query-params';

import { NexoyaBudgetDailyItem, NexoyaDailyMetric } from 'types/types';

import { usePortfolio } from '../../../context/PortfolioProvider';

import { GLOBAL_DATE_FORMAT, CHART_TOOLTIP_DATE_FORMAT } from '../../../utils/dates';
import { addDays } from '../../../utils/overviewUtils';
import { getDailySpendPerProvider } from '../../../utils/provider';
import translate from '../../../utils/translate';
import { addExportMenu } from '../utils/addExportMenu';
import { addWatermark } from '../utils/addWatermark';
import { determinePadding } from '../utils/budgetChart';

import { findBudgetItemAmountForDay } from '../../../routes/portfolio/components/BudgetItem/utils';

import { ChartContainerStyled, NexyChartClasses } from '../styles/PortfolioPerformanceChart';
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';
import { formatNumber } from 'utils/formater';
import useTranslationStore from '../../../store/translations';

dayjs.extend(isoWeek);
am4core.useTheme(am4themes_animated);

interface Props {
  portfolioName: string;
  dailySpendings: NexoyaDailyMetric[];
  budgetDailyItems: NexoyaBudgetDailyItem[];
}

const CHART_CONTAINER = 'portfolio-overview-budget-chart';

function BudgetOverview({ portfolioName, dailySpendings, budgetDailyItems }: Props) {
  const { translations } = useTranslationStore();
  const chartRef = useRef(null);
  const {
    providers: { providersFilter },
  } = usePortfolio();
  const { currency, numberFormat } = useCurrencyStore();

  const [queryParams] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });
  const createSeries = (fieldX, fieldY, name, lineColor, isDashed = false, isFilter = false, hasBackdrop = false) => {
    if (!chartRef.current) return;
    // Init series
    const series = chartRef.current.series.push(isDashed ? new am4charts.StepLineSeries() : new am4charts.LineSeries());

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
    series.tensionX = 1.0;
    series.tensionY = 1.0;

    if (hasBackdrop) {
      const gradient = new am4core.LinearGradient();
      gradient.addColor(am4core.color('#C7C8D1'), 0.3);
      gradient.addColor(am4core.color('#C7C8D1'), 0.3);
      gradient.rotation = 90; // Vertical gradient

      // Apply gradient to series
      series.fill = gradient;
      series.fillOpacity = 1;
      series.fillModifier = new am4core.LinearGradientModifier();
    }

    if (isDashed) {
      series.tensionX = 1.0;
      series.tensionY = 1.0;
    }
    series.showOnInit = true;

    // Tooltip shadow
    const tooltipShadow = series.tooltip.background.filters.getIndex(0);
    tooltipShadow.dx = 5;
    tooltipShadow.dy = 5;
    tooltipShadow.blur = 8;
    tooltipShadow.color = am4core.color(nexyColors.darkGrey);
    tooltipShadow.opacity = 0.2;

    if (isDashed) {
      series.strokeDasharray = '10';
    }

    if (isFilter) {
      series.fill = series.stroke;
      series.fillOpacity = 1;
      series.tensionX = 1.0;
      series.tensionY = 1.0;
      series.stacked = true;
    }

    // Set up tooltip
    series.adapter.add('tooltipHTML', function (_, target) {
      const formattedDate = dayjs(target.tooltipDataItem.dateX).format(CHART_TOOLTIP_DATE_FORMAT);
      let content = `<div class="${NexyChartClasses.tooltip}">${formattedDate}</div>`;
      const seriesLength = chartRef.current.series.length;
      chartRef.current.series.each(function (item, index) {
        const value = `${currencySymbol[currency]} ${formatNumber(
          item.dataItems.getIndex(target.tooltipDataItem.index)?.valueY,
          numberFormat,
        )}`;

        const padding = determinePadding(index, seriesLength);

        content += `<div style="display:flex;justify-content:space-between;align-items:center;gap: 16px;padding:${padding};">
      <span style="color: #C7C8D1; font-weight: 400;">
        <span style="width: 8px; height: 8px; background-color: ${item.stroke}; border-radius: 50%; display: inline-block; margin-right: 4px;"></span>${item.name}:</span>
      <span>${value}</span>
      </div>`;
      });

      return content;
    });

    return series;
  };

  useEffect(() => {
    // destroy chart in case of re-render
    chartRef.current && chartRef.current.dispose();

    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);

    const dateFrom = dayjs(queryParams.dateFrom);
    const dateTo = dayjs(queryParams.dateTo);
    const lastSpendingDate = dailySpendings?.length > 0 ? dayjs(dailySpendings[dailySpendings?.length - 1].day) : null;

    const startDate =
      lastSpendingDate && lastSpendingDate.isAfter(dateFrom) ? lastSpendingDate.add(1, 'day') : dateFrom;

    const extendedDailySpendings = dailySpendings
      ? [...dailySpendings]
      : addDays([], dateFrom.format(GLOBAL_DATE_FORMAT), dateTo.diff(dateFrom, 'day'));

    if (dateTo.isAfter(dayjs()) && lastSpendingDate && dateTo.isAfter(lastSpendingDate)) {
      extendedDailySpendings.push(...addDays([], startDate.format(GLOBAL_DATE_FORMAT), dateTo.diff(startDate, 'day')));
    }

    chartRef.current.data = extendedDailySpendings?.map((dailySpend) => ({
      timestamp: dailySpend.day,
      spent: dailySpend?.providers?.reduce((acc, curr) => acc + curr.adSpend, 0) || 'N/A',
      planned: findBudgetItemAmountForDay(dailySpend.day, budgetDailyItems),
      ...getDailySpendPerProvider(dailySpend),
    }));

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
    valueAxis.min = 0;
    valueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.gridContainer.toFront();
    valueAxis.renderer.labels.template.adapter.add('text', (text) => (text ? text.toUpperCase() : text));

    // Provider series first so that it stacks them correctly, otherwise they will be stacked on the first series available
    providersFilter.forEach((provider) => {
      const providerName = translate(translations, provider.name);
      createSeries('timestamp', provider.provider_id, providerName, provider?.providerLogoColor, false, true);
    });

    createSeries('timestamp', 'spent', 'Spent', '#05A8FA', false, false, !!providersFilter.length);
    createSeries('timestamp', 'planned', 'Planned', '#744CED', true, false);

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
    todayRange.date = today;
    todayRange.grid.stroke = am4core.color('#C12017');
    todayRange.grid.strokeWidth = 1.5;
    todayRange.grid.strokeOpacity = 1;
    todayRange.grid.above = true; // This ensures the line is above the chart

    // Enable export
    addExportMenu(chartRef, `Planned budgets chart_${portfolioName}`);
    addWatermark(chartRef);
  }, [providersFilter, dailySpendings]);

  return (
    <ChartContainerStyled
      data-cy="budgetOverviewChart"
      id={CHART_CONTAINER}
      style={{
        width: '100%',
        height: '330px',
        marginBottom: '50px',
      }}
    />
  );
}

export default BudgetOverview;
