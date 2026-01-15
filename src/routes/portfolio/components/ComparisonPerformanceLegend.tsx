import { useGetSeriesColor } from 'utils/chart';

import * as Styles from 'components/Charts/styles/PortfolioPerformanceChart';
import { DateParam, useQueryParams } from 'use-query-params';
import dayjs from 'dayjs';

export function ComparisonPerformanceLegend() {
  const [qp] = useQueryParams({
    compareFrom: DateParam,
    compareTo: DateParam,
    dateFrom: DateParam,
    dateTo: DateParam,
  });
  const getSeriesColor = useGetSeriesColor();
  return (
    <>
      <div>
        <Styles.LegendAchieved
          className="h-4 w-10 border-t-2 border-dotted"
          style={{ borderColor: getSeriesColor('past') }}
        />
        {dayjs(qp.compareFrom).format('DD MMM YYYY')} - {dayjs(qp.compareTo).format('DD MMM YYYY')}
      </div>
      <div>
        <Styles.LegendPredicted className="h-2 w-6 border-t-2" style={{ borderColor: getSeriesColor('potential') }} />
        {dayjs(qp.dateFrom).format('DD MMM YYYY')} - {dayjs(qp.dateTo).format('DD MMM YYYY')}
      </div>
    </>
  );
}
