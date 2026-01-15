import { useGetSeriesColor } from 'utils/chart';

import * as Styles from 'components/Charts/styles/PortfolioPerformanceChart';

function PerformanceLegend() {
  const getSeriesColor = useGetSeriesColor();
  return (
    <>
      <div>
        <Styles.LegendAchieved backgroundColor={getSeriesColor('achieved')} />
        Achieved
      </div>
      <div>
        <Styles.LegendPredicted backgroundColor={getSeriesColor('predicted')} />
        Baseline
      </div>
      <div>
        <Styles.LegendPotential backgroundColor={getSeriesColor('potential')} />
        Optimization
      </div>
    </>
  );
}

export default PerformanceLegend;
