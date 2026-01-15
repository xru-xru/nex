import { useEffect, useMemo, useRef, useState } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { nexyColors } from 'theme';

import { NexoyaPortfolioDashboardElement } from 'types';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

import * as Styles from 'components/Dashboard/styles/Dashboard';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import Text from 'components/Text';
import { chartColors } from '../Dashboard/components/DashboardPortfoliosRow';
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';
import { formatNumber } from 'utils/formater';

am4core.useTheme(am4themes_animated);

type Props = {
  data: NexoyaPortfolioDashboardElement[];
  loading: boolean;
};

const amChartColors = chartColors.map((c) => am4core.color(c));

export default function DashboardContentChart({ loading, data }: Props) {
  const chartRef = useRef(null);
  const { currency, numberFormat } = useCurrencyStore();
  const totalSpend = useMemo(
    () =>
      `${currencySymbol[currency]} ${formatNumber(
        data.reduce((acc, curr) => acc + (curr.adSpend?.realized ?? 0), 0),
        numberFormat,
        {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        },
      )}`,
    [data, currency, numberFormat],
  );

  const [spend, setSpend] = useState(totalSpend);
  const dataForChart = useMemo(
    () =>
      data?.map((p) => ({
        realized: p.adSpend?.realized,
        title: p.title,
      })),
    [data],
  );

  /**
   * Effect used to update current spend when data changes.
   */
  useEffect(() => {
    setSpend(totalSpend);
  }, [totalSpend]);

  /**
   * Effect used to build the chart
   */
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.dispose();
    }
    chartRef.current = am4core.create('chartdiv', am4charts.PieChart);

    const pieSeries = chartRef.current.series.push(new am4charts.PieSeries());
    pieSeries.colors.list = amChartColors;
    pieSeries.dataFields.value = 'realized';
    pieSeries.dataFields.category = 'title';
    chartRef.current.innerRadius = am4core.percent(60);
    pieSeries.labels.template.hidden = true;
    pieSeries.slices.template.clickable = false;
    pieSeries.ticks.template.disabled = true;
    pieSeries.tooltip.getFillFromObject = false;
    pieSeries.tooltip.background.fill = am4core.color(nexyColors.charcoalGrey);
    pieSeries.tooltip.background.stroke = am4core.color(nexyColors.charcoalGrey);
    pieSeries.tooltip.background.fillOpacity = 1;
    pieSeries.tooltip.background.pointerLength = 0;

    const slice = pieSeries.slices.template;

    slice.events.on('over', ({ target }) => {
      const dataIdx = pieSeries.slices.values.findIndex((slice) => slice === target);
      if (dataIdx >= 0) {
        const spend = `${currencySymbol[currency]} ${formatNumber(
          data[dataIdx]?.adSpend?.realized,
          numberFormat,
          {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          },
        )}`;
        setSpend(spend);
      }
    });

    slice.events.on('out', () => {
      pieSeries.slices.values.map((slice) => {
        // if (slice !== target) {
        //   slice.opacity = 1;
        // }
        setSpend(totalSpend);
        return slice;
      });
    });

    // ------------- Show tooltip on slice click only --------------- //
    // Disable pulling out
    pieSeries.slices.template.states.getKey('active').properties.shiftRadius = 0;

    // disable chart zoom animation when hovering over slices
    pieSeries.slices.template.states.getKey('hover').properties.scale = 1;

    // Set up slices
    pieSeries.slices.template.tooltipText = '';
    pieSeries.slices.template.alwaysShowTooltip = true;
    let currentSlice;
    pieSeries.slices.template.events.on('hit', function (ev) {
      track(EVENT.DASHBOARD_PORTFOLIO_CHART_CLICK);
      if (currentSlice) {
        currentSlice.tooltip.hide();
      }
      currentSlice = ev.target;
      currentSlice.adapter.add('tooltipHTML', function (_, target) {
        target.tooltipY = -20;
        target.tooltip.dy = -20;
        target.tooltip.dx = 220;
        const adSpend = `${currencySymbol[currency]} ${formatNumber(
          target.tooltipDataItem?.dataContext?.realized,
          numberFormat,
          {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          },
        )}`;
        const tooltipHTMLContent = `
          <div style="display:flex;justify-content:space-between;padding:15px;">
            <div style="font-size:14px;margin-right:30px;">Portfolio</div>
            <div style="color:#B7BAC7">${target.tooltipDataItem?.dataContext?.title}</div>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0 15px 0;">
            <div style="font-size:14px;margin-right:30px;">Ad spend</div>
            <div style="color:#B7BAC7">${adSpend}</div>
          </div>
          <div style="display:flex;justify-content:space-between;padding: 15px">
            <div style="font-size:14px;margin-right:30px;">Percentage</div>
            <div style="color:#B7BAC7">${Math.round(target.tooltipDataItem?.values.value.percent)}%</div>
          </div>
        `;
        return tooltipHTMLContent;
      });
      currentSlice.invalidate();
      currentSlice.showTooltip();
    });

    // Set up page click event to close open tooltip
    am4core.getInteraction().body.events.on('hit', function () {
      if (currentSlice) {
        currentSlice.tooltip.hide();
      }
    });
    // -------------  --------------- //

    chartRef.current.data = dataForChart;
  }, [loading, currency, totalSpend, numberFormat, dataForChart, data]);

  return (
    <Styles.ChartWrap>
      <Text>Ad spend</Text>
      {loading ? (
        <Styles.LoaderWrap spaced>
          <LoadingPlaceholder />
        </Styles.LoaderWrap>
      ) : (
        <>
          <Styles.ChartInnerText>
            <Styles.InnerTextCost>{spend}</Styles.InnerTextCost>
            <Styles.InnerTextGoal>Ad spend</Styles.InnerTextGoal>
          </Styles.ChartInnerText>
          <Styles.CostChart id="chartdiv"></Styles.CostChart>
        </>
      )}
    </Styles.ChartWrap>
  );
}
