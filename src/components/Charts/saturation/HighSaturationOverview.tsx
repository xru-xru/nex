import React, { useEffect, useRef } from 'react';
import { useRouteMatch } from 'react-router';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { nexyColors } from 'theme';

import { NexoyaFunnelStepType, NexoyaFunnelStepV2 } from '../../../types';

import { useFunnelStepsV2Query } from '../../../graphql/funnelSteps/queryFunnelSteps';

import { ChartContainerStyled } from '../styles/PortfolioPerformanceChart';

import Typography from '../../Typography';
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';

am4core.useTheme(am4themes_animated);

interface Props {
  saturationTangent: number[][];
  budgetRevenueResponseCurve: number[][];
  saturationPoint: number[];
  saturationProfitPerUnit: number;
  saturationScore: string;
  funnelStepTitle: string;
}

export function HighSaturationOverview({
  saturationTangent,
  budgetRevenueResponseCurve,
  saturationPoint,
  saturationProfitPerUnit,
  saturationScore,
  funnelStepTitle,
}: Props) {
  const CHART_CONTAINER = 'portfolio-content-high-saturation-chart';
  const chartRef = useRef(null);

  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { data: funnelStepsData } = useFunnelStepsV2Query({
    portfolioId,
  });

  const funnelStepType = funnelStepsData?.portfolioV2?.funnelSteps?.find(
    (step: NexoyaFunnelStepV2) => step.title === funnelStepTitle,
  )?.type;

  const { currency } = useCurrencyStore();

  const createBulletSeries = (x: number, y: number, label: string) => {
    const series = chartRef.current.series.push(new am4charts.LineSeries());
    series.dataFields.valueX = 'x';
    series.dataFields.valueY = 'y';

    // Add a single data point
    series.data = [{ x, y }];

    // Add a bullet
    const bullet = series.bullets.push(new am4charts.Bullet());
    const childBullet = bullet.createChild(am4core.Circle);
    childBullet.radius = 4;
    childBullet.fill = am4core.color('#05A8FA');
    childBullet.isMeasured = false;
    childBullet.strokeWidth = 1;
    childBullet.stroke = am4core.color('white');
    childBullet.toFront();

    // Add label
    const labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = label;
    labelBullet.label.fontSize = 14;
    labelBullet.label.horizontalCenter = 'left';
    labelBullet.label.dx = 10; // Distance from the bullet
    labelBullet.label.dy = 10; // Distance from the bullet
    labelBullet.label.fill = am4core.color('black');

    series.hiddenInLegend = true;
    return series;
  };

  const createSeries = (
    fieldX: string,
    fieldY: string,
    name: string,
    lineColor: string | am4core.iRGB | am4core.Color,
    isDashed = false,
  ) => {
    if (!chartRef.current) return;
    // Init series
    const series = chartRef.current.series.push(new am4charts.LineSeries());

    series.name = name;
    series.id = fieldY;
    series.dataFields.valueY = fieldY;
    series.dataFields.valueX = fieldX;

    series.strokeWidth = 3;
    series.stroke = am4core.color(lineColor);

    series.tensionX = 0.96;
    series.tensionY = 0.96;

    series.showOnInit = true;

    if (isDashed) {
      series.strokeDasharray = '10';
    }

    return series;
  };

  useEffect(() => {
    // destroy chart in case of re-render
    if (chartRef.current) {
      chartRef.current.dispose();
    }

    if (!saturationTangent?.length || !budgetRevenueResponseCurve?.length) return;

    chartRef.current = am4core.create(CHART_CONTAINER, am4charts.XYChart);

    chartRef.current.data = saturationTangent?.map((dataPoint, idx) => ({
      budget: dataPoint[0],
      saturation: dataPoint[1],
      [funnelStepTitle]: budgetRevenueResponseCurve[idx][1],
    }));

    chartRef.current.paddingLeft = -2;

    const xValueAxis = chartRef.current.xAxes.push(new am4charts.ValueAxis());
    xValueAxis.renderer.labels.template.fontSize = 12;
    xValueAxis.renderer.minGridDistance = 50;
    xValueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    xValueAxis.renderer.grid.template.strokeOpacity = 0;

    // Add value axis
    const yValueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
    yValueAxis.renderer.grid.template.stroke = am4core.color(nexyColors.paleGrey);
    yValueAxis.renderer.minGridDistance = 50;
    yValueAxis.renderer.grid.template.strokeOpacity = 1;
    yValueAxis.renderer.grid.template.strokeWidth = 2;
    yValueAxis.renderer.labels.template.fill = am4core.color(nexyColors.cloudyBlue80);
    yValueAxis.renderer.labels.template.fontSize = 12;
    yValueAxis.renderer.gridContainer.toFront();
    yValueAxis.renderer.labels.template.adapter.add('text', (text) => (text ? text.toUpperCase() : text));

    createSeries('budget', funnelStepTitle, `${funnelStepTitle} Saturation`, '#05A8FA', false);
    createSeries('budget', 'saturation', 'Saturation tangent', 'rgba(116, 76, 237, 0.33)', true);
    createBulletSeries(saturationPoint?.[0], saturationPoint?.[1], saturationScore || 'N/A');

    // Disable axis tooltips
    xValueAxis.cursorTooltipEnabled = false;
    xValueAxis.renderer.labels.template.dy = 8;
    xValueAxis.title.text = 'SPEND';
    xValueAxis.title.fontSize = 11;
    xValueAxis.title.align = 'center';
    xValueAxis.title.fontWeight = 'bold';
    xValueAxis.title.fill = am4core.color(nexyColors.cloudyBlue80);
    xValueAxis.title.dy = 10;

    yValueAxis.cursorTooltipEnabled = false;
    yValueAxis.title.text = funnelStepTitle?.toUpperCase();
    yValueAxis.title.fill = am4core.color(nexyColors.cloudyBlue80);
    yValueAxis.title.fontSize = 11;
    yValueAxis.title.fontWeight = 'bold';

    // Disable zoom
    chartRef.current.zoomOutButton.disabled = true;
    // Legend
    chartRef.current.legend = new am4charts.Legend();
    chartRef.current.legend.fontSize = '11px';
    chartRef.current.legend.contentAlign = 'left';
    chartRef.current.legend.marginTop = 20;
    chartRef.current.legend.paddingLeft = 55;

    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, [saturationTangent, budgetRevenueResponseCurve, funnelStepTitle]);

  return (
    <div style={{ padding: '20px 24px' }}>
      <Typography variant="h2" style={{ fontSize: 20, marginBottom: 32 }}>
        High Saturation Detected
      </Typography>
      <ChartContainerStyled
        data-cy={CHART_CONTAINER}
        id={CHART_CONTAINER}
        style={{
          width: '550px',
          height: '430px',
          marginBottom: 16,
        }}
      />
      <div>
        {saturationProfitPerUnit ? (
          <>
            <Typography variant="titleCard" style={{ color: nexyColors.paleSlateGray, marginBottom: 8 }}>
              What does the {saturationScore} ratio mean for this content?
            </Typography>
            <Typography withEllipsis={false} style={{ color: nexyColors.coolGray, maxWidth: 540 }}>
              This content has a saturation score of {saturationScore}. This means that an additional{' '}
              {saturationProfitPerUnit?.toFixed(2)}{' '}
              {funnelStepType !== NexoyaFunnelStepType.ConversionValue ? currencySymbol[currency] : ''} have to be
              spent to get one additional {funnelStepTitle}.
            </Typography>
          </>
        ) : null}
      </div>
    </div>
  );
}
