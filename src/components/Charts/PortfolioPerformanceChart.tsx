import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { debounce } from 'lodash';
import { nexyColors } from 'theme';
import { BooleanParam, NumberParam, StringParam, useQueryParams } from 'use-query-params';

import { NexoyaFunnelStepType, NexoyaImpactGroup, NexoyaOptimizationV2, NexoyaPortfolioLabel } from 'types';

import { useLabels } from '../../context/LabelsProvider';
import { usePortfolio } from 'context/PortfolioProvider';

import useTeamColor from '../../hooks/useTeamColor';
import translate from '../../utils/translate';
import { addExportMenu } from './utils/addExportMenu';
import { addWatermark } from './utils/addWatermark';
import { useGetSeriesColor } from 'utils/chart';
import { CHART_TOOLTIP_DATE_FORMAT, djsAnchors, GLOBAL_DATE_FORMAT, isLaterDay } from 'utils/dates';

import * as Styles from './styles/PortfolioPerformanceChart';
import { NexyChartClasses } from './styles/PortfolioPerformanceChart';
import { getPercentageColor } from '../../utils/number';
import { useImpactGroups } from '../../context/ImpactGroupsProvider';
import { useCurrencyStore } from 'store/currency-selection';
import { addPortfolioEvents } from './utils/addPortfolioEvents';
import usePortfolioEventsStore from '../../store/portfolio-events';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../../components-ui/Button';
import { calculateMaximumNumberOfOverlappingEvents } from '../../routes/portfolio/utils/portfolio-events';
import { useCustomizationStore } from '../../store/customization';
import useTranslationStore from '../../store/translations';
import { useChartsStore } from 'store/charts';
import ZoomOutButton from './ZoomOutButton';

interface Props {
  data: Record<string, any>[];
  portfolioId: number;
  optimizations: NexoyaOptimizationV2[];
  portfolioTitle?: string;
}

am4core.useTheme(am4themes_animated);

dayjs.extend(isBetween);

function PortfolioPerformanceChart({ data, portfolioId, optimizations, portfolioTitle }: Props) {
  const CHART_CONTAINER_ID = 'portfolio-performance-chart' + portfolioId;

  const [qp, setQueryParams] = useQueryParams({
    compareFrom: StringParam,
    compareTo: StringParam,
    dateFrom: StringParam,
    dateTo: StringParam,
    dateComparisonActive: BooleanParam,
    activeTab: StringParam,
    optimizationId: NumberParam,
  });

  const chartRef = useRef(null);
  const [activeBullet, setActiveBullet] = useState();

  const { portfolioEvents, areEventsExtended, setEventsExtended } = usePortfolioEventsStore();
  const { isStackedAreaChartActive } = useCustomizationStore();

  const {
    performanceChart: { showEvents },
    selectedFunnelStep: { selectedFunnelStep: selectedPartialFunnelStep },
    portfolioV2Info: {
      funnelSteps: { data: funnelSteps },
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const {
    providers: { providersFilter },
  } = usePortfolio();

  const {
    labelById,
    filter: { labelsFilter },
  } = useLabels();

  const {
    filter: { impactGroupsFilter },
  } = useImpactGroups();

  const getThemeColor = useTeamColor();

  const { translations } = useTranslationStore();
  const selectedFunnelStep = funnelSteps?.find(
    (fs) => fs?.funnelStep?.funnelStepId === selectedPartialFunnelStep.funnel_step_id,
  )?.funnelStep;
  const optimizationTarget = portfolioMeta?.defaultOptimizationTarget;

  const maxOverlappingEvents = useMemo(() => {
    if (!showEvents || !portfolioEvents?.length) return 0;
    return calculateMaximumNumberOfOverlappingEvents({
      portfolioEvents,
    });
  }, [showEvents, portfolioEvents]);

  const { numberFormat } = useCurrencyStore();

  const navigateToOptimizations = useCallback(
    () =>
      setQueryParams({
        activeTab: 'optimization',
      }),
    [setQueryParams],
  );

  // Use global charts store for initial date range
  const { initialDateRange, setInitialDateRange } = useChartsStore();

  // Set the initial date range only once, when both are available
  useEffect(() => {
    if (!initialDateRange && qp.dateFrom && qp.dateTo) {
      setInitialDateRange({ dateFrom: qp.dateFrom, dateTo: qp.dateTo });
    }
  }, [qp.dateFrom, qp.dateTo, initialDateRange, setInitialDateRange]);

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
  const targetOptimizations = optimizations?.filter((optimization) => {
    const isStartDateInFuture = isLaterDay(optimization.start, djsAnchors.today);
    const isEndDateInFuture = isLaterDay(optimization.end, djsAnchors.today);
    return (
      optimizationTarget?.funnelStepId === selectedFunnelStep?.funnelStepId &&
      !isStartDateInFuture &&
      !isEndDateInFuture
    );
  });

  const createRanges = useCallback(
    (dateAxis) => {
      targetOptimizations?.forEach((optimization) => {
        const range = dateAxis.axisRanges.create();
        range.date = new Date(optimization.start);
        range.endDate = new Date(optimization.end);
        range.grid.disabled = true;
        range.axisFill.fill = am4core.color('#F7F7F8');
        range.axisFill.fillOpacity = activeBullet === range.endValue ? 1 : 0;

        range.bullet = new am4core.Image();
        range.bullet.width = 30;
        range.bullet.height = 30;
        range.bullet.dy = -17;
        range.bullet.href = 'https://cdn.nexoya.io/img/99_speed_icon.svg';
        range.bullet.horizontalCenter = 'middle';
        range.bullet.interactionsEnabled = true;
        range.bullet.above = true;
        range.bullet.zIndex = 20;
        range.bullet.events.on('hit', (ev) => {
          // Use endDate timestamp for comparison
          const clickedEndDateTimestamp = ev.target.dataItem.endDate?.getTime() || ev.target.dataItem.endValue;
          if (clickedEndDateTimestamp !== activeBullet) {
            setActiveBullet(clickedEndDateTimestamp);
          } else {
            // close opened one
            setActiveBullet(null);
          }
        });
        return range;
      });
    },
    [activeBullet, targetOptimizations],
  );

  const createBullet = (series, lineColor, isFilter) => {
    if (!isFilter) {
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
    }
  };

  const configureSeries = (series, fieldX, fieldY, name, lineColor, isDashed, showArea, isFilter, hasBackdrop) => {
    series.name = name;
    series.id = fieldY;
    series.dataFields.valueY = fieldY?.toString();
    series.dataFields.dateX = fieldX;
    series.strokeWidth = 3;
    series.stroke = am4core.color(lineColor);

    // Do not connect the dots if there are any null values in between the data series
    series.connect = false;

    if (isDashed) {
      series.strokeDasharray = '16,6';
    }

    if (showArea) {
      series.dataFields.openValueY = 'baselinePerformanceRelative';
      series.fill = series.stroke;
      series.fillOpacity = 0.1;
    }

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

    if (isFilter) {
      series.fill = series.stroke;
      series.fillOpacity = 1;
      series.tensionX = 1;
      series.tensionY = 1;
      series.stacked = true;
    }

    if (name === 'Effective') {
      series.zIndex = 100;
    }

    if (name === 'Potential') {
      series.zIndex = 10;
    }
  };

  const createTooltip = (series, groupTooltip, isFilter) => {
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

    function getTooltipHTML(selectedFunnelStep) {
      series.adapter.add('tooltipHTML', function (_, target) {
        const formattedDate = dayjs(target.tooltipDataItem.dateX).format(CHART_TOOLTIP_DATE_FORMAT);
        const valueFormat =
          selectedFunnelStep?.type === NexoyaFunnelStepType.Conversion
            ? `{valueY.formatNumber('#.0')}`
            : `{valueY.formatNumber('#.00a')}`;
        return `<div class="${NexyChartClasses.tooltip}">${formattedDate}</div>
          <div style="padding:12px;display: flex;justify-content: space-between; gap: 16px; min-width: 125px">
            <span style="color: #C7C8D1; font-weight: 300">${selectedFunnelStep?.title || ''}</span>
            ${valueFormat}
          </div>`;
      });
    }

    const getComparisonTooltip = (series) => {
      return series.adapter.add('tooltipHTML', function () {
        const chart = series.chart;
        const currentIndex = series.tooltipDataItem.index;
        const dataItem = chart.data[currentIndex];

        let tooltipContent = `
          <div class="${NexyChartClasses.tooltip}" style="text-align: left;">
            <div style="
              color: #C7C8D1;
              font-weight: 300;
              margin-bottom: 4px;
            ">
              ${selectedFunnelStep?.title || ''}
            </div>
            <div style="
              display: flex;
              flex-direction: column;
            ">
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

        if (dataItem?.timestamp && dataItem.value !== null) {
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
                    ${dayjs(dataItem?.timestamp).format(CHART_TOOLTIP_DATE_FORMAT)}
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
                  dataItem?.comparisonChangePercent
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

    const createGroupTooltip = (series) => {
      const excludeEffective = (item) => item.name !== 'Effective';
      const excludePredictedOrPotential = (item) => !(item.name === 'Predicted' || item.name === 'Potential');

      const shouldRender = series.properties.name === 'Effective' ? excludePredictedOrPotential : excludeEffective;

      const generateTooltipContent = (item, index, totalItems) => {
        const commonStyle =
          'padding:12px;display: flex;justify-content: space-between; align-items: baseline; gap: 16px; min-width: 125px;';
        const marginBottom = index < totalItems - 1 ? 'margin-bottom: -24px;' : 'margin-bottom: 0;';
        const tooltipStyle = `${commonStyle} ${marginBottom}`;

        const itemName = item.name === 'Effective' ? `Total ${selectedFunnelStep?.title}` : item.name;

        return `
      <div style="${tooltipStyle}">
        <span style="color: #C7C8D1; font-weight: 300;">
          <span style="font-size: 16px; margin-right: 2px; color:${item.stroke}">●</span>
          ${itemName}
        </span>
        {${item.dataFields.valueY}.formatNumber('#.00a')}
      </div>`;
      };

      series.adapter.add('tooltipHTML', function (_, target) {
        const formattedDate = dayjs(target.tooltipDataItem.dateX).format(CHART_TOOLTIP_DATE_FORMAT);
        const seriesList = chartRef.current.series.values.filter(shouldRender);
        const tooltipContent = seriesList.reduce((content, item, index) => {
          return content + generateTooltipContent(item, index, seriesList.length);
        }, `<div class="${NexyChartClasses.tooltip}">${formattedDate}</div>`);

        return tooltipContent;
      });
    };

    if (qp?.dateComparisonActive) {
      series.tooltipHTML = getComparisonTooltip(series);
      return;
    } else if (groupTooltip) {
      createGroupTooltip(series);
      return;
    } else if (!isFilter) {
      getTooltipHTML(selectedFunnelStep);
      return;
    }
  };

  const createSeries = useCallback(
    ({
      fieldX,
      fieldY,
      name,
      lineColor,
      isDashed = false,
      showArea = false,
      groupTooltip,
      isFilter = false,
      hasBackdrop = false,
    }) => {
      if (!chartRef.current) return;
      const series = chartRef.current.series.push(new am4charts.LineSeries());

      configureSeries(series, fieldX, fieldY, name, lineColor, isDashed, showArea, isFilter, hasBackdrop);
      createTooltip(series, groupTooltip, isFilter);
      createBullet(series, lineColor, isFilter);

      return series;
    },
    [navigateToOptimizations, selectedFunnelStep],
  );

  useEffect(() => {
    chartRef.current = am4core.create(CHART_CONTAINER_ID, am4charts.XYChart);
    chartRef.current.data = data;

    chartRef.current.paddingLeft = 0;
    chartRef.current.dateFormatter.dateFormat = 'MMM d, yyyy';
    // Add date axis
    const dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
    dateAxis.animationDuration = 0; // Disable zoom animation
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    // Set cell boundaries for proper range alignment (similar to CategoryAxis approach)
    // Dates are centered at 0.5, so cells span from 0 to 1
    dateAxis.renderer.cellStartLocation = 0;
    dateAxis.renderer.cellEndLocation = 1;
    dateAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    dateAxis.renderer.grid.template.strokeOpacity = 0;
    dateAxis.events.on('selectionextremeschanged', handleZoomChange);
    dateAxis.rangeChangeDuration = 0; // Disables animation when range changes

    // Add value axis
    const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    if (selectedPartialFunnelStep?.type === NexoyaFunnelStepType.Cost) {
      valueAxis.min = 0;
    }
    valueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.gridContainer.toFront();
    valueAxis.renderer.labels.template.adapter.add('text', (text) => (text ? text.toUpperCase() : text));

    // Provider series first so that it stacks them correctly, otherwise they will be stacked on the first series available
    isStackedAreaChartActive &&
      providersFilter.forEach((provider) => {
        const providerName = translate(translations, provider.name);
        createSeries({
          fieldX: 'timestamp',
          fieldY: provider.provider_id,
          name: providerName,
          lineColor: provider?.providerLogoColor,
          isDashed: false,
          showArea: false,
          groupTooltip: false,
          isFilter: true,
          hasBackdrop: false,
        });
      });

    isStackedAreaChartActive &&
      labelsFilter.forEach((label: NexoyaPortfolioLabel, idx) => {
        const labelName = labelById(label?.labelId).name;
        createSeries({
          fieldX: 'timestamp',
          fieldY: label.labelId,
          name: labelName,
          lineColor: getThemeColor(idx),
          isDashed: false,
          showArea: false,
          groupTooltip: true,
          isFilter: true,
          hasBackdrop: false,
        });
      });

    isStackedAreaChartActive &&
      impactGroupsFilter.forEach((impactGroup: NexoyaImpactGroup, idx) => {
        createSeries({
          fieldX: 'timestamp',
          fieldY: impactGroup?.impactGroupId,
          name: impactGroup?.name,
          lineColor: getThemeColor(idx),
          isDashed: false,
          showArea: false,
          groupTooltip: false,
          isFilter: true,
          hasBackdrop: false,
        });
      });

    // Init series
    createSeries({
      fieldX: 'timestamp',
      fieldY: 'value',
      name: 'Effective',
      lineColor: qp.dateComparisonActive ? getSeriesColor('potential') : getSeriesColor('achieved'),
      isDashed: false,
      showArea: false,
      groupTooltip:
        isStackedAreaChartActive && (labelsFilter?.length || providersFilter?.length || impactGroupsFilter?.length),
      isFilter: false,
      hasBackdrop: isStackedAreaChartActive,
    });

    qp?.dateComparisonActive &&
      createSeries({
        fieldX: 'timestamp',
        fieldY: 'valueTimeComparison',
        name: 'Effective',
        lineColor: getSeriesColor('past'),
        isDashed: true,
        showArea: false,
        groupTooltip: true,
        isFilter: false,
        hasBackdrop: isStackedAreaChartActive,
      });

    if (!qp?.dateComparisonActive) {
      createSeries({
        fieldX: 'timestamp',
        fieldY: 'expectedPerformanceRelative',
        name: 'Optimization',
        lineColor: getSeriesColor('potential'),
        isDashed: false,
        showArea: true,
        groupTooltip: true,
        isFilter: false,
        hasBackdrop: isStackedAreaChartActive,
      });
      createSeries({
        fieldX: 'timestamp',
        fieldY: 'baselinePerformanceRelative',
        name: 'Baseline',
        lineColor: getSeriesColor('predicted'),
        isDashed: true,
        showArea: false,
        groupTooltip: true,
        isFilter: false,
        hasBackdrop: isStackedAreaChartActive,
      });
    }

    createRanges(dateAxis);
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

    if (qp?.dateComparisonActive) {
      dateAxis.hide();
      chartRef.current.cursor.behavior = 'none';
    }

    addExportMenu(chartRef, `${portfolioTitle}_conversions ${selectedFunnelStep?.title?.toLowerCase()}`);
    addWatermark(chartRef);

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

    return () => {
      // destroy chart in case of re-render
      chartRef.current.dispose();
    };
  }, [
    data,
    createSeries,
    getSeriesColor,
    targetOptimizations,
    activeBullet,
    createRanges,
    providersFilter,
    labelsFilter,
    isStackedAreaChartActive,
    showEvents,
    selectedFunnelStep?.title,
  ]);

  // Set localization of chart
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.numberFormatter.numberFormat = '#.0a';
      chartRef.current.numberFormatter.smallNumberThreshold = 0.001;
    }
  }, [numberFormat]);

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
      <Styles.ChartContainerStyled
        id={CHART_CONTAINER_ID}
        data-cy="portfolioPerformanceChart"
        hasEvents={showEvents && portfolioEvents?.length > 0}
        eventsExtended={areEventsExtended}
        maxOverlappingEvents={maxOverlappingEvents}
      />
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

export default PortfolioPerformanceChart;
