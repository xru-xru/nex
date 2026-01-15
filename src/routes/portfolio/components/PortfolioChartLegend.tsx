import * as Styles from 'components/Charts/styles/PortfolioPerformanceChart';

import CostPerLegend from './CostPerLegend';
import PerformanceLegend from './PerformanceLegend';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { ComparisonPerformanceLegend } from './ComparisonPerformanceLegend';
import RoasLegend from './RoasLegend';

type Props = {
  active: string;
  title: string;
};

function PortfolioChartLegend({ active, title }: Props) {
  const [dateComparisonActive] = useQueryParam('dateComparisonActive', BooleanParam);

  const renderLegendBasedOnActiveSwitch = () => {
    switch (active) {
      case 'performance':
        return <PerformanceLegend />;
      case 'cost-per':
        return <CostPerLegend title={title} />;
      case 'roas':
        return <RoasLegend title={title} />;
    }
  };

  return (
    <Styles.LegendWrapper style={{ marginBottom: 24 }}>
      {dateComparisonActive ? <ComparisonPerformanceLegend /> : renderLegendBasedOnActiveSwitch()}
    </Styles.LegendWrapper>
  );
}

export default PortfolioChartLegend;
