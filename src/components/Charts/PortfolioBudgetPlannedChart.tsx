import React from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { nexyColors } from 'theme';

import { NexoyaBudgetDetail } from 'types/types';

import { useProviders } from 'context/ProvidersProvider';

import { addExportMenu } from './utils/addExportMenu';
import { addWatermark } from './utils/addWatermark';
import useTeamColor from 'hooks/useTeamColor';
import translate from 'utils/translate';
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';
import { formatNumber } from 'utils/formater';
import useTranslationStore from '../../store/translations';

dayjs.extend(isoWeek);
am4core.useTheme(am4themes_animated);

interface Props {
  rawData: NexoyaBudgetDetail[];
  portfolioName: string;
}

const CHART_CONTAINER = 'portfolio-budget-chart';

const basicTooltipStyles = `
  display: block;
  border-bottom: 1px solid ${nexyColors.charcoalGrey};
  text-align: center;
  padding: 5px 0;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: light;
`;
const extendedTooltipStyles = `
  min-width: 180px;
  max-width: 480px;
  display: flex;
  justify-content: space-between;
  padding: 0 15px 5px 15px;
  font-size:14px;
`;
const nameTooltipStyles = `
  display: flex;
  flex-direction: column;
  margin-right: 15px;
`;
function PortfolioBudgetPlannedChart({ rawData, portfolioName }: Props) {
  const [weeklyBudgets, setWeeklyBudgets] = React.useState([]);
  const { providerById } = useProviders();

  const { translations } = useTranslationStore();
  const chartRef = React.useRef(null);
  const { currency, numberFormat } = useCurrencyStore();
  const getThemeColor = useTeamColor();

  const providerIds = React.useMemo(() => rawData.map((item) => item.providerId), [rawData]);
  React.useEffect(() => {
    if (rawData.length) {
      setWeeklyBudgets(rawData[0].weeklyBudgets);
    }
  }, [rawData]);

  function createSeries(pid, color) {
    if (!chartRef.current) return;

    function arrangeColumns() {
      chartRef.current.series.each((item, index) => {
        const step = 3;
        item.dx = index % 2 === 0 ? index * step : index * step - step;
      });
    }

    function addTooltipContent(base, item1) {
      const tooltipHTMLContent = `<div style="${basicTooltipStyles}">Planned</div>`;
      base.adapter.add('tooltipHTML', () => {
        const item1Value = `${currencySymbol[currency]} ${formatNumber(
          item1.tooltipDataItem.valueY,
          numberFormat,
        )}`;
        return (
          tooltipHTMLContent +
          `
          <div style="${extendedTooltipStyles}">
            <div style="${nameTooltipStyles}">${item1.name}</div>
            <div style="color:${item1.stroke.hex}">${item1Value}</div>
          </div>
        `
        );
      });
    }

    const series = chartRef.current.series.push(new am4charts.ColumnSeries());
    series.defaultState.transitionDuration = 700;
    series.dataFields.valueY = `${pid}-planned`;
    series.dataFields.categoryX = 'category';
    series.name = translate(translations, providerById(pid).name);
    series.stroke = am4core.color(color);
    series.fill = am4core.color(color);
    series.tooltip.pointerOrientation = 'vertical';
    series.columns.template.column.cornerRadiusTopLeft = 2;
    series.columns.template.column.cornerRadiusTopRight = 2;
    series.columns.template.column.strokeOpacity = 0;
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.pointerLength = 0;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color(nexyColors.darkGrey);
    series.tooltip.background.stroke = am4core.color(nexyColors.darkGrey);
    series.tooltip.background.fillOpacity = 1;
    series.tooltip.label.fontSize = 12;
    series.tooltip.label.paddingLeft = 0;
    series.tooltip.label.paddingRight = 0;
    series.events.on('shown', arrangeColumns);
    series.events.on('over', () => addTooltipContent(series, series));
    series.events.on('out', () => series.adapter.add('tooltipHTML', () => ''));
  }

  React.useEffect(() => {
    chartRef.current && chartRef.current.dispose();
    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);
    // Add X Axis
    const xAxis = chartRef.current.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = 'category';
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.grid.template.strokeOpacity = 0;
    xAxis.renderer.labels.template.fill = am4core.color('rgba(183,186,199,0.8)');
    xAxis.renderer.labels.template.fontSize = 12;
    xAxis.renderer.labels.template.adapter.add('html', () => {
      return `<span style="text-transform: uppercase;font-size: 12px;">{category}</span>`;
    });
    // Add Y Axis
    const yAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    yAxis.renderer.grid.template.stroke = am4core.color('#f0f2fa');
    yAxis.renderer.grid.template.strokeOpacity = 1;
    yAxis.renderer.labels.template.fill = am4core.color('rgba(183,186,199,0.8)');
    yAxis.renderer.labels.template.fontSize = 12;
    yAxis.renderer.labels.template.adapter.add('text', (text) => {
      return text ? text.toUpperCase() : text;
    });
    // Create series
    providerIds.forEach((pid, index) => createSeries(pid, getThemeColor(index)));
    // Add cursor
    chartRef.current.cursor = new am4charts.XYCursor();
    // Disable axis lines
    chartRef.current.cursor.lineX.disabled = true;
    chartRef.current.cursor.lineY.disabled = true;
    // Disable axis tooltips
    xAxis.cursorTooltipEnabled = false;
    yAxis.cursorTooltipEnabled = false;
    // Disable zoom
    chartRef.current.cursor.behavior = 'none';
    // Enable export
    addExportMenu(chartRef, `Planned budgets chart_${portfolioName}`);
    addWatermark(chartRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData]);
  // setup number/currency formatting and display
  React.useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.numberFormatter.numberFormat = '#.0a';
  }, []);
  // Load data into chart
  React.useEffect(() => {
    const data = () =>
      weeklyBudgets.map((item, index) => {
        const budgetsPerProvider = rawData.reduce(
          (acc, currItem) => ({
            ...acc,
            [`${currItem.providerId}-planned`]: currItem.weeklyBudgets[index].allocatedValue,
          }),
          {},
        );
        const start = dayjs(item.startDate).format('D MMM');
        const end = dayjs(item.endDate).day(0).format('D MMM YYYY');
        let isEmpty = true;
        Object.keys(budgetsPerProvider).map((key) => {
          if (budgetsPerProvider[key] !== 0) isEmpty = false;
          return key;
        });
        const itemWeek = `${start} - ${end}`;
        return isEmpty
          ? {}
          : {
              category: `${itemWeek}`,
              ...budgetsPerProvider,
            };
      });
    if (chartRef.current) {
      chartRef.current.data = data();
    }
  }, [rawData, weeklyBudgets]);
  return (
    <div
      id={CHART_CONTAINER}
      style={{
        width: '100%',
        height: '290px',
        marginBottom: '50px',
      }}
    />
  );
}

export default PortfolioBudgetPlannedChart;
