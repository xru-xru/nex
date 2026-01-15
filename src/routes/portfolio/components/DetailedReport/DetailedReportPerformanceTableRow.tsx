import * as React from 'react';

import { NexoyaValidationPerformance } from 'types';

import FormattedCurrency from 'components/FormattedCurrency';
import Text from 'components/Text';

import * as Styles from '../../styles/OptimizationProposal';

interface Props {
  title: string;
  data: NexoyaValidationPerformance[];
  dataField: 'Optimized' | 'Achieved' | 'NonOptimized';
  activeFunnelStepId: number;
  formatter: Intl.NumberFormat;
  variant: 'primary' | 'secondary' | 'tertiary';
}
function DetailedReportPerformanceTableRow({ title, data, dataField, activeFunnelStepId, variant, formatter }: Props) {
  return (
    <Styles.CostGridRow count={data.length * 2}>
      <Styles.ValueOptionStyled variant={variant}>
        <Styles.ValueGridCell>
          <Text>{title}</Text>
        </Styles.ValueGridCell>
      </Styles.ValueOptionStyled>
      {data.map((item, index) => (
        <Styles.GridCell key={index} active={activeFunnelStepId === item.funnelStep.funnel_step_id}>
          <FormattedCurrency amount={item.validationDataTotal[`costPer${dataField}`] || 0} />
        </Styles.GridCell>
      ))}
      {data.map((item, index) => (
        <Styles.GridCell key={index} active={activeFunnelStepId === item.funnelStep.funnel_step_id}>
          <Text>{formatter.format(item.validationDataTotal[`total${dataField}`] || 0)}</Text>
        </Styles.GridCell>
      ))}
    </Styles.CostGridRow>
  );
}

export default DetailedReportPerformanceTableRow;
