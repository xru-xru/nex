import React, { useCallback, useRef } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { nexyColors } from 'theme';
import { BooleanParam, NumberParam, StringParam, useQueryParams } from 'use-query-params';

import { NexoyaDailyMetric, NexoyaFunnelStepType } from '../../types';

import { usePortfolio } from 'context/PortfolioProvider';
import { addTrendLine } from './utils/addTrendLine';
import { addWatermark } from './utils/addWatermark';
import { useGetSeriesColor } from 'utils/chart';

// TODO create sepparate styling
import * as Styles from './styles/PortfolioPerformanceChart';
import { NexyChartClasses } from './styles/PortfolioPerformanceChart';

import { usePortfolioToCostPerData } from './converters/portfolioToCostPerChartData';
import dayjs from 'dayjs';
import { getPercentageColor } from '../../utils/number';
import { addPortfolioEvents } from './utils/addPortfolioEvents';
import usePortfolioEventsStore from '../../store/portfolio-events';
import { Button } from '../../components-ui/Button';
import { ChevronsUpDown } from 'lucide-react';
import { debounce } from 'lodash';
import { GLOBAL_DATE_FORMAT, CHART_TOOLTIP_DATE_FORMAT } from '../../utils/dates';
import ZoomOutButton from './ZoomOutButton';
import { useChartsStore } from 'store/charts';

const CHART_CONTAINER = 'portfolio-performance-cost-per-chart';

function PortfolioCostPerChart({ dailyMetrics }: { dailyMetrics: NexoyaDailyMetric[] }) {
  const chartRef = useRef(null);
  const { portfolioEvents, areEventsExtended, setEventsExtended } = usePortfolioEventsStore();

  const {
    performanceChart: { showEvents },
    selectedFunnelStep: { selectedFunnelStep },
  } = usePortfolio();

  const [qp] = useQueryParams({
    compareFrom: StringParam,
    compareTo: StringParam,
    dateFrom: StringParam,
    dateTo: StringParam,
    dateComparisonActive: BooleanParam,
  });

  const isAwareness = selectedFunnelStep?.funnelStep?.type === NexoyaFunnelStepType.Awareness;
  const { dataForChart } = usePortfolioToCostPerData(
    selectedFunnelStep,
    isAwareness,
    dailyMetrics,
    selectedFunnelStep?.funnel_step_id,
  );
  // tab stuff
  const [, setQueryParams] = useQueryParams({
    activeTab: StringParam,
    optimizationId: NumberParam,
    dateFrom: StringParam,
    dateTo: StringParam,
  });

  const navigateToOptimizations = React.useCallback(
    () =>
      setQueryParams({
        activeTab: 'optimization',
      }),
    [setQueryParams],
  );

  const handleZoomChange = useCallback(
    debounce((event) => {
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

  const getSeriesColor = useGetSeriesColor();
  const createSeries = React.useCallback(
    ({ fieldX, fieldY, name, lineColor, isDashed = false, showArea = false, isValidationSeries = false }) => {
      if (!chartRef.current) return;
      // Init series
      const series = chartRef.current.series.push(new am4charts.LineSeries());

      series.name = name;
      series.id = fieldY;
      series.isValidationSeries = isValidationSeries;
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
      series.adapter.add('tooltipHTML', function (_, target) {
        const formattedDate = dayjs(target.tooltipDataItem.dateX).format(CHART_TOOLTIP_DATE_FORMAT);
        return `<div class="${
          NexyChartClasses.tooltip
        }">${formattedDate}</div><div style="padding:12px;display: flex;justify-content: space-between; gap: 16px;"><span style="color: #C7C8D1; font-weight: 300">Cost-per ${
          selectedFunnelStep?.funnelStep?.title || ''
        }</span>${target.tooltipDataItem.valueY}</div>`;
      });
      series.tooltip.animationDuration = 150;
      series.tooltip.animationEasing = am4core.ease.sinOut;
      series.tensionX = 1;
      series.showOnInit = true;

      if (name === 'Potential') {
        series.zIndex = 20;
      }

      const getComparisonTooltip = (series) => {
        return series.adapter.add('tooltipHTML', function () {
          const chart = series.chart;
          const currentIndex = series.tooltipDataItem.index;
          const dataItem = chart.data[currentIndex];

          let tooltipContent = `
            <div class="${NexyChartClasses.tooltip}" style="text-align: left;">
              <div style="color: #C7C8D1; font-weight: 300; margin-bottom: 4px;">
                Cost-per ${selectedFunnelStep?.funnelStep?.title || ''}
              </div>
              <div style="display: flex; flex-direction: column;">
          `;

          if (dataItem?.timestampComparison && dataItem?.valueTimeComparison !== null) {
            tooltipContent += `
              <div style="
                padding: 6px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                gap: 16px;
                min-width: 125px;
                margin-bottom: 0;
              ">
                <div style="
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                ">
                  <div style="
                    display: flex;
                    align-items: center;
                  ">
                    <div style="
                      width: 14px;
                      height: 2px;
                      border-top: 2px dashed ${getSeriesColor('past')};
                      margin-right: 4px;
                    "></div>
                    <span style="
                      color: ${nexyColors.paleGrey};
                      font-size: 12px;
                      text-transform: capitalize;
                    ">
                      ${dayjs(dataItem?.timestampComparison).format(CHART_TOOLTIP_DATE_FORMAT)}
                    </span>
                  </div>
                </div>
                <div style="
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                ">
                  <span style="
                    color: ${nexyColors.white};
                    font-weight: 500;
                  ">
                    ${chart.numberFormatter.format(dataItem?.valueTimeComparison, '#.00a')}
                  </span>
                </div>
              </div>
            `;
          }

          if (dataItem?.timestamp && dataItem?.value !== null) {
            tooltipContent += `
              <div style="
                padding: 6px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                gap: 16px;
                min-width: 125px;
                margin-bottom: 0;
              ">
                <div style="
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                ">
                  <div style="
                    display: flex;
                    align-items: center;
                  ">
                    <div style="
                      width: 14px;
                      height: 2px;
                      background-color: ${getSeriesColor('potential')};
                      margin-right: 4px;
                    "></div>
                    <span style="
                      color: ${nexyColors.paleGrey};
                      font-size: 12px;
                      text-transform: capitalize;
                    ">
                      ${dayjs(dataItem.timestamp).format(CHART_TOOLTIP_DATE_FORMAT)}
                    </span>
                  </div>
                  
                ${
                  dataItem.comparisonChangePercent
                    ? `
                <span style="
                  color: ${nexyColors.blueyGrey};
                  font-weight: 400;
                  font-size: 10px;
                  text-transform: lowercase;
                ">
                  % diff. from prev. period
                </span>
                `
                    : ''
                }
                </div>
                <div style="
                  display: flex;
                  flex-direction: column;
                  gap: 5px;
                  justify-content: flex-end;
                  align-items: flex-end;
                ">
                  <span style="
                    color: ${nexyColors.white};
                    font-weight: 500;
                  ">
                    ${chart.numberFormatter.format(dataItem.value, '#.00a')}
                  </span>
                  ${
                    dataItem.comparisonChangePercent
                      ? `
                   <span style="
                    color: ${getPercentageColor(dataItem.comparisonChangePercent, false)};
                    font-weight: 600;
                    font-size: 10px;
                    text-align: end;
                  ">
                    ${
                      (dataItem.comparisonChangePercent < 0 ? '' : '+') +
                      chart.numberFormatter.format(dataItem.comparisonChangePercent, '#.00a')
                    }%
                  </span>
                  `
                      : ''
                  }
                 
                </div>
              </div>`;
          }

          tooltipContent += `
        </div>
      </div>
    `;

          return tooltipContent;
        });
      };

      if (qp?.dateComparisonActive) {
        series.tooltipHTML = getComparisonTooltip(series);
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

      if (showArea) {
        series.dataFields.openValueY = 'baselinePerformance';
        series.fill = series.stroke;
        series.fillOpacity = 0.1;
      }

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.radius = 3;
      bullet.fill = am4core.color(lineColor);
      bullet.fillOpacity = 1;
      bullet.circle.strokeWidth = 1;
      bullet.strokeOpacity = 0;
      bullet.circle.stroke = am4core.color('#fff');

      const bulletHoverState = bullet.states.create('hover');
      bulletHoverState.properties.scale = 2;
      bulletHoverState.properties.strokeOpacity = 1;

      return series;
    },
    // eslint-disable-next-line
    [navigateToOptimizations],
  );

  // Use global charts store for initial date range
  const { initialDateRange } = useChartsStore();

  React.useEffect(() => {
    // destroy chart in case of re-render
    chartRef.current && chartRef.current.dispose();

    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
    chartRef.current.data = dataForChart;
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
    dateAxis.events.on('selectionextremeschanged', handleZoomChange);
    dateAxis.rangeChangeDuration = 0; // Disables animation when range changes

    // Add value axis
    const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.gridContainer.toFront();
    valueAxis.renderer.labels.template.adapter.add('text', (text) => (text ? text.toUpperCase() : text));

    // Init series
    createSeries({
      fieldX: 'timestamp',
      fieldY: 'value',
      name: 'Effective',
      lineColor: qp.dateComparisonActive ? getSeriesColor('potential') : getSeriesColor('achieved'),
      isDashed: false,
      showArea: false,
      isValidationSeries: false,
    });

    qp?.dateComparisonActive &&
      createSeries({
        fieldX: 'timestamp',
        fieldY: 'valueTimeComparison',
        name: 'Effective',
        lineColor: getSeriesColor('past'),
        isDashed: true,
        showArea: false,
        isValidationSeries: false,
      });
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
    dateAxis.renderer.labels.template.dy = 8;

    chartRef.current.zoomOutButton.disabled = true;

    chartRef.current.numberFormatter.numberFormat = '#.0a';
    chartRef.current.numberFormatter.smallNumberThreshold = 0.01;

    if (qp?.dateComparisonActive) {
      dateAxis.hide();
      chartRef.current.cursor.behavior = 'none';
    }

    // Enable export
    // addExportMenu(chartRef, `${portfolio?.title}_cost per ${selectedFunnelStep?.title?.toLowerCase()}`);
    addWatermark(chartRef);
    !qp?.dateComparisonActive && addTrendLine(chartRef.current, dataForChart, getSeriesColor('trend'));

    if (showEvents) {
      addPortfolioEvents({
        dateAxis,
        portfolioEvents,
        extended: areEventsExtended,
        getSeriesColor,
        dateComparisonActive: qp?.dateComparisonActive,
        timeperiod: {
          start: qp.dateFrom,
          end: qp.dateTo,
        },
        timeperiodComparison: {
          start: qp.compareFrom,
          end: qp.compareTo,
        },
      });
    }
  }, [dataForChart, createSeries, getSeriesColor, qp.dateComparisonActive]);

  // Set localization of chart
  if (chartRef.current) {
    chartRef.current.numberFormatter.numberFormat = '#.0a';
  }
  return (
    <div className="relative">
      {/* Zoom-Out Button: only show if current date range differs from initial */}
      {!qp.dateComparisonActive &&
        initialDateRange &&
        (qp.dateFrom !== initialDateRange.dateFrom || qp.dateTo !== initialDateRange.dateTo) && (
          <ZoomOutButton
            onClick={() => {
              setQueryParams({
                dateFrom: initialDateRange.dateFrom,
                dateTo: initialDateRange.dateTo,
              });
            }}
          />
        )}
      <Styles.ChartContainerStyled id={CHART_CONTAINER} data-cy="portfolioCostPerChart" />
      {showEvents && portfolioEvents?.length ? (
        <Button
          style={{ filter: 'drop-shadow(0px 4px 8px rgba(138, 140, 158, 0.25))' }}
          className="absolute bottom-[55px] right-0 h-5 w-5 rounded-full transition-opacity hover:bg-neutral-50 hover:text-neutral-600 group-hover:opacity-100"
          onClick={() => setEventsExtended(!areEventsExtended)}
          variant="outline"
          size="icon"
        >
          <ChevronsUpDown />
        </Button>
      ) : null}
    </div>
  );
}

export default PortfolioCostPerChart;
