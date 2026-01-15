import React, { useCallback, useRef, useState } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { debounce, get } from 'lodash';

import useTeamColor from '../../hooks/useTeamColor';
import { addExportMenu } from './utils/addExportMenu';
import { addWatermark } from './utils/addWatermark';

import OverlayPredictionDateChange from '../../routes/kpi0/chartMeasurements/OverlayPredictionDateChange';
import OverlayPredictionLoading from '../../routes/kpi0/chartMeasurements/OverlayPredictionLoading';

import { nexyColors } from '../../theme';
import CreateEvent from '../CreateEvent/CreateEvent';
import { EventsList } from '../Events/';
import { am4themes_nexyTheme } from './themes/nexy';
import { useCurrencyStore } from 'store/currency-selection';
import dayjs from 'dayjs';
import { GLOBAL_DATE_FORMAT, CHART_TOOLTIP_DATE_FORMAT } from 'utils/dates';
import { StringParam, useQueryParams } from 'use-query-params';

am4core.useTheme(am4themes_nexyTheme);
const KPIs_DETAIL_CHART_CONTAINER = 'kpis-detail-chart';
const dateIconDataUri = `data:image/svg+xml;base64,ICAgIDxzdmcKICAgICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgICB2aWV3Qm94PSIwIDAgMjAgMjAiCiAgICAgIGZpbGw9IiNCN0JBQzciCiAgICA+CiAgICAgIDxwYXRoCiAgICAgICAgZD0iTTE3LjYsMi43aC0xLjd2Mi40YzAsMC44LTAuNiwxLjQtMS40LDEuNGgtMC40Yy0wLjgsMC0xLjQtMC42LTEuNC0xLjRWMi43SDcuNXYyLjRjMCwwLjgtMC42LDEuNC0xLjQsMS40SDUuNwoJQzUsNi41LDQuMyw1LjksNC4zLDUuMVYyLjdIMi40Yy0wLjYsMC0xLDAuNS0xLDEuMXYxMy44YzAsMC42LDAuNSwxLjEsMSwxLjFoMTUuMmMwLjYsMCwxLTAuNSwxLTEuMVYzLjcKCUMxOC42LDMuMiwxOC4yLDIuNywxNy42LDIuN3ogTTE3LjIsMTYuNGMwLDAuNC0wLjMsMC44LTAuOCwwLjhIMy42Yy0wLjQsMC0wLjgtMC4zLTAuOC0wLjhWOC42YzAtMC40LDAuMy0wLjgsMC44LTAuOGgxMi44CgljMC40LDAsMC44LDAuMywwLjgsMC44VjE2LjR6IgogICAgICAvPgogICAgICA8cGF0aAogICAgICAgIGQ9Ik01LjcsNS45aDAuNGMwLjQsMCwwLjgtMC40LDAuOC0wLjhWMi4yYzAtMC40LTAuMy0wLjgtMC44LTAuOEg1LjdjLTAuNCwwLTAuOCwwLjQtMC44LDAuOHYyLjkKCUM0LjksNS41LDUuMyw1LjksNS43LDUuOXoiCiAgICAgIC8+CiAgICAgIDxwYXRoCiAgICAgICAgZD0iTTE0LjEsNS45aDAuNGMwLjQsMCwwLjgtMC40LDAuOC0wLjhWMi4yYzAtMC40LTAuMy0wLjgtMC44LTAuOGgtMC40Yy0wLjQsMC0wLjgsMC40LTAuOCwwLjh2Mi45CglDMTMuMyw1LjUsMTMuNyw1LjksMTQuMSw1Ljl6IgogICAgICAvPgogICAgICA8cmVjdCB4PSI0LjEiIHk9IjkuNCIgd2lkdGg9IjMiIGhlaWdodD0iMi42IiAvPgogICAgICA8cmVjdCB4PSI0LjEiIHk9IjEzLjEiIHdpZHRoPSIzIiBoZWlnaHQ9IjIuNiIgLz4KICAgICAgPHJlY3QgeD0iOC41IiB5PSI5LjQiIHdpZHRoPSIzIiBoZWlnaHQ9IjIuNiIgLz4KICAgICAgPHJlY3QgeD0iOC41IiB5PSIxMy4xIiB3aWR0aD0iMyIgaGVpZ2h0PSIyLjYiIC8+CiAgICAgIDxyZWN0IHg9IjEzIiB5PSI5LjQiIHdpZHRoPSIzIiBoZWlnaHQ9IjIuNiIgLz4KICAgICAgPHJlY3QgeD0iMTMiIHk9IjEzLjEiIHdpZHRoPSIzIiBoZWlnaHQ9IjIuNiIgLz4KICAgIDwvc3ZnPg==`;
const kpiDetailChartEventBus = new Comment('kpi-detail-chart-event-bus');

const kpiDetailChartOpenCreateEventSidepanel = function (timestamp) {
  kpiDetailChartEventBus.dispatchEvent(
    new CustomEvent('open-create-event-sidepanel', {
      detail: timestamp,
    }),
  );
};
//@ts-ignore
window.kpiDetailChartOpenCreateEventSidepanel = kpiDetailChartOpenCreateEventSidepanel;
export default function KPIsDetailChart({
  data,
  predictionData,
  events,
  predictionQuery,
  showPredictionsDateChange,
  deactivatePredictionsDateChangeOverlay,
  showTotals,
}) {
  const chartRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const seriesRef = useRef(null);
  const predictionSeriesMaxRef = useRef(null);
  const predictionSeriesMinRef = useRef(null);
  const predictionSeriesAvgRef = useRef(null);
  const [eventsPositions, setEventsPositions] = useState([]);
  const { numberFormat } = useCurrencyStore();
  const [qp, setQueryParams] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });
  const getTeamColor = useTeamColor();
  const [eventDialogData, setEventDialogData] = React.useState({
    isCreateEventOpen: false,
    eventDate: null,
  });

  function handleOpenCreateEventDialog(eventDate: Date) {
    setEventDialogData({
      isCreateEventOpen: true,
      eventDate: eventDate,
    });
  }

  function handleCloseCreateEventDialog() {
    setEventDialogData({
      isCreateEventOpen: false,
      eventDate: null,
    });
  }

  function formatDatePrint(dateStr) {
    return dayjs(dateStr).format(CHART_TOOLTIP_DATE_FORMAT);
  }

  const hasOverlay = showPredictionsDateChange || predictionQuery.loading;
  const createSeries = React.useCallback((chartSeries, color) => {
    if (!chartRef.current) return;
    // does the series already exist -> if yes, skip creation
    let itExists = false;
    chartRef.current.series.each(function (item) {
      if (item.name === chartSeries.name && item.collectionTitle === chartSeries.collectionTitle) itExists = true;
    });
    if (itExists) return;
    const series = chartRef.current.series.push(new am4charts.LineSeries());
    seriesRef.current = series;
    series.data = chartSeries.data;
    series.name = chartSeries.name;
    series.collectionTitle = chartSeries.collectionTitle; // custom property name, should work

    // series.id = id;
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'timestamp';
    series.strokeWidth = 3;
    series.stroke = am4core.color(color);
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.pointerLength = 0;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color(nexyColors.darkGrey);
    series.tooltip.background.stroke = am4core.color(nexyColors.darkGrey);
    series.tooltip.background.fillOpacity = 1;
    series.tooltip.label.fontSize = 12;
    series.tooltip.label.paddingLeft = 0;
    series.tooltip.label.paddingRight = 0;
    series.tooltip.label.paddingBottom = 0;
    series.tooltip.clickable = true;
    series.tooltip.label.interactionsEnabled = true;

    series.tooltip.animationDuration = 300;
    series.tooltip.animationEasing = am4core.ease.sinOut;
    series.tensionX = 0.8;
    series.showOnInit = false;
    // adjust positioning of tooltip
    series.tooltip.adapter.add('dy', function (_, target) {
      return target.y > chartRef.current.plotContainer.pixelHeight / 2 ? -20 : 20;
    });
    // Tooltip shadow
    const shadow = series.tooltip.background.filters.getIndex(0);
    shadow.dx = 5;
    shadow.dy = 10;
    shadow.blur = 10;
    shadow.color = am4core.color(nexyColors.darkGrey);
    shadow.opacity = 0.2;
    series.adapter.add('tooltipHTML', function (_, target) {
      const formattedDate = formatDatePrint(target.tooltipDataItem.dateX);
      const isThereEventForItem = get(target, 'tooltipDataItem.dataContext.isThereEventForGivenDate', false);
      let tooltipHTMLContent = `<div style="display:block;color:${nexyColors.cloudyBlue80};border-bottom:1px solid ${nexyColors.charcoalGrey};text-align:center;padding:5px 0;margin-bottom:15px;font-size:14px;font-weight:light;">${formattedDate}</div>`;

      tooltipHTMLContent += `<div style="display:flex;justify-content:space-between;padding: 0 15px 5px 15px;"><div style="display:flex;flex-direction:column;margin-right:15px;"><div style="display:flex;align-items:center;color:#fff;font-size:14px;"><div style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;background-color:${target.stroke.hex};"></div> <span style="width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${target.name}</span></div><div style="color:${nexyColors.blueyGrey};font-size:13px;padding-left:17px;">${target.collectionTitle}</div></div><span style="font-size:14px;"><strong>{valueY}</strong></span></div>`;
      if (!isThereEventForItem) {
        tooltipHTMLContent += `<button id="create-event" style="width:99%;cursor:pointer;outline:none;margin-top:10px;padding: 5px 0;background-color: #424347;border:none;color:#B7BAC7;font-family: EuclidCircularB;font-size:12px;font-weight:600;letter-spacing:0.8px;text-align:center;"><img src="${dateIconDataUri}" height="14px" style="color:#B7BAC7;margin-bottom:-2px;margin-right:10px;"/>Create event</button>`;
      } else {
        tooltipHTMLContent += `<div style="width:100%;height:15px;"></div>`;
      }

      // This is the event listener for the create event button, to avoid inline js which is not allowed due to our new CSP
      series.tooltip.events.on('hit', function (e) {
        if (e.event.srcElement.id === 'create-event') {
          const date = new Date(e.target.dataItem.dateX);
          const formattedDate = date.toDateString();

          kpiDetailChartOpenCreateEventSidepanel(formattedDate);
        }
      });

      return tooltipHTMLContent;
    });
    // bullets on hover
    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.stroke = am4core.color('#fff');
    bullet.circle.strokeWidth = 2;
    bullet.getFillFromObject = false;
    bullet.fill = am4core.color(color);
    bullet.fillOpacity = 0;
    bullet.strokeOpacity = 0;
    const bulletState = bullet.states.create('hover');
    bulletState.properties.fillOpacity = 1;
    bulletState.properties.fillOpacity = 1;
    bulletState.properties.strokeOpacity = 1;
  }, []);

  const handleZoomChange = React.useCallback(
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

  function createPredictionSeries(name, valueY, color, isArea, isDashed, isHidden = false) {
    // does the series already exist
    let itExists = false;
    chartRef.current.series.each(function (item) {
      if (item.name === name) itExists = true;
    });
    if (itExists) return;
    // prediction area
    const series = chartRef.current.series.push(new am4charts.LineSeries());
    series.data = predictionData;
    series.name = name;
    series.color = color;
    series.isPredictionSeries = true; // hardcoded custom property

    series.dataFields.dateX = 'timestamp';
    series.dataFields.valueY = valueY;
    series.sequencedInterpolation = true;
    series.tensionX = 0.8;
    series.tooltip.animationDuration = 0;
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.pointerLength = 0;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color(nexyColors.darkGrey);
    series.tooltip.background.stroke = am4core.color(nexyColors.darkGrey);
    series.tooltip.background.fillOpacity = 1;
    series.tooltip.label.fontSize = 12;
    series.tooltip.label.paddingLeft = 0;
    series.tooltip.label.paddingRight = 0;
    series.tooltip.label.paddingBottom = 0;
    series.tooltip.clickable = true;
    series.tooltip.label.interactionsEnabled = true;
    // adjust positioning of tooltip
    series.tooltip.adapter.add('dy', function (_, target) {
      return target.y > chartRef.current.plotContainer.pixelHeight / 2 ? -10 : 10;
    });

    if (isArea) {
      series.dataFields.openValueY = 'valueLower';
      series.strokeWidth = 0;
      series.fill = am4core.color('#f7f8fc');
      series.fillOpacity = 0.6;
    }

    if (isDashed) {
      series.stroke = am4core.color(color);
      series.strokeWidth = 3;
      series.strokeDasharray = '15,5';
    }

    if (isHidden) {
      series.strokeWidth = 0;
      series.strokeOpacity = 0;
      series.fillOpacity = 0;
    }

    // bullets on hover
    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.stroke = am4core.color('#fff');
    bullet.circle.strokeWidth = 2;
    bullet.getFillFromObject = false;
    bullet.fill = am4core.color(color);
    bullet.fillOpacity = 0;
    bullet.strokeOpacity = 0;
    // Make drop shadow by adding a DropShadow filter
    const shadow = new am4core.DropShadowFilter();
    shadow.dx = 2;
    shadow.dy = 2;
    shadow.opacity = 0.2;
    bullet.filters.push(shadow);
    const bulletState = bullet.states.create('hover');
    bulletState.properties.fillOpacity = 1;
    bulletState.properties.fillOpacity = 1;
    bulletState.properties.strokeOpacity = 1;
    // setup common tooltip for prediction series
    series.adapter.add('tooltipHTML', function (_, target) {
      const formattedDate = formatDatePrint(target.tooltipDataItem.dateX);
      let tooltipHTMLContent = `<div style="display:block;color:${nexyColors.cloudyBlue80};border-bottom:1px solid ${nexyColors.charcoalGrey};text-align:center;padding:0 15px 5px 15px;margin-bottom:10px;font-size:12px;font-weight:lighter;">${formattedDate}</div>`;
      chartRef.current.series.each(function (item) {
        if (!item.isPredictionSeries) return;
        tooltipHTMLContent += `<div style="display:flex;justify-content:space-between;padding: 0 15px 5px 15px;font-size:12px;"><span style="margin-right:50px;">${item.name}</span><span style="color:${item.color};'">{${item.dataFields.valueY}}</span></div>`;
      });
      tooltipHTMLContent += `<div style="width:100%;height:15px;"></div>`;
      return tooltipHTMLContent;
    });

    if (name === 'Maximum') {
      predictionSeriesMaxRef.current = series;
    } else if (name === 'Minimum') {
      predictionSeriesMinRef.current = series;
    } else if (name === 'Average') {
      predictionSeriesAvgRef.current = series;
    }
  }

  const calculateEventPosition = useCallback(() => {
    if (!chartRef.current || !xAxisRef.current || !events) return;
    const evPos = [];
    events.eventsData.forEach((event) => {
      // convert the date to axis position
      const position = xAxisRef.current.dateToPosition(new Date(event.timestamp));
      // Then position to pixels
      const positionInPixels = xAxisRef.current.renderer.positionToPoint(position);
      evPos.push({ ...positionInPixels, eventId: event.event_id });
    });
    setEventsPositions(evPos);
  }, [events, chartRef, xAxisRef]);

  // Calculate event positions
  React.useEffect(() => {
    calculateEventPosition();
  }, [events, chartRef.current, xAxisRef.current, data]);

  React.useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = am4core.create(KPIs_DETAIL_CHART_CONTAINER, am4charts.XYChart);
      // Add date axis
      const dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
      dateAxis.events.on('datarangechanged', calculateEventPosition);
      dateAxis.events.on('selectionextremeschanged', handleZoomChange);
      dateAxis.animationDuration = 0;
      dateAxis.rangeChangeDuration = 0;
      xAxisRef.current = dateAxis;
      dateAxis.renderer.grid.template.strokeOpacity = 0;
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.5;
      // Add value axis
      const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
      yAxisRef.current = valueAxis;
      valueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      // Add cursor
      chartRef.current.cursor = new am4charts.XYCursor();
      chartRef.current.cursor.maxTooltipDistance = -1;
      // To make all series hover
      chartRef.current.cursor.events.on('cursorpositionchanged', function () {
        chartRef.current.series.each(function (series) {
          if (!series || !series.isPredictionSeries) return;

          try {
            series.dataItems.each(function (dataItem) {
              if (dataItem !== series.tooltipDataItem) {
                dataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = false;
              }
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }

          if (!chartRef.current.cursor.isHiding && !chartRef.current.cursor.isHidden) {
            try {
              series.tooltipDataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = true;
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e);
            }
          } else {
            try {
              series.tooltipDataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = false;
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e);
            }
          }
        });
      });
      // remove hover when focus is out
      chartRef.current.cursor.events.on('hidden', function () {
        chartRef.current.series.each(function (series) {
          series.dataItems.each(function (dataItem) {
            try {
              dataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = false;
            } catch (e) {
              console.error(e);
            }
          });
        });
      });
      // Disable axis lines
      chartRef.current.cursor.lineX.disabled = true;
      chartRef.current.cursor.lineY.disabled = true;
      // Disable axis tooltips
      dateAxis.cursorTooltipEnabled = false;
      valueAxis.cursorTooltipEnabled = false;
      // Disable zoom
      chartRef.current.zoomOutButton.disabled = true;
      // Enable export
      addExportMenu(chartRef);
      addWatermark(chartRef);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Load data into chart
  React.useEffect(() => {
    if (!chartRef.current) return;
    data.forEach((item, index) => createSeries(item, getTeamColor(index)));
  }, [data, createSeries, getTeamColor]);
  // Change isTotal
  React.useEffect(() => {
    if (!chartRef.current) return;
    seriesRef.current.dataFields.valueY = showTotals ? 'valueSumUp' : 'value';
    seriesRef.current.invalidateData();

    // invalidate prediction series as well
    if (predictionSeriesMaxRef && predictionSeriesMaxRef.current) {
      predictionSeriesMaxRef.current.data = predictionData;
    }

    if (predictionSeriesAvgRef && predictionSeriesAvgRef.current) {
      predictionSeriesAvgRef.current.data = predictionData;
    }

    if (predictionSeriesMinRef && predictionSeriesMinRef.current) {
      predictionSeriesMinRef.current.data = predictionData;
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTotals]);
  // Setup prediction series
  React.useEffect(() => {
    if (!chartRef.current || !predictionData || !predictionData.length) return;
    // first series creates the area of prediction
    createPredictionSeries('Maximum', 'valueUpper', '#9c89fa', true, false);
    // second series creates the dashed line of prediction
    createPredictionSeries('Average', 'value', '#adbfef', false, true);
    // third series is just a placeholder, to be able to see the hovering
    // bullet
    createPredictionSeries('Minimum', 'valueLower', '#f9a958', false, false, true);

    if (predictionSeriesMaxRef.current) {
      predictionSeriesMaxRef.current.data = predictionData;
    }

    if (predictionSeriesMinRef.current) {
      predictionSeriesMinRef.current.data = predictionData;
    }

    if (predictionSeriesAvgRef.current) {
      predictionSeriesAvgRef.current.data = predictionData;
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictionData]);

  // Handle component unmounting, dispose chart
  React.useEffect(() => {
    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);
  // Set localization of chart
  React.useEffect(() => {
    if (chartRef.current) {
      chartRef.current.numberFormatter.numberFormat = {
        style: 'decimal',
        minimumFractionDigits: 2,
      };
      chartRef.current.numberFormatter.intlLocales = numberFormat;
    }
  }, [numberFormat]);
  // add event listener to custom event bus
  React.useEffect(() => {
    kpiDetailChartEventBus.addEventListener(
      'open-create-event-sidepanel',
      // @ts-ignore
      ({ detail }) => {
        handleOpenCreateEventDialog(detail);
      },
    );
    // prevent memory leak, remove event listener on chart unmount
    return kpiDetailChartEventBus.removeEventListener(
      'open-create-event-sidepanel',
      // @ts-ignore
      kpiDetailChartEventBus,
    );
  }, []);
  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '50px',
      }}
    >
      <OverlayPredictionDateChange
        showPredictionsDateChange={showPredictionsDateChange}
        deactivatePredictionsDateChangeOverlay={deactivatePredictionsDateChangeOverlay}
      />
      <div
        id={KPIs_DETAIL_CHART_CONTAINER}
        style={{
          width: '100%',
          height: '375px',
          filter: hasOverlay ? 'blur(3px)' : 'blur(0)',
          zIndex: 2000,
        }}
      />
      <EventsList
        events={events.eventsData || []}
        refetchEvents={events.refetchEvents}
        eventsPositions={eventsPositions}
        offset={yAxisRef.current ? yAxisRef.current.measuredWidth : 0}
        hasOverlay={hasOverlay}
      />
      <CreateEvent
        refetchEvents={events.refetchEvents}
        isCreateEventDialogOpen={eventDialogData.isCreateEventOpen}
        eventDate={eventDialogData.eventDate}
        handleCloseCreateEventDialog={handleCloseCreateEventDialog}
      />

      {predictionQuery.loading ? <OverlayPredictionLoading isOpen={predictionQuery.loading} /> : null}
    </div>
  );
}
