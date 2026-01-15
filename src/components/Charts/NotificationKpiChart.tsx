import React, { useRef } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { get } from 'lodash';

import { getUniqueId } from '../../utils/getUniqueId';
import { addExportMenu } from './utils/addExportMenu';
import { addWatermark } from './utils/addWatermark';

am4core.useTheme(am4themes_animated);
const ICONS = {
  // error
  A_10: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9IjYwMiIgd2lkdGg9IjgwMiIgeT0iLTEiIHg9Ii0xIi8+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHJlY3QgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJudWxsIiBzdHJva2Utd2lkdGg9Im51bGwiIHN0cm9rZS1vcGFjaXR5PSJudWxsIiB4PSI4LjIxMDUzIiB5PSI1LjQ2MzgyIiB3aWR0aD0iMy41Nzg5NSIgaGVpZ2h0PSIxMC41MjYzMiIgaWQ9InN2Z18yIi8+CiAgPHJlY3QgaWQ9InN2Z180IiBoZWlnaHQ9IjU0IiB3aWR0aD0iMjgiIHk9IjI0LjQ1MzEzIiB4PSIzNC41IiBzdHJva2Utd2lkdGg9Im51bGwiIGZpbGw9IiNmZmZmZmYiLz4KICA8cGF0aCBkPSJtMjksNzljMS4wNzAzLDEuODUxNiAzLjA0MywyLjk5NjEgNS4xNzk3LDNsMzAuNjgsMGMyLjEyNSwtMC4wMTk1MyA0LjA3ODEsLTEuMTYwMiA1LjE0MDYsLTNsMTUuMzQsLTI2LjUyYzEuMDcwMywtMS44NTU1IDEuMDcwMywtNC4xNDQ1IDAsLTZsLTE1LjM0LC0yNi40OGMtMS4wNjY0LC0xLjg0NzcgLTMuMDM1MiwtMi45OTIyIC01LjE3MTksLTNsLTMwLjYwOSwwYy0yLjE1MjMsLTAuMDA3ODEgLTQuMTQ0NSwxLjEzNjcgLTUuMjE4OCwzbC0xNS4yNywyNi41MTJjLTEuMDcwMywxLjg1NTUgLTEuMDcwMyw0LjE0MDYgMCw2bDE1LjI2OTQsMjYuNDg4em0yNCwtMTAuMjdjMCwwLjg2NzE5IC0wLjM0Mzc1LDEuNjk5MiAtMC45NTcwMywyLjMxMjVzLTEuNDQ1MywwLjk1NzAzIC0yLjMxMjUsMC45NTcwM2wtMC40NDkyMiwwYy0wLjg3MTA5LDAuMDAzOTEgLTEuNzAzMSwtMC4zMzk4NCAtMi4zMjAzLC0wLjk1MzEyYy0wLjYxMzI4LC0wLjYxMzI4IC0wLjk2MDk0LC0xLjQ0OTIgLTAuOTYwOTQsLTIuMzE2NGwwLC0wLjQ0OTIyYy0wLjAwMzkxLC0wLjg3MTA5IDAuMzM5ODQsLTEuNzAzMSAwLjk1MzEyLC0yLjMyMDNjMC42MTMyOCwtMC42MTMyOCAxLjQ0OTIsLTAuOTYwOTQgMi4zMTY0LC0wLjk2MDk0bDAuNDQ5MjIsMGMwLjg3MTA5LC0wLjAwMzkxIDEuNzAzMSwwLjMzOTg0IDIuMzIwMywwLjk1MzEyYzAuNjEzMjgsMC42MTMyOCAwLjk2MDk0LDEuNDQ5MiAwLjk2MDk0LDIuMzE2NGwwLjAwMDAxLDAuNDYwOTN6bS01Ljc4OTEsLTQxLjczbDQuNjQ4NCwwYzAuOTAyMzQsMCAxLjc2NTYsMC4zNzUgMi4zNzg5LDEuMDM5MWMwLjYxMzI4LDAuNjY0MDYgMC45MjE4OCwxLjU1MDggMC44NTE1NiwyLjQ0OTJsLTIuMzI4MSwyNS41MTJjLTAuMTY0MDYsMS42NjAyIC0xLjU1ODYsMi45Mjk3IC0zLjIyNjYsMi45Mjk3Yy0xLjY2OCwwIC0zLjA2NjQsLTEuMjY5NSAtMy4yMjY2LC0yLjkyOTdsLTIuMzA4NiwtMjUuNTEyYy0wLjA3MDMxLC0wLjg5NDUzIDAuMjM4MjgsLTEuNzgxMiAwLjg0Mzc1LC0yLjQ0MTRjMC42MDkzOCwtMC42NjQwNiAxLjQ2ODgsLTEuMDQzIDIuMzY3MiwtMS4wNDY5bDAuMDAwMDksMHoiIGZpbGw9IiNlZDM0MzQiIGlkPSJzdmdfMSIvPgogPC9nPgo8L3N2Zz4=`,
  // warning
  A_5: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgPgoJICA8cmVjdCBpZD0ic3ZnXzIiIGhlaWdodD0iMTAuNTI2MzIiIHdpZHRoPSIzLjU3ODk1IiB5PSI1LjQ2MzgyIiB4PSI4LjIxMDUzIiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSJudWxsIiBzdHJva2U9Im51bGwiIGZpbGw9IiNmZmZmZmYiLz4KCiAgPHBhdGggaWQ9InN2Z18xIiBmaWxsPSIjZjY4MjBkIiBkPSJNMTguNyAxNi4xTDExIDIuOGMtLjUtLjgtMS41LS44LTIgMEwxLjMgMTYuMWMtLjQuNy4xIDEuNyAxIDEuN2gxNS40Yy45IDAgMS40LS45IDEtMS43ek05LjggNi45Yy41LS4xLjkuMSAxLjEuNS4xLjIuMS4zLjEuNSAwIC41LS4xIDEtLjEgMS41IDAgLjgtLjEgMS41LS4xIDIuM3YuN2MwIC40LS4zLjctLjcuNy0uNCAwLS43LS4zLS43LS43LS4yLTEuMi0uMy0yLjQtLjMtMy42IDAtLjMgMC0uNi0uMS0xIDAtLjQuMy0uOC44LS45em0uMiA4LjhjLS41IDAtMS0uNC0xLTEgMC0uNS40LTEgMS0xczEgLjQgMSAxLS41IDEtMSAxeiIgLz4KPC9zdmc+`,
  // info
  A_0: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgPjxyZWN0IGlkPSJzdmdfMiIgaGVpZ2h0PSIxMC41MjYzMiIgd2lkdGg9IjMuNTc4OTUiIHk9IjUuNDYzODIiIHg9IjguMjEwNTMiIHN0cm9rZS1vcGFjaXR5PSJudWxsIiBzdHJva2Utd2lkdGg9Im51bGwiIHN0cm9rZT0ibnVsbCIgZmlsbD0iI2ZmZmZmZiIvPgogIDxwYXRoIGlkPSJzdmdfMSIgZmlsbD0iIzM3NmJmYiIgZD0iTTEwIDE4LjVjLTQuOCAwLTguNi00LTguNS04LjguMS00LjYgMy45LTguMyA4LjYtOC4yIDQuNyAwIDguNSAzLjkgOC40IDguNiAwIDQuNi0zLjkgOC41LTguNSA4LjR6bS4yLTkuN2MtLjkgMC0xLjYuMy0yLjMuOC0uMSAwLS4xLjEtLjIuMS0uMi4yLS4xLjQuMS40LjEgMCAuMiAwIC4zLjEuNC4xLjUuMy40LjctLjIgMS0uNSAyLS43IDMtLjIuNy4yIDEuMy45IDEuNCAxIC4xIDItLjMgMi44LS45LjEtLjEuMi0uMi4xLS4zIDAtLjEtLjItLjEtLjMtLjJoLS4xYy0uNS0uMS0uNi0uMy0uNS0uOC4yLTEgLjUtMS45LjctMi45LjEtLjIuMS0uNSAwLS43LS4xLS41LS42LS43LTEuMi0uN3ptMi4xLTNjMC0uOS0uNy0xLjYtMS42LTEuNi0uOCAwLTEuNS44LTEuNSAxLjYgMCAuOS43IDEuNiAxLjYgMS42LjggMCAxLjUtLjcgMS41LTEuNnoiIC8+Cjwvc3ZnPg==`,
};

function getChartData(detail, data_events) {
  return detail.map((item) => {
    const eventForGivenTimestamp = data_events.filter(
      (event) => event.timestamp.substring(0, 10) === item.timestamp.substring(0, 10)
    )[0];

    if (eventForGivenTimestamp) {
      return {
        ...item,
        value: item.value || 0,
        eventTooltipDisabled: false,
        eventTooltipContent: eventForGivenTimestamp.content,
        eventTimestamp: eventForGivenTimestamp.timestamp,
      };
    }

    return { ...item, value: item.value || 0 };
  });
}

function NotificationKpiChart({ kpi, severity }) {
  const chartRef = useRef(null);
  const CHART_CONTAINER = `notification-kpi-chart-${getUniqueId()}`;
  const detail = get(kpi, 'detail.data', []);
  const data_events = get(kpi, 'data_events', []);
  const chartData = React.useMemo(() => getChartData(detail, data_events), [detail, data_events]);
  React.useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
      chartRef.current.paddingLeft = -10;
      // Add date axis
      const dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.strokeOpacity = 0;
      dateAxis.renderer.labels.template.fill = am4core.color('rgba(183,186,199,0.8)');
      dateAxis.renderer.labels.template.fontSize = 12;
      // Add value axis
      const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.stroke = am4core.color('#f0f2fa');
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.labels.template.fill = am4core.color('rgba(183,186,199,0.8)');
      valueAxis.renderer.labels.template.fontSize = 12;
      const series = chartRef.current.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.dateX = 'timestamp';
      series.strokeWidth = 3;
      series.stroke = am4core.color('#05a8fa');
      series.tooltipText = '[bold]{valueY}[/]';
      series.tooltip.pointerOrientation = 'down';
      series.tooltip.dy = -5;
      series.tooltip.background.pointerLength = 0;
      series.tooltip.background.filters.clear(); // remove shadow

      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('#2a2b2e');
      series.tooltip.background.stroke = am4core.color('#2a2b2e');
      series.tooltip.label.fontSize = 12;
      series.tensionX = 0.75;
      series.showOnInit = true;
      // Add simple bullet
      const bullet = series.bullets.push(new am4charts.Bullet());
      const image = bullet.createChild(am4core.Image);
      image.href = ICONS[severity];
      image.width = 24;
      image.height = 24;
      image.horizontalCenter = 'middle';
      image.verticalCenter = 'middle';
      image.disabled = true;
      image.tooltipText = '{eventTooltipContent}';
      series.adapter.add('tooltipText', function (tooltipText, target) {
        if (target.tooltipDataItem.dataContext.eventTooltipDisabled === false) {
          return '[bold]{eventTooltipContent}[/]';
        }

        return tooltipText;
      });
      image.propertyFields.disabled = 'eventTooltipDisabled';
      // To prevent bullet being cutoff by X-axis
      series.bulletsContainer.parent = chartRef.current.seriesContainer;
      // Add cursor
      chartRef.current.cursor = new am4charts.XYCursor();
      // Disable axis lines
      chartRef.current.cursor.lineX.disabled = true;
      chartRef.current.cursor.lineY.disabled = true;
      // Disable axis tooltips
      dateAxis.cursorTooltipEnabled = false;
      valueAxis.cursorTooltipEnabled = false;
      // Disable zoom
      chartRef.current.cursor.behavior = 'none';
      // Enable export
      addExportMenu(chartRef);
      addWatermark(chartRef);
    }
  });
  // Load data into chart
  React.useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = chartData;
    }
  }, [chartData]);
  // Handle component unmounting, dispose chart
  React.useEffect(() => {
    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);
  return (
    <>
      <div
        id={CHART_CONTAINER}
        style={{
          width: '100%',
          height: '200px',
          marginBottom: '50px',
        }}
      />
    </>
  );
}

export default NotificationKpiChart;
