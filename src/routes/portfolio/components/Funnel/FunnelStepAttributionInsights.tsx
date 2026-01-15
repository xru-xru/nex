import React, { useEffect, useRef, useState } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import { NexoyaFunnelStepPerformance } from '../../../../types';

import { ChartContainerStyled, NexyChartClasses } from '../../../../components/Charts/styles/PortfolioPerformanceChart';

import { nexyColors } from '../../../../theme';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components-ui/Dialog';
import { cn } from '../../../../lib/utils';
import Button from '../../../../components/Button';
import { HoverableTooltip } from '../../../../components-ui/HoverCard';
import { capitalizeWords } from '../../../../utils/string';
import { getPercentageColor, shortenNumber } from '../../../../utils/number';
import { StringParam, useQueryParams } from 'use-query-params';
import dayjs from 'dayjs';
import { useTeam } from '../../../../context/TeamProvider';
import { useAttributionPerformanceStore } from '../../../../store/attribution-performance';
import { DEMO_TEAM_ID } from '../../../../constants/demo';
import { sizes } from '../../../../theme/device';

am4core.useTheme(am4themes_animated);

const CHART_CONTAINER = 'attributed-performance-insights-chart';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  performanceTotalsFunnelSteps?: NexoyaFunnelStepPerformance[];
}

export const FunnelStepAttributionInsights = ({ isOpen, onClose }: Props) => {
  const chartRef = useRef<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { teamId } = useTeam();
  const { attributionPerformanceData } = useAttributionPerformanceStore();

  const funnelStepName = attributionPerformanceData?.measuredFunnelStep?.title;

  const [qp] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });

  const getAttributionChartData = () => {
    return (
      attributionPerformanceData?.attributionRulesMetrics?.map((metric) => {
        return {
          category: metric.attributionRule?.name,
          measured: metric.value?.measured,
          attributed: metric.value?.attributed,
          changePercent: metric.value?.changePercent,
        };
      }) || []
    );
  };

  const createSeries = React.useCallback(
    (options: {
      valueField: 'measured' | 'attributed';
      name: string;
      color: string;
      width?: number;
      showChangePercent?: boolean;
    }) => {
      if (!chartRef.current) return null;

      const series = chartRef.current.series.push(new am4charts.ColumnSeries());

      series.name = options.name;
      series.dataFields.valueY = options.valueField;
      series.dataFields.categoryX = 'category';
      // series.dataFields.changePercent = ;
      series.columns.template.strokeWidth = 0;

      if (options.width) {
        series.columns.template.width = options.width;
      }
      series.columns.template.fill = am4core.color(options.color);
      series.columns.template.column.adapter.add('cornerRadiusTopLeft', function () {
        return 4;
      });
      series.columns.template.column.adapter.add('cornerRadiusTopRight', function () {
        return 4;
      });

      // Add value labels inside the bars
      const valueLabelBullet = series.bullets.push(new am4charts.LabelBullet());
      valueLabelBullet.interactionsEnabled = false;
      valueLabelBullet.dy = 15;
      valueLabelBullet.label.text = `{${options.valueField}}`;
      valueLabelBullet.label.fontSize = 11;
      valueLabelBullet.label.fontWeight = '600';
      valueLabelBullet.label.fill = am4core.color('#FFFFFF');
      valueLabelBullet.label.truncate = false;
      valueLabelBullet.label.hideOversized = false;
      valueLabelBullet.label.horizontalCenter = 'middle';
      // shorten number inside bar
      valueLabelBullet.label.adapter.add('text', (text, target: any) => {
        const dataItem = target?.dataItem;
        const val = dataItem?.values?.valueY?.value;
        if (typeof val === 'number') {
          return shortenNumber(val, 1);
        }
        return text;
      });

      // Optional percent change label for attributed series
      if (options.showChangePercent) {
        const percentLabel = series.bullets.push(new am4charts.LabelBullet());
        percentLabel.label.text = '{changePercent}%';
        percentLabel.label.fontSize = 14;
        percentLabel.label.fontWeight = '600';
        percentLabel.label.dy = -70;
        // Position between the two clustered bars. For 10 entries (width=28) use the original -10 offset
        // to perfectly match the previous design; otherwise compute based on half the bar width.
        const computedDx = (options.width || 28) === 28 ? -10 : -((options.width || 28) / 2 + 5);
        percentLabel.label.dx = computedDx;
        percentLabel.label.horizontalCenter = 'middle';
        percentLabel.label.truncate = false;
        percentLabel.label.hideOversized = false;
        percentLabel.label.adapter.add('fill', function (_: any, target: any) {
          const changePercent = target.dataItem.dataContext.changePercent;
          return changePercent >= 0 ? am4core.color(nexyColors.greenTeal) : am4core.color(nexyColors.red400);
        });
      }

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
      series.adapter.add('tooltipHTML', (_, target) => {
        // Get the hovered data item
        const dataItem = target?.tooltipDataItem;
        const changePercent = dataItem?.dataContext?.changePercent;

        let content = `<div class="${NexyChartClasses.tooltip}">${dataItem?.dataContext?.category || ''}</div>`;
        chartRef.current.series.each(function (item, idx) {
          const valueField = item.dataFields.valueY;
          const rawVal = dataItem?.dataContext?.[valueField];
          const displayVal = typeof rawVal === 'number' ? shortenNumber(rawVal, 2) : rawVal;
          content += `<div style="padding:12px;display: flex;justify-content: space-between; align-items: baseline; gap: 48px; min-width: 125px; margin-bottom: ${
            idx === chartRef.current.series?.length - 1 ? '0' : '-14px'
          }"><span style="color: #C7C8D1; font-weight: 300; display: flex; align-items: center;"><span style=" font-size: 8px; margin-right: 4px; text-align: center;  color:${
            item.stroke
          } ">●</span>${capitalizeWords(valueField)}</span>${displayVal}</div>`;
        });

        content += `<div style="display: flex; flex-direction: row; gap: 4px; align-items: center; justify-content: space-between; padding: 4px 12px 12px;">
          <span style="color: ${nexyColors.neutral200}; font-weight: 400; font-size: 12px;">Difference:</span>
          <span style="color: ${getPercentageColor(
            changePercent,
            false,
          )}; font-weight: 500; font-size: 13px; text-align: end">${changePercent < 0 ? '' : '+'}${changePercent}%
        </span>
        </div>`;

        return content;
      });

      return series;
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) return;

    setTimeout(() => {
      chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);

      const chartData = getAttributionChartData();
      const mapped = chartData?.map((item) => Math.max(item.measured, item.attributed)) ?? [1];
      const maxValue = Math.max(...mapped);

      // Calculate dynamic bar width and spacing based on number of entries
      const numEntries = chartData.length;
      // For 10 entries: barWidth = 28, for fewer entries: proportionally bigger but capped
      const barWidth = numEntries >= 10 ? 28 : Math.min(50, 28 * (10 / Math.max(numEntries, 1)));
      // Adjust spacing: for 10 entries keep original (0.6), for fewer entries use wider range
      const cellRange = numEntries >= 10 ? 0.6 : Math.min(0.6, 0.35 + 0.05 * numEntries);
      const cellCenter = 0.4; // Original center position
      const cellStartLocation = cellCenter - cellRange / 2;
      const cellEndLocation = cellCenter + cellRange / 2;

      // Prepare data for the chart
      const chartDataFormatted = chartData.map((item) => ({
        category: item.category,
        measured: item.measured,
        attributed: item.attributed,
        changePercent: item.changePercent,
        maxValue: Math.max(item.measured, item.attributed) + 20, // Add padding for background
      }));

      chartRef.current.data = chartDataFormatted;

      // Create X axis
      const categoryAxis = chartRef.current.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'category';

      const renderer = categoryAxis.renderer;
      renderer.grid.template.location = 0;
      renderer.grid.template.strokeOpacity = 0;
      renderer.grid.template.strokeWidth = 0;
      renderer.minGridDistance = 20;
      renderer.cellStartLocation = cellStartLocation;
      renderer.cellEndLocation = cellEndLocation;

      const labelsTemplate = renderer.labels.template;
      labelsTemplate.fontSize = 11;
      labelsTemplate.fontWeight = '400';
      labelsTemplate.opacity = 1;
      labelsTemplate.fill = am4core.color('#6B7280');
      labelsTemplate.rotation = 0;
      labelsTemplate.wrap = true;
      labelsTemplate.maxWidth = 100; // Increased max width
      labelsTemplate.breakWords = false; // Prevent breaking words
      labelsTemplate.textAlign = 'middle';
      labelsTemplate.horizontalCenter = 'middle';
      // Add left padding/margin to shift labels left
      labelsTemplate.dx = -15;

      chartDataFormatted.forEach((item) => {
        const range = categoryAxis.axisRanges.create();
        range.category = item.category;
        range.endCategory = item.category;

        range.label.opacity = 0;

        // Adjust the start and end location of the range within the category cell
        // Values are between 0 (start) and 1 (end) - adjusted based on cellStartLocation/cellEndLocation
        const rangePadding = 0.03;
        range.locations.category = cellStartLocation - rangePadding;
        range.locations.endCategory = cellEndLocation + rangePadding;

        range.axisFill.fill = am4core.color('#F0F2FA');
        range.axisFill.fillOpacity = 0.5;
      });
      // Create Y axis
      const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.fill = am4core.color('#374151');
      valueAxis.title.fontSize = 14;
      valueAxis.title.fontWeight = '500';

      valueAxis.min = 0;
      // Set max value * 2 based on the highest bar value to ensure enough space for both bars
      valueAxis.max = maxValue * 2;

      valueAxis.strictMinMax = true;
      valueAxis.renderer.grid.template.stroke = am4core.color('#E5E7EB');
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.grid.template.strokeWidth = 1;
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.labels.template.fontWeight = '400';
      valueAxis.renderer.labels.template.opacity = 0.7;
      valueAxis.renderer.labels.template.fill = am4core.color('#6B7280');
      // shorten Y-axis labels
      valueAxis.renderer.labels.template.adapter.add('text', (text, target: any) => {
        const val = target?.dataItem?.value;
        if (typeof val === 'number') return shortenNumber(val, 1);
        return text;
      });

      // Create series
      createSeries({
        valueField: 'measured',
        name: `${attributionPerformanceData?.measuredFunnelStep?.title}: Measured`,
        color: '#9CA3AF',
        width: barWidth,
      });
      createSeries({
        valueField: 'attributed',
        name: attributionPerformanceData?.attributedFunnelStep?.title,
        color: nexyColors.azure,
        width: barWidth,
        showChangePercent: true,
      });

      // Enable clustering to group bars side by side
      chartRef.current.series.template.clustered = true;

      // Disable tooltips handled in createSeries

      // Add legend with proper styling
      const legend = (chartRef.current.legend = new am4charts.Legend());
      legend.contentAlign = 'left';
      legend.marginTop = 24;
      legend.marginBottom = 16;
      legend.data = [
        { name: `${funnelStepName}: Measured`, fill: '#9CA3AF' },
        { name: `${funnelStepName}: Attributed`, fill: nexyColors.azure },
      ];

      // Make the legend markers smaller
      const markerTemplate = legend.markers.template;
      markerTemplate.width = 12;
      markerTemplate.height = 12;

      // Add cursor
      chartRef.current.cursor = new am4charts.XYCursor();
      chartRef.current.cursor.maxTooltipDistance = -1;
      chartRef.current.cursor.lineX.disabled = false;
      chartRef.current.cursor.lineY.disabled = true;
      chartRef.current.cursor.lineX.strokeDasharray = '';
      chartRef.current.cursor.lineX.stroke = am4core.color('#6B7280');
      chartRef.current.cursor.lineX.strokeWidth = 1;

      // Disable axis tooltips
      categoryAxis.cursorTooltipEnabled = false;
      valueAxis.cursorTooltipEnabled = false;

      // Disable axis lines
      chartRef.current.cursor.lineX.disabled = true;
      chartRef.current.cursor.lineY.disabled = true;

      // Configure scrolling if many items
      const windowWidth = window.innerWidth;

      // Only enable zoom for screens <= sizes.desktopL when there are more than 13 entries
      if (windowWidth <= sizes?.desktopL && numEntries > 13) {
        chartRef.current.scrollbarX = new am4core.Scrollbar();
        chartRef.current.scrollbarX.parent = chartRef.current.bottomAxesContainer;
        chartRef.current.scrollbarX.marginTop = 10;
        chartRef.current.scrollbarX.minHeight = 6;

        // Style the thumb
        chartRef.current.scrollbarX.thumb.background.fill = am4core.color(nexyColors.neutral100);
        chartRef.current.scrollbarX.thumb.background.fillOpacity = 0.6;
        chartRef.current.scrollbarX.thumb.background.cornerRadius(3, 3, 3, 3);

        // Style the background
        chartRef.current.scrollbarX.background.fill = am4core.color(nexyColors.neutral50);
        chartRef.current.scrollbarX.background.fillOpacity = 1;

        // Enable and style grips (min/max handlers)
        chartRef.current.scrollbarX.startGrip.background.fill = am4core.color(nexyColors.neutral100);
        chartRef.current.scrollbarX.endGrip.background.fill = am4core.color(nexyColors.neutral100);
        chartRef.current.scrollbarX.startGrip.icon.disabled = true;
        chartRef.current.scrollbarX.endGrip.icon.disabled = true;
        chartRef.current.scrollbarX.startGrip.background.cornerRadius(5, 5, 5, 5);
        chartRef.current.scrollbarX.endGrip.background.cornerRadius(5, 5, 5, 5);

        chartRef.current.events.on('ready', () => {
          categoryAxis.zoomToIndexes(0, 13);
        });
      } else {
        // Disable zoom
        chartRef.current.cursor.behavior = 'none';
        chartRef.current.zoomOutButton.disabled = true;
      }
    }, 50);

    return () => chartRef.current && chartRef.current.dispose();
  }, [isOpen, attributionPerformanceData]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] max-w-[70vw] flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-medium text-neutral-900">Attribution Insights</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <p className="mb-6 text-sm font-normal leading-relaxed text-gray-600">
            From {dayjs(qp.dateFrom).format('DD MMMM YYYY')} to {dayjs(qp.dateTo).format('DD MMMM YYYY')}
          </p>

          <ChartContainerStyled
            data-cy="attributionInsightsChart"
            id={CHART_CONTAINER}
            style={{
              width: '100%',
              height: 500,
              marginBottom: 0,
            }}
          />

          {teamId === DEMO_TEAM_ID ? (
            <div>
              <div className="mt-[-4px] flex w-[680px] flex-col items-start rounded-lg border border-gray-200 bg-gray-50">
                <div
                  className={cn(
                    showDetails ? 'mb-2 border-b' : 'rounded-md',
                    'flex w-full items-center justify-between rounded-t-md border-neutral-100 bg-white px-4 py-3',
                  )}
                >
                  <h3 className="text-xs font-medium text-neutral-500">Model information</h3>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-[10px] font-normal text-neutral-400 underline hover:text-neutral-600"
                  >
                    {showDetails ? 'Hide details' : 'Show details'}
                  </button>
                </div>

                {showDetails && (
                  <div className="w-full space-y-3 px-4 pb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-normal text-neutral-400">Model name:</span>
                      <HoverableTooltip className="max-w-full truncate font-normal text-neutral-900">
                        Bayesian Regression with adstock modeling & lagged conversion 30d
                      </HoverableTooltip>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-normal text-neutral-400">Date/version:</span>
                      <span className="font-normal text-neutral-900">1. March 2025 (v29)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-normal text-neutral-400">Period:</span>
                      <span className="font-normal text-neutral-900">1. Jan 2022 - Jan 2025</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <span className="font-normal text-neutral-400">Channels:</span>
                      <span className="font-normal text-neutral-900">6</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-normal text-neutral-400">Ad spend:</span>
                      <span className="font-normal text-neutral-900">5'202'210 CHF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-normal text-neutral-400">{funnelStepName}:</span>
                      <HoverableTooltip className="max-w-full truncate font-normal text-neutral-900">
                        392’329 (Sourced by CRM system hydra99v)
                      </HoverableTooltip>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-normal text-neutral-400">Experiments:</span>
                      <span className="font-normal text-neutral-900">14</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-normal text-neutral-400">Events:</span>
                      <span className="font-normal text-neutral-900">19</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-shrink-0 items-center justify-end border-t border-gray-200 pt-6">
          <Button color="primary" variant="contained" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
