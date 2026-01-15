import React, { useCallback, useRef } from 'react';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { nexyColors } from 'theme';
import { BooleanParam, NumberParam, StringParam, useQueryParams } from 'use-query-params';
import { usePortfolio } from 'context/PortfolioProvider';
import { addWatermark } from './utils/addWatermark';
import { useGetSeriesColor } from 'utils/chart';
import * as Styles from './styles/PortfolioPerformanceChart';
import { NexyChartClasses } from './styles/PortfolioPerformanceChart';
import dayjs from 'dayjs';
import { getPercentageColor } from '../../utils/number';
import { getLongerPeriod } from './utils/period';
import { usePortfolioToRoasData } from './converters/portfolioToRoasChartData';
import { addTrendLine } from './utils/addTrendLine';
import { debounce, round } from 'lodash';
import { CHART_TOOLTIP_DATE_FORMAT, GLOBAL_DATE_FORMAT } from '../../utils/dates';
import ZoomOutButton from './ZoomOutButton';
import { useChartsStore } from 'store/charts';
import { addPortfolioEvents } from './utils/addPortfolioEvents';
import usePortfolioEventsStore from '../../store/portfolio-events';
import { Button } from '../../components-ui/Button';
import { ChevronsUpDown } from 'lucide-react';
import { NexoyaDailyMetric } from '../../types';

const CHART_CONTAINER = 'portfolio-performance-roas-chart';

export function PortfolioRoasChart({ dailyMetrics = [] }: { dailyMetrics?: NexoyaDailyMetric[] }) {
  const chartRef = useRef(null);
  const {
    performanceChart: { showEvents },
    selectedFunnelStep: { selectedFunnelStep },
  } = usePortfolio();
  const { portfolioEvents, areEventsExtended, setEventsExtended } = usePortfolioEventsStore();

  const [qp, setQueryParams] = useQueryParams({
    compareFrom: StringParam,
    compareTo: StringParam,
    dateFrom: StringParam,
    dateTo: StringParam,
    dateComparisonActive: BooleanParam,
    activeTab: StringParam,
    optimizationId: NumberParam,
  });

  const { dataForChart } = usePortfolioToRoasData({
    dailyMetrics,
    funnelStepId: selectedFunnelStep?.funnel_step_id,
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
    ({ fieldX, fieldY, name, lineColor, isDashed = false }) => {
      if (!chartRef.current) return;

      const series = chartRef.current.series.push(new am4charts.LineSeries());
      series.name = name;
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
        }">${formattedDate}</div><div style="padding:12px;display: flex;justify-content: space-between; gap: 16px;"><span style="color: #C7C8D1; font-weight: 300">${
          selectedFunnelStep?.funnelStep?.title || ''
        } per cost</span>${round(target.tooltipDataItem.valueY, 2)}%</div>`;
      });
      series.tooltip.animationDuration = 150;
      series.tooltip.animationEasing = am4core.ease.sinOut;
      series.tensionX = 1;
      series.showOnInit = true;

      if (name === 'Potential') {
        series.zIndex = 20;
      }

      if (isDashed) {
        series.strokeDasharray = '16,6';
      }

      const getComparisonTooltip = (series) => {
        return series.adapter.add('tooltipHTML', function () {
          const chart = series.chart;
          const currentIndex = series.tooltipDataItem.index;
          const dataItem = chart.data[currentIndex];

          let tooltipContent = `
            <div class="${NexyChartClasses.tooltip}" style="text-align: left;">
              <div style="color: #C7C8D1; font-weight: 300; margin-bottom: 4px;">
                ${selectedFunnelStep?.funnelStep?.title || ''} per cost
              </div>
              <div style="display: flex; flex-direction: column;">
          `;

          // Add comparison period data if available
          if (dataItem?.timestampComparison && dataItem?.valueTimeComparison !== null) {
            tooltipContent += `
              <div style="padding: 6px; display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; min-width: 125px; margin-bottom: 0;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 14px; height: 2px; border-top: 2px dashed ${getSeriesColor('past')}; margin-right: 4px;"></div>
                    <span style="color: ${nexyColors.paleGrey}; font-size: 12px; text-transform: capitalize;">
                      ${dayjs(dataItem?.timestampComparison).format(CHART_TOOLTIP_DATE_FORMAT)}
                    </span>
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <span style="color: ${nexyColors.white}; font-weight: 500;">
                    ${chart.numberFormatter.format(dataItem?.valueTimeComparison, '#.00')}%
                  </span>
                </div>
              </div>
            `;
          }

          // Add current period data
          if (dataItem?.timestamp && dataItem?.value !== null) {
            tooltipContent += `
              <div style="padding: 6px; display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; min-width: 125px; margin-bottom: 0;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 14px; height: 2px; background-color: ${getSeriesColor('potential')}; margin-right: 4px;"></div>
                    <span style="color: ${nexyColors.paleGrey}; font-size: 12px; text-transform: capitalize;">
                      ${dayjs(dataItem.timestamp).format(CHART_TOOLTIP_DATE_FORMAT)}
                    </span>
                  </div>
                  ${
                    dataItem.comparisonChangePercent
                      ? `<span style="color: ${nexyColors.blueyGrey}; font-weight: 400; font-size: 10px; text-transform: lowercase;">
                          % diff. from prev. period
                        </span>`
                      : ''
                  }
                </div>
                <div style="display: flex; flex-direction: column; gap: 5px; justify-content: flex-end; align-items: flex-end;">
                  <span style="color: ${nexyColors.white}; font-weight: 500;">
                    ${chart.numberFormatter.format(dataItem.value, '#.00')}%
                  </span>
                  ${
                    dataItem.comparisonChangePercent
                      ? `<span style="color: ${getPercentageColor(
                          dataItem.comparisonChangePercent,
                          false,
                        )}; font-weight: 600; font-size: 10px; text-align: end;">
                          ${(dataItem.comparisonChangePercent < 0 ? '' : '+') + chart.numberFormatter.format(dataItem.comparisonChangePercent, '#.00')}%
                        </span>`
                      : ''
                  }
                </div>
              </div>`;
          }

          tooltipContent += `</div></div>`;
          return tooltipContent;
        });
      };

      if (qp?.dateComparisonActive) {
        series.tooltipHTML = getComparisonTooltip(series);
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
    [navigateToOptimizations, selectedFunnelStep?.funnelStep?.title, qp?.dateComparisonActive],
  );

  // Use global charts store for initial date range
  const { initialDateRange } = useChartsStore();

  React.useEffect(() => {
    chartRef.current && chartRef.current.dispose();

    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
    chartRef.current.data = dataForChart;
    chartRef.current.paddingLeft = 0;
    chartRef.current.dateFormatter.dateFormat = 'MMM d, yyyy';

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

    const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.gridContainer.toFront();
    valueAxis.renderer.labels.template.adapter.add('text', (text) => (text ? `${text.toUpperCase()}%` : text));

    const longerPeriodTimestamp = getLongerPeriod(dataForChart);

    createSeries({
      fieldX: qp.dateComparisonActive ? longerPeriodTimestamp : 'timestamp',
      fieldY: 'value',
      name: 'Effective',
      lineColor: qp.dateComparisonActive ? getSeriesColor('potential') : getSeriesColor('achieved'),
    });

    if (qp?.dateComparisonActive) {
      createSeries({
        fieldX: longerPeriodTimestamp,
        fieldY: 'valueTimeComparison',
        name: 'Effective',
        lineColor: getSeriesColor('past'),
        isDashed: true,
      });
    }

    chartRef.current.cursor = new am4charts.XYCursor();
    chartRef.current.cursor.maxTooltipDistance = -1;
    chartRef.current.cursor.lineX.disabled = false;
    chartRef.current.cursor.lineY.disabled = true;
    chartRef.current.cursor.lineX.strokeDasharray = '';
    chartRef.current.cursor.lineX.stroke = nexyColors.blueGrey;

    dateAxis.cursorTooltipEnabled = false;
    valueAxis.cursorTooltipEnabled = false;
    dateAxis.renderer.labels.template.dy = 8;

    chartRef.current.zoomOutButton.disabled = true;

    chartRef.current.numberFormatter.numberFormat = '#.00';

    if (qp?.dateComparisonActive) {
      dateAxis.hide();
      chartRef.current.cursor.behavior = 'none';
    }

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

    addWatermark(chartRef);
    !qp?.dateComparisonActive && addTrendLine(chartRef.current, dataForChart, getSeriesColor('trend'));
  }, [dataForChart, createSeries, getSeriesColor, qp.dateComparisonActive]);

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
      <Styles.ChartContainerStyled id={CHART_CONTAINER} data-cy="portfolioRoasChart" />
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
