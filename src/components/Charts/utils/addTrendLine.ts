import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import dayjs from 'dayjs';

interface IChartDataPoint {
  timestamp: string;
  value?: number;
}
export const addTrendLine = (chart: am4charts.XYChart, dataForChart: IChartDataPoint[], color: string) => {
  const { start, end } = calculateTrendLine(dataForChart);
  const trend = chart.series.push(new am4charts.LineSeries());
  trend.dataFields.valueY = 'value';
  trend.dataFields.dateX = 'timestamp';
  trend.strokeWidth = 3;
  trend.stroke = am4core.color(color);
  trend.strokeDasharray = '15,15';
  trend.data = [start, end];
};

const calculateTrendLine = (dataForChart: IChartDataPoint[]): { start: IChartDataPoint; end: IChartDataPoint } => {
  const dataForChartSorted = dataForChart?.sort((a, b) => dayjs(a.timestamp).diff(dayjs(b.timestamp)));

  const y = dataForChartSorted?.map((elem) => elem.value);
  const x = timestampsToNumber(dataForChartSorted?.map((elem) => elem.timestamp));
  const res = linearRegression(y, x);

  const firstDataPoint = dataForChartSorted?.[0];
  const lastDataPoint = dataForChartSorted?.[dataForChartSorted?.length - 1];

  return {
    start: {
      timestamp: firstDataPoint?.timestamp,
      value: res?.intercept,
    },
    end: {
      timestamp: lastDataPoint?.timestamp,
      value: res?.intercept + x?.[x?.length - 1] * res?.slope,
    },
  };
};

const timestampsToNumber = (timestamps: string[]) =>
  timestamps
    ?.map((timestamp) => dayjs(timestamp))
    ?.map((date, index, array) => {
      const previousDate = array[index - 1];
      return previousDate ? date.diff(previousDate) : 0;
    })
    ?.map((_, index, array) => array.slice(0, index + 1).reduce((a, b) => a + b, 0));

const linearRegression = (y: number[], x: number[]) => {
  const n = y?.length;
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;
  let sum_yy = 0;

  for (let i = 0; i < y?.length; i++) {
    sum_x += x[i];
    sum_y += y[i];
    sum_xy += x[i] * y[i];
    sum_xx += x[i] * x[i];
    sum_yy += y[i] * y[i];
  }

  const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  const intercept = (sum_y - slope * sum_x) / n;
  const r2 = Math.pow(
    (n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)),
    2,
  );
  return { slope, intercept, r2 };
};
