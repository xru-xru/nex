import React from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { orderBy } from 'lodash';
import { nexyColors } from 'theme';

import { NexoyaPortfolioEventSnapshot, NexoyaScenarioDailyBudget, NexoyaScenarioDailyMetric } from 'types/types';

import { determinePadding } from '../../../../../components/Charts/utils/budgetChart';
import { radiusAdapter } from '../../../../../components/Charts/utils/radius';
import { Color } from '@amcharts/amcharts4/.internal/core/utils/Color';

import {
  ChartContainerStyled,
  NexyChartClasses,
} from '../../../../../components/Charts/styles/PortfolioPerformanceChart';
import { CHART_TOOLTIP_DATE_FORMAT } from '../../../../../utils/dates';
import { useCurrencyStore } from 'store/currency-selection';
import { Button } from '../../../../../components-ui/Button';
import { ChevronsUpDown } from 'lucide-react';
import { addPortfolioEvents } from '../../../../../components/Charts/utils/addPortfolioEvents';
import { usePortfolio } from '../../../../../context/PortfolioProvider';
import usePortfolioEventsStore from '../../../../../store/portfolio-events';

dayjs.extend(isoWeek);
am4core.useTheme(am4themes_animated);

export type NumberType = 'currency' | 'percentage' | 'number';

interface Props {
  dailyMetrics: NexoyaScenarioDailyBudget[] | NexoyaScenarioDailyMetric[];
  isBaseScenarioSelected: boolean;
  title: string;
  numberType: NumberType;
  metricSwitch: 'costPer' | 'value';
  portfolioEvents: NexoyaPortfolioEventSnapshot[];
}

const CHART_CONTAINER = 'scenario-overview-target-chart';

export function MetricOverview({
  dailyMetrics,
  isBaseScenarioSelected,
  title,
  numberType,
  metricSwitch,
  portfolioEvents,
}: Props) {
  const chartRef = React.useRef(null);
  const { currency, numberFormat } = useCurrencyStore();
  const { areEventsExtended, setEventsExtended } = usePortfolioEventsStore();
  const {
    performanceChart: { showEvents },
  } = usePortfolio();

  const renderValueBasedOnType = (value: number, type: 'currency' | 'percentage' | 'number') => {
    switch (type) {
      case 'currency':
        return Intl.NumberFormat(numberFormat, {
          style: 'currency',
          currency,
        }).format(value).replace('SAR', 'ر.س');
      case 'percentage':
        return `${value}%`;
      case 'number':
        return value;
      default:
        return value;
    }
  };

  const createTooltip = (series: am4charts.XYChart) => {
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
    series.tooltip.dy = -20;

    series.tooltip.animationDuration = 150;
    series.tooltip.animationEasing = am4core.ease.sinOut;

    // Set up tooltip
    series.adapter.add('tooltipHTML', function (_, target) {
      const formattedDate = dayjs((target.tooltipDataItem as any).dateX).format(CHART_TOOLTIP_DATE_FORMAT);
      let content = `<div class="${NexyChartClasses.tooltip}">${formattedDate}</div>`;
      const seriesLength = chartRef.current.series.length;
      chartRef.current.series.each(function (item, index) {
        const value = renderValueBasedOnType(item.dataItems.getIndex(target.tooltipDataItem.index)?.valueY, numberType);
        const padding = determinePadding(index, seriesLength);

        content += `<div style="display:flex;justify-content:space-between;align-items:center;gap: 16px;padding:${padding};">
      <span style="color: #C7C8D1; font-weight: 400;">
          <span style="width: 8px; height: 8px; background-color: ${item.stroke}; border-radius: 50%; display: inline-block; margin-right: 2px;"></span>
        ${item.name}:</span>
      <span>${value}</span>
      </div>`;
      });

      return content;
    });
  };

  const createSeries = (
    fieldX: string,
    fieldY: string,
    name: string,
    lineColor: string | Color,
    isDashed = false,
    isStepLine = false,
  ) => {
    if (!chartRef.current) return;
    // Init series
    const seriesType = isStepLine ? am4charts.StepLineSeries : am4charts.ColumnSeries;
    const series = chartRef.current.series.push(new seriesType());

    series.name = name;
    series.id = name;
    series.dataFields.dateX = fieldX;
    series.dataFields.valueY = fieldY;
    series.strokeWidth = 0;
    series.stroke = am4core.color(lineColor);

    if (seriesType === am4charts.StepLineSeries) {
      series.strokeWidth = 3;
      series.tensionX = 0.9;

      if (isDashed) {
        series.tensionX = 1.0;
        series.tensionY = 1.0;
        series.strokeDasharray = '16,6';
      }
    }
    series.clustered = true;
    series.showOnInit = true;

    if (seriesType === am4charts.ColumnSeries) {
      series.fill = am4core.color(lineColor);
      series.columns.template.column.adapter.add('cornerRadiusTopLeft', radiusAdapter);
      series.columns.template.column.adapter.add('cornerRadiusTopRight', radiusAdapter);
    }

    createTooltip(series);

    return series;
  };

  React.useEffect(() => {
    // destroy chart in case of re-render
    chartRef.current && chartRef.current.dispose();
    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);

    // @ts-ignore
    const chartData = orderBy(
      dailyMetrics as NexoyaScenarioDailyMetric[],
      [(metric) => dayjs(metric.day).valueOf()], // Use dayjs to convert the date to a timestamp
      ['asc'], // Sort in ascending order
    )?.map((metric: NexoyaScenarioDailyMetric | NexoyaScenarioDailyBudget) => {
      if (metric.__typename === 'ScenarioDailyBudget') {
        return {
          day: metric.day,
          baseScenario: metric.baseScenario,
          currentScenario: metric.currentScenario ?? null,
        };
      }

      return {
        day: metric?.day,
        baseScenario: metric[metricSwitch]?.baseScenario,
        currentScenario: metric[metricSwitch]?.currentScenario ?? null,
      };
    });

    chartRef.current.data = chartData;
    chartRef.current.dateFormatter.dateFormat = 'MMM d, yyyy';

    const dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    dateAxis.renderer.grid.template.strokeOpacity = 0;

    // valueAxis.cursorTooltipEnabled = false;
    dateAxis.title.text = 'DATE';
    dateAxis.title.fill = am4core.color(nexyColors.cloudyBlue80);
    dateAxis.title.fontSize = 12;
    dateAxis.title.fontWeight = 'bold';
    // Add value axis
    const valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    if (numberType === 'currency') {
      valueAxis.min = 0;
    }
    valueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.gridContainer.toFront();
    valueAxis.renderer.labels.template.adapter.add('text', (text) => (text ? text.toUpperCase() : text));

    valueAxis.title.text = title?.toUpperCase();
    valueAxis.title.fill = am4core.color(nexyColors.cloudyBlue80);
    valueAxis.title.fontSize = 12;
    valueAxis.title.fontWeight = 'bold';

    // Create series
    !isBaseScenarioSelected && createSeries('day', 'currentScenario', title, '#5AC6FC', false);

    createSeries(
      'day',
      'baseScenario',
      !isBaseScenarioSelected ? 'Base scenario' : title,
      nexyColors.lilac,
      true,
      !isBaseScenarioSelected,
    );

    chartRef.current.cursor = new am4charts.XYCursor();
    chartRef.current.cursor.maxTooltipDistance = -1;
    // Disable axis lines
    chartRef.current.cursor.lineX.disabled = true;
    chartRef.current.cursor.lineY.disabled = true;

    chartRef.current.cursor.lineX.stroke = nexyColors.frenchGray;
    chartRef.current.cursor.lineY.stroke = nexyColors.frenchGray;

    chartRef.current.cursor.lineX.strokeDasharray = '6 6';
    chartRef.current.cursor.lineY.strokeDasharray = '6 6';

    chartRef.current.cursor.lineX.strokeWidth = 2;
    chartRef.current.cursor.lineY.strokeWidth = 2;

    // Enabling cursor tooltips for both axes
    dateAxis.cursorTooltipEnabled = false;
    valueAxis.cursorTooltipEnabled = false;

    // Styling the dateAxis cursor tooltip
    dateAxis.tooltip.background.fill = am4core.color(nexyColors.white);
    dateAxis.tooltip.background.stroke = am4core.color('rgba(0,0,0,0)');
    dateAxis.tooltip.background.strokeWidth = 0;
    dateAxis.tooltip.label.fill = am4core.color(nexyColors.coolGray);
    dateAxis.tooltip.label.fontSize = 12;
    dateAxis.tooltip.label.fontWeight = 'bold';

    // Styling the valueAxis cursor tooltip
    valueAxis.tooltip.background.fill = am4core.color(nexyColors.white);
    valueAxis.tooltip.background.stroke = am4core.color('rgba(0,0,0,0)');
    valueAxis.tooltip.background.strokeWidth = 0;
    valueAxis.tooltip.label.fill = am4core.color(nexyColors.coolGray);
    valueAxis.tooltip.label.fontSize = 12;
    valueAxis.tooltip.label.fontWeight = 'bold';

    dateAxis.renderer.labels.template.dy = 8;
    // Disable zoom
    chartRef.current.cursor.behavior = 'none';
    chartRef.current.zoomOutButton.disabled = true;
    if (showEvents) {
      const container = addPortfolioEvents({
        dateAxis,
        portfolioEvents,
        extended: areEventsExtended,
      });

      if (container) {
        container.marginBottom = 0;
      }
    } else {
      // Legend
      chartRef.current.legend = new am4charts.Legend();
      chartRef.current.legend.contentAlign = 'left';
      chartRef.current.legend.marginTop = 40;
      chartRef.current.legend.paddingLeft = 40;
    }

    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, [dailyMetrics, isBaseScenarioSelected, metricSwitch, showEvents, areEventsExtended]);

  return (
    <div className="relative">
      <ChartContainerStyled
        data-cy="scenarioOverviewChart"
        id={CHART_CONTAINER}
        style={{
          width: '100%',
          height: '530px',
          marginTop: 54,
          marginBottom: showEvents ? 0 : 50,
        }}
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
      {showEvents ? (
        <div className="ml-16 flex gap-6">
          {!isBaseScenarioSelected && (
            <div className="flex items-center">
              <div className="mr-2 h-6 w-6 rounded-[3px] bg-[#5AC6FC]" />
              {title}
            </div>
          )}
          <div className="flex items-center">
            <div
              className={`mr-2 ${isBaseScenarioSelected ? 'h-6 w-6 rounded-[3px]' : 'mt-3 h-4 w-10 border-t-4 border-dotted'}`}
              style={{ backgroundColor: isBaseScenarioSelected ? '#744CED' : 'transparent', borderColor: '#744CED' }}
            />
            {isBaseScenarioSelected ? title : 'Base scenario'}
          </div>
        </div>
      ) : null}
    </div>
  );
}
