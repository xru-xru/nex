import { useGetSeriesColor } from 'utils/chart';

import * as Styles from 'components/Charts/styles/PortfolioPerformanceChart';

function RoasLegend({ title }) {
  const getSeriesColor = useGetSeriesColor();
  return (
    <>
      <div>
        <Styles.LegendAchieved backgroundColor={getSeriesColor('achieved')} />
        {title} per Cost
      </div>
      <div>
        <Styles.LegendAchieved backgroundColor={getSeriesColor('trend')} />
        Trend
      </div>
    </>
  );
}

export default RoasLegend;
