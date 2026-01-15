import React, { useRef, useState } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import dayjs from 'dayjs';
import { get } from 'lodash';

import useTeamColor from '../../hooks/useTeamColor';
import { addExportMenu } from './utils/addExportMenu';
import { addWatermark } from './utils/addWatermark';
import { CHART_TOOLTIP_DATE_FORMAT } from '../../utils/dates';

// import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { nexyColors } from '../../theme';
import CreateEvent from '../CreateEvent/CreateEvent';
import { EventsList } from '../Events';

// am4core.useTheme(am4themes_animated);
am4core.options.autoDispose = true;
am4core.options.minPolylineStep = 5;
const CHART_CONTAINER = 'report-chart';
const dateIconDataUri = `data:image/svg+xml;base64,ICAgIDxzdmcKICAgICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgICB2aWV3Qm94PSIwIDAgMjAgMjAiCiAgICAgIGZpbGw9IiNCN0JBQzciCiAgICA+CiAgICAgIDxwYXRoCiAgICAgICAgZD0iTTE3LjYsMi43aC0xLjd2Mi40YzAsMC44LTAuNiwxLjQtMS40LDEuNGgtMC40Yy0wLjgsMC0xLjQtMC42LTEuNC0xLjRWMi43SDcuNXYyLjRjMCwwLjgtMC42LDEuNC0xLjQsMS40SDUuNwoJQzUsNi41LDQuMyw1LjksNC4zLDUuMVYyLjdIMi40Yy0wLjYsMC0xLDAuNS0xLDEuMXYxMy44YzAsMC42LDAuNSwxLjEsMSwxLjFoMTUuMmMwLjYsMCwxLTAuNSwxLTEuMVYzLjcKCUMxOC42LDMuMiwxOC4yLDIuNywxNy42LDIuN3ogTTE3LjIsMTYuNGMwLDAuNC0wLjMsMC44LTAuOCwwLjhIMy42Yy0wLjQsMC0wLjgtMC4zLTAuOC0wLjhWOC42YzAtMC40LDAuMy0wLjgsMC44LTAuOGgxMi44CgljMC40LDAsMC44LDAuMywwLjgsMC44VjE2LjR6IgogICAgICAvPgogICAgICA8cGF0aAogICAgICAgIGQ9Ik01LjcsNS45aDAuNGMwLjQsMCwwLjgtMC40LDAuOC0wLjhWMi4yYzAtMC40LTAuMy0wLjgtMC44LTAuOEg1LjdjLTAuNCwwLTAuOCwwLjQtMC44LDAuOHYyLjkKCUM0LjksNS41LDUuMyw1LjksNS43LDUuOXoiCiAgICAgIC8+CiAgICAgIDxwYXRoCiAgICAgICAgZD0iTTE0LjEsNS45aDAuNGMwLjQsMCwwLjgtMC40LDAuOC0wLjhWMi4yYzAtMC40LTAuMy0wLjgtMC44LTAuOGgtMC40Yy0wLjQsMC0wLjgsMC40LTAuOCwwLjh2Mi45CglDMTMuMyw1LjUsMTMuNyw1LjksMTQuMSw1Ljl6IgogICAgICAvPgogICAgICA8cmVjdCB4PSI0LjEiIHk9IjkuNCIgd2lkdGg9IjMiIGhlaWdodD0iMi42IiAvPgogICAgICA8cmVjdCB4PSI0LjEiIHk9IjEzLjEiIHdpZHRoPSIzIiBoZWlnaHQ9IjIuNiIgLz4KICAgICAgPHJlY3QgeD0iOC41IiB5PSI5LjQiIHdpZHRoPSIzIiBoZWlnaHQ9IjIuNiIgLz4KICAgICAgPHJlY3QgeD0iOC41IiB5PSIxMy4xIiB3aWR0aD0iMyIgaGVpZ2h0PSIyLjYiIC8+CiAgICAgIDxyZWN0IHg9IjEzIiB5PSI5LjQiIHdpZHRoPSIzIiBoZWlnaHQ9IjIuNiIgLz4KICAgICAgPHJlY3QgeD0iMTMiIHk9IjEzLjEiIHdpZHRoPSIzIiBoZWlnaHQ9IjIuNiIgLz4KICAgIDwvc3ZnPg==`;
const reportDetailChartEventBus = new Comment('report-detail-chart-event-bus');

const reportDetailChartOpenCreateEventSidepanel = function (timestamp) {
  reportDetailChartEventBus.dispatchEvent(
    new CustomEvent('open-create-event-sidepanel-report-chart', {
      detail: timestamp,
    }),
  );
};

//@ts-ignore
window.reportDetailChartOpenCreateEventSidepanel = reportDetailChartOpenCreateEventSidepanel;

function ReportsChart({ data, numOfKpis, reportEvents = [], refetchEvents }) {
  const chartRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const [eventsPositions, setEventsPositions] = useState([]);
  const getTeamColor = useTeamColor();
  // TODO: Extract it to a controller or something similar, maybe not put it in ChartMeasurements, so it's nicer
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

  function createSeries(fieldX, fieldY, reportName, datatype = {}, lineColor) {
    if (!chartRef.current) return;
    // Init series
    const series = chartRef.current.series.push(new am4charts.LineSeries());
    series.name = reportName;
    series.datatype = datatype;
    series.dataFields.valueY = fieldY;
    series.dataFields.dateX = fieldX;
    series.strokeWidth = 3;
    series.stroke = am4core.color(lineColor);
    series.tooltipText = '{name}: [bold]{valueY}[/]';
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fillOpacity = 1;
    series.tooltip.background.fill = am4core.color(nexyColors.darkGrey);
    series.tooltip.background.stroke = am4core.color(nexyColors.darkGrey);
    series.tooltip.label.fontSize = 10;
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.pointerLength = 0;
    series.tooltip.label.paddingLeft = 0;
    series.tooltip.label.paddingRight = 0;
    series.tooltip.label.paddingBottom = 0;
    series.tooltip.clickable = true;
    series.tooltip.zIndex = 9999;
    series.tooltip.label.interactionsEnabled = true;
    series.tensionX = 0.8;
    // Tooltip shadow
    const tooltipShadow = series.tooltip.background.filters.getIndex(0);
    tooltipShadow.dx = 3;
    tooltipShadow.dy = 3;
    tooltipShadow.blur = 8;
    tooltipShadow.color = am4core.color(nexyColors.darkGrey);
    tooltipShadow.opacity = 0.2;
    // Set up common tooltip
    series.adapter.add('tooltipHTML', function (_, target) {
      const isThereEventForItem = get(target, 'tooltipDataItem.dataContext.isThereEventForGivenDate', false);
      const formattedDate = dayjs(target.tooltipDataItem.dateX).format(CHART_TOOLTIP_DATE_FORMAT);
      let tooltipHTMLContent = `<div style="display:block;color:${nexyColors.cloudyBlue80};border-bottom:1px solid ${nexyColors.charcoalGrey};text-align:center;text-transform:uppercase;padding:0px 15px 5px 15px;margin-bottom:15px;font-size:12px;font-weight:lighter;">${formattedDate}</div>`;
      chartRef.current.series.each(function (item) {
        const isSuffix = item.datatype ? item.datatype.suffix : true;
        const symbol = item.datatype ? item.datatype.symbol : '';
        // prettier-ignore
        tooltipHTMLContent += `<div style="display:flex;justify-content:space-between;padding: 0 15px 5px 15px;"><div style="display:flex;flex-direction:column;margin-right:15px;"><div style="display:flex;align-items:center;color:#fff;font-size:14px;"><div style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;background-color:${item.stroke.hex};"></div> <span style="width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</span></div></div><span style="font-size:14px;"><strong>${!isSuffix ? `${symbol} ` : ''}{${item.dataFields.valueY}}${isSuffix ? symbol : ''}</strong></span></div>`;
      });

      if (isThereEventForItem === false) {
        tooltipHTMLContent += `<button id="create-event" style="width:99%;cursor:pointer;outline:none;margin-top:10px;padding: 5px 0;background-color: #424347;border:none;color:#B7BAC7;font-family: EuclidCircularB;font-size:12px;font-weight:500;text-align:center;"><img src="${dateIconDataUri}" height="14px" style="color:#B7BAC7;margin-bottom:-2px;margin-right:10px;"/>Create event</button>`;
      } else {
        tooltipHTMLContent += `<div style="width:100%;height:15px;"></div>`;
      }

      // This is the event listener for the create event button, to avoid inline js which is not allowed due to our new CSP
      series.tooltip.events.on('hit', function (e) {
        if (e.event.srcElement.id === 'create-event') {
          const date = new Date(e.target.dataItem.dateX);
          const formattedDate = date.toDateString();
          reportDetailChartOpenCreateEventSidepanel(formattedDate);
        }
      });

      return tooltipHTMLContent;
    });
    // adjust positioning of tooltip
    series.tooltip.adapter.add('dy', function (_, target) {
      return target.y > chartRef.current.plotContainer.pixelHeight / 2 ? -20 : 20;
    });
    // bullets on hover
    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.stroke = am4core.color('#fff');
    bullet.circle.strokeWidth = 2;
    bullet.getFillFromObject = false;
    bullet.fill = am4core.color(lineColor);
    bullet.fillOpacity = 0;
    bullet.strokeOpacity = 0;
    const bulletState = bullet.states.create('hover');
    bulletState.properties.fillOpacity = 1;
    bulletState.properties.fillOpacity = 1;
    bulletState.properties.strokeOpacity = 1;
  }

  function calculateEventPosition() {
    if (!chartRef.current || !xAxisRef.current || !reportEvents) return;
    const evPos = [];
    reportEvents.forEach((event) => {
      // convert the date to axis position
      const position = xAxisRef.current.dateToPosition(new Date(event.timestamp));
      // Then position to pixels
      const positionInPixels = xAxisRef.current.renderer.positionToPoint(position);
      evPos.push(positionInPixels);
    });
    setEventsPositions(evPos);
  }

  React.useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
      // Format date
      chartRef.current.dateFormatter.dateFormat = 'MMM d, YYYY';
      // Add date axis
      const dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
      xAxisRef.current = dateAxis;
      dateAxis.renderer.grid.template.strokeOpacity = 0;
      dateAxis.renderer.labels.template.fill = am4core.color('rgba(183,186,199,0.8)');
      dateAxis.renderer.labels.template.fontSize = 12;
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.5;
      // this makes the data to be grouped
      dateAxis.groupData = true;
      dateAxis.groupCount = 500;
      // Add value axis
      const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
      yAxisRef.current = valueAxis;
      valueAxis.renderer.grid.template.stroke = am4core.color('#f0f2fa');
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.labels.template.fill = am4core.color('rgba(183,186,199,0.8)');
      valueAxis.renderer.labels.template.fontSize = 12;
      // Add cursor
      chartRef.current.cursor = new am4charts.XYCursor();
      chartRef.current.cursor.maxTooltipDistance = -1;
      // To make all series hover
      chartRef.current.cursor.events.on('cursorpositionchanged', function () {
        chartRef.current.series.each(function (series) {
          if (!series) return;

          try {
            series.dataItems.each(function (dataItem) {
              if (dataItem !== series.tooltipDataItem) {
                dataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = false;
              }
            });
          } catch (e) {
            console.warn(e);
          }

          if (!chartRef.current.cursor.isHiding && !chartRef.current.cursor.isHidden) {
            try {
              series.tooltipDataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = true;
            } catch (e) {
              console.warn(e);
            }
          } else {
            try {
              series.tooltipDataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = false;
            } catch (e) {
              console.warn(e);
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
              console.warn(e);
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
      // Enable export
      addExportMenu(chartRef);
      addWatermark(chartRef);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Init series
  React.useEffect(() => {
    if (chartRef.current) {
      let index = 0;

      while (index < numOfKpis) {
        createSeries(
          'timestamp',
          `report-${index}-value`,
          data?.[0]?.[`report-${index}-name`],
          data?.[0]?.[`report-${index}-datatype`],
          getTeamColor(index),
        );
        index++;
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numOfKpis]);
  // Load data into chart
  React.useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = data;
    }
  }, [data]);
  // Calculate event positions
  React.useEffect(() => {
    calculateEventPosition(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportEvents]);
  // add event listener to custom event bus
  React.useEffect(() => {
    reportDetailChartEventBus.addEventListener(
      'open-create-event-sidepanel-report-chart',
      // @ts-ignore
      ({ detail }) => {
        handleOpenCreateEventDialog(detail);
      },
    );
    // prevent memory leak, remove event listener on chart unmount
    return reportDetailChartEventBus.removeEventListener(
      'open-create-event-sidepanel-report-chart',
      // @ts-ignore
      reportDetailChartEventBus,
    );
  }, []);
  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '50px',
      }}
    >
      <div
        id={CHART_CONTAINER}
        style={{
          width: '100%',
          height: '400px',
          zIndex: 10000,
        }}
      />
      <EventsList
        events={reportEvents}
        refetchEvents={refetchEvents}
        eventsPositions={eventsPositions}
        offset={yAxisRef.current ? yAxisRef.current.measuredWidth : 0}
      />
      <CreateEvent
        refetchEvents={refetchEvents}
        isCreateEventDialogOpen={eventDialogData.isCreateEventOpen}
        eventDate={eventDialogData.eventDate}
        handleCloseCreateEventDialog={handleCloseCreateEventDialog}
      />
    </div>
  );
}

export default ReportsChart;
