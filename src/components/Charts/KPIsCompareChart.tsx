import React, { useRef } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import useTeamColor from '../../hooks/useTeamColor';
import { formatDate } from '../../utils/formater';
import { addExportMenu } from './utils/addExportMenu';
import { addWatermark } from './utils/addWatermark';

import { nexyColors } from '../../theme';
import { useCurrencyStore } from 'store/currency-selection';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { GLOBAL_DATE_FORMAT } from 'utils/dates';
import { StringParam, useQueryParams } from 'use-query-params';

am4core.useTheme(am4themes_animated);
am4core.options.autoDispose = true;
const KPI_COMPARE_CHART_CONTAINER = 'kpis-compare-chart';

export default function KPICompareChart({ data, handleDateChange }) {
  const chartRef = useRef(null);
  const { numberFormat } = useCurrencyStore();

  const [qp] = useQueryParams({
    dateFromCompare: StringParam,
    dateToCompare: StringParam,
  });

  const getTeamColor = useTeamColor();
  const handleZoomChange = React.useCallback(
    debounce((event: any) => {
      const minZoomed = event.target.minZoomed;
      const maxZoomed = event.target.maxZoomed;

      const dateFromCompare = dayjs(new Date(minZoomed)).format(GLOBAL_DATE_FORMAT);
      const dateToCompare = dayjs(new Date(maxZoomed)).format(GLOBAL_DATE_FORMAT);

      if (qp.dateFromCompare === qp.dateToCompare) return;

      if (dateFromCompare !== qp.dateFromCompare && dateToCompare !== qp.dateToCompare) {
        handleDateChange({
          from: dateFromCompare,
          to: dateToCompare,
        });
      }
    }, 10),
    [qp.dateFromCompare, qp.dateToCompare],
  );

  React.useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = am4core.create(KPI_COMPARE_CHART_CONTAINER, am4charts.XYChart);
      chartRef.current.paddingLeft = -10;
      // Format date
      chartRef.current.dateFormatter.dateFormat = 'MMM d, YYYY';
      // Add date axis
      const dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
      dateAxis.animationDuration = 0;
      dateAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
      dateAxis.renderer.labels.template.fontSize = 12;
      dateAxis.renderer.grid.template.strokeOpacity = 0;
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.5;
      dateAxis.events.on('selectionextremeschanged', handleZoomChange);
      dateAxis.rangeChangeDuration = 0;
      // Add cursor
      chartRef.current.cursor = new am4charts.XYCursor();
      chartRef.current.cursor.maxTooltipDistance = -1;
      // To make all series hover
      chartRef.current.cursor.events.on('cursorpositionchanged', function () {
        chartRef.current.series.each(function (series) {
          if (!series) return;
          series.dataItems.each(function (dataItem) {
            if (dataItem !== series.tooltipDataItem) {
              dataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = false;
            }
          });

          if (!chartRef.current.cursor.isHiding && !chartRef.current.cursor.isHidden) {
            series.tooltipDataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = true;
          } else {
            series.tooltipDataItem.bullets.getKey(series.bullets.getIndex(0).uid).isHover = false;
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
      // Disable zoom
      chartRef.current.zoomOutButton.disabled = true;
      // Enable export
      addExportMenu(chartRef);
      addWatermark(chartRef);
    }
  }, [qp.dateFromCompare, qp.dateToCompare]);
  // Load data into chart
  React.useEffect(() => {
    const valueAxisMap = {};

    function getValueAxisForDatatype(datatype, isOpposite) {
      // if there is no axis for datatype, create it
      if (!valueAxisMap[datatype]) {
        const localValueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
        // style the axis after creating
        localValueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
        localValueAxis.renderer.grid.template.strokeOpacity = 1;
        localValueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
        localValueAxis.renderer.labels.template.fontSize = 12;
        localValueAxis.cursorTooltipEnabled = false;
        localValueAxis.renderer.opposite = isOpposite;
        valueAxisMap[datatype] = localValueAxis;
      }

      return valueAxisMap[datatype];
    }

    function createSeries(data, kpiName, collectionTitle, color, id, datatype, isOpposite) {
      if (!chartRef.current) return;
      // does the series already exist
      let itExists = false;
      chartRef.current.series.each(function (item) {
        if (item.id === id) itExists = true;
      });
      if (itExists) return;
      const valueAxis = getValueAxisForDatatype(datatype, isOpposite);

      if (chartRef.current.yAxes.indexOf(valueAxis) !== 0) {
        valueAxis.syncWithAxis = chartRef.current.yAxes.getIndex(0);
      }

      const series = chartRef.current.series.push(new am4charts.LineSeries());
      series.data = data;
      series.name = kpiName;
      series.collectionTitle = collectionTitle; // custom property name, should work

      series.id = id;
      series.yAxis = valueAxis;
      series.dataFields.valueY = 'value';
      series.dataFields.dateX = 'timestamp';
      series.strokeWidth = 3;
      series.stroke = am4core.color(color);
      series.tooltipHTML = `<div style="min-with:150px;max-width:200px;text-align:center;">[bold]{valueY}[/]</div>`;
      series.tooltip.pointerOrientation = 'vertical';
      series.tooltip.background.pointerLength = 0;
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color(nexyColors.darkGrey);
      series.tooltip.background.stroke = am4core.color(nexyColors.darkGrey);
      series.tooltip.background.fillOpacity = 1;
      series.tooltip.label.fontSize = 12;
      series.tooltip.label.paddingLeft = 0;
      series.tooltip.label.paddingRight = 0;
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
      // Set up common tooltip
      series.adapter.add('tooltipHTML', function (_, target) {
        const date = new Date(target.tooltipDataItem.dateX);
        const formattedDate = formatDate(date, 'en-US', {
          month: 'short',
          weekday: 'short',
        });
        const idx = target.tooltipDataItem.index;
        let tooltipHTMLContent = `<div style="display:block;color:${nexyColors.cloudyBlue80};border-bottom:1px solid ${nexyColors.charcoalGrey};text-align:center;padding:5px 0;margin-bottom:15px;font-size:14px;font-weight:light;">${formattedDate}</div>`;
        chartRef.current.series.each(function (item) {
          tooltipHTMLContent += `<div style="display:flex;justify-content:space-between;padding: 0 15px 5px 15px;"><div style="display:flex;flex-direction:column;margin-right:15px;"><div style="display:flex;align-items:center;color:#fff;font-size:14px;"><div style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;background-color:${
            item.stroke.hex
          };"></div> <span style="width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${
            item.name
          }</span></div><div style="color:${nexyColors.blueyGrey};font-size:13px;padding-left:17px;">${
            item.collectionTitle
          }</div></div><span style="font-size:14px;"><strong>${item.dataItems
            .getIndex(idx)
            .valueY.toFixed(2)}</strong></span></div>`;
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
    }

    if (chartRef.current) {
      chartRef.current.series.setAll([]);
      chartRef.current.yAxes.setAll([]);
      data.forEach((dataItem, i) => {
        createSeries(
          dataItem.data,
          dataItem.name,
          dataItem.collectionTitle,
          getTeamColor(i),
          dataItem.id,
          dataItem.datatype,
          i !== 0,
        );
      });
    }
  }, [data, getTeamColor]);
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
  return (
    <div
      id={KPI_COMPARE_CHART_CONTAINER}
      style={{
        width: '100%',
        height: '375px',
        marginBottom: '50px',
      }}
    />
  );
}
