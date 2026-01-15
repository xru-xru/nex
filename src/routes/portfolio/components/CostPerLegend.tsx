import { useGetSeriesColor } from 'utils/chart';

import * as Styles from 'components/Charts/styles/PortfolioPerformanceChart';

function CostPerLegend({ title }) {
  const getSeriesColor = useGetSeriesColor();
  return (
    <>
      <div>
        <Styles.LegendAchieved backgroundColor={getSeriesColor('achieved')} />
        Cost per {title}
      </div>
      <div>
        <Styles.LegendAchieved backgroundColor={getSeriesColor('trend')} />
        Trend
      </div>
    </>
  );
}

export default CostPerLegend;
