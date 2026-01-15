import React from 'react';

import { NexoyaFunnelStepType, NexoyaValidationPerformance } from 'types';

import Text from 'components/Text';

import * as Styles from '../../styles/OptimizationProposal';

import DetailedReportPerformanceTableRow from './DetailedReportPerformanceTableRow';
import { useCurrencyStore } from 'store/currency-selection';

interface Props {
  data: NexoyaValidationPerformance[];
  activeFunnelStepId: number;
  showOptimized: boolean;
  funnelSteps: any[];
}

function DetailedReportPerformanceTable({ data, activeFunnelStepId, showOptimized, funnelSteps }: Props) {
  const { numberFormat } = useCurrencyStore();
  const Formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(numberFormat, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
    [numberFormat],
  );

  const getFunnelStepType = (funnelStepId: number) => {
    const type = funnelSteps?.find((fs) => fs.funnelStepId === funnelStepId)?.type;
    const isConversionValueFunnelStep = type === NexoyaFunnelStepType.ConversionValue;
    const isAwarenessFunnelStep = type === NexoyaFunnelStepType.Awareness;
    return { isConversionValueFunnelStep, isAwarenessFunnelStep };
  };

  return (
    <Styles.PerformanceChartWrapper>
      <Styles.CostGridHeaderStyled count={data.length * 2}>
        <Styles.GridCell>
          <Text></Text>
        </Styles.GridCell>
        {data.map((item) => {
          const { isAwarenessFunnelStep } = getFunnelStepType(item.funnelStep.funnel_step_id);
          return (
            <Styles.GridCell
              active={activeFunnelStepId === item.funnelStep.funnel_step_id}
              isTitle={true}
              key={`cost-per-${item.funnelStep.funnel_step_id}`}
            >
              <Text>
                {isAwarenessFunnelStep ? (
                  'CPM'
                ) : (
                  <>
                    Cost-per
                    <br />
                    {item.funnelStep.title}
                  </>
                )}
              </Text>
            </Styles.GridCell>
          );
        })}
        {data.map((item) => (
          <Styles.GridCell
            key={`cost-per-title-${item.funnelStep.funnel_step_id}`}
            isTitle={true}
            active={activeFunnelStepId === item.funnelStep.funnel_step_id}
          >
            <Text>{item.funnelStep.title}</Text>
          </Styles.GridCell>
        ))}
      </Styles.CostGridHeaderStyled>
      {showOptimized ? (
        <DetailedReportPerformanceTableRow
          title="Optimized"
          data={data}
          dataField="Optimized"
          formatter={Formatter}
          activeFunnelStepId={activeFunnelStepId}
          variant="primary"
        />
      ) : null}
      <DetailedReportPerformanceTableRow
        title="Achieved"
        data={data}
        dataField="Achieved"
        formatter={Formatter}
        activeFunnelStepId={activeFunnelStepId}
        variant="secondary"
      />
      <DetailedReportPerformanceTableRow
        title="Non-optimized"
        data={data}
        dataField="NonOptimized"
        formatter={Formatter}
        activeFunnelStepId={activeFunnelStepId}
        variant="tertiary"
      />
      <Styles.TotalsGridRow count={data.length * 2}>
        <Text style={{ paddingLeft: 32 }}>Gain/Loss</Text>
        {data.map((item, index) => (
          <Styles.TypographyPercentageStyled
            key={`gain-${index}`}
            invertedColoring={true}
            active={activeFunnelStepId === item.funnelStep.funnel_step_id}
            value={item.validationDataTotal.gainLossCostPer}
          >
            {Formatter.format(item.validationDataTotal.gainLossCostPer * 100)}%
          </Styles.TypographyPercentageStyled>
        ))}
        {data.map((item, index) => (
          <Styles.TypographyPercentageStyled
            key={`total-gain-${index}`}
            active={activeFunnelStepId === item.funnelStep.funnel_step_id}
            value={item.validationDataTotal.gainLossTotal}
          >
            {Formatter.format(item.validationDataTotal.gainLossTotal * 100)}%
          </Styles.TypographyPercentageStyled>
        ))}
      </Styles.TotalsGridRow>
    </Styles.PerformanceChartWrapper>
  );
}

export default DetailedReportPerformanceTable;
