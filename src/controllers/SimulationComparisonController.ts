import { ExtendedNexoyaSimulationScenario, NexoyaFunnelStepType, NexoyaScenarioFunnelStep, Row } from 'types';

export default function SimulationComparisonController(
  scenarios: ExtendedNexoyaSimulationScenario[],
  funnelSteps: NexoyaScenarioFunnelStep[],
) {
  const isConversionValueFunnelStep = (funnelStepType: NexoyaFunnelStepType) =>
    funnelStepType === NexoyaFunnelStepType.ConversionValue;

  const titlesRow = [
    {
      value: 'Scenario',
      align: 'left',
      span: 1,
      fontWeight: 'bold',
      type: String,
    },
    {
      value: 'Budget',
      align: 'center',
      span: 2,
      fontWeight: 'bold',
      type: String,
    },
    null,
    ...funnelSteps.flatMap((funnelStep) => [
      {
        value: funnelStep?.funnelStep?.title,
        align: 'center',
        span: 2,
        type: String,
        fontWeight: 'bold',
      },
      null,
    ]),
    ...funnelSteps.flatMap((scFstep) => [
      {
        value: `${
          isConversionValueFunnelStep(scFstep.funnelStep.type) ? 'Ratio' : 'Cost-per'
        } ${scFstep?.funnelStep?.title}`,
        align: 'center',
        span: 2,
        type: String,
        fontWeight: 'bold',
      },
      null,
    ]),
  ];

  const subTitlesRow = [
    {
      value: '',
      align: '',
      span: 1,
    },
    // Budget
    {
      value: 'Value',
      align: 'center',
      span: 1,
      type: String,
    },
    {
      value: '% diff. from base',
      align: 'center',
      span: 1,
      type: String,
    },
    // Funnel steps
    ...funnelSteps.flatMap(() => [
      {
        value: 'Value',
        align: 'center',
        span: 1,
        type: String,
      },
      {
        value: '% diff. from base',
        align: 'center',
        span: 1,
        type: String,
      },
    ]),
    ...funnelSteps.flatMap(() => [
      {
        value: 'Cost-per',
        align: 'center',
        span: 1,
        type: String,
      },
      {
        value: '% diff. from base',
        align: 'center',
        span: 1,
        type: String,
      },
    ]),
  ];

  const contentRows: Row<Number | String>[] = [];

  scenarios.forEach((scenario) => {
    const childCells = [];

    // provider name
    childCells.push({
      value: `Scenario ${scenario.idx} ${scenario.isBaseScenario ? '(Base scenario)' : ''}`,
      span: 1,
    });

    // Budget value
    childCells.push({
      value: scenario?.budget?.totals?.currentScenarioTotal,
      wrap: true,
      span: 1,
      type: Number,
    });

    // Budget change %
    childCells.push({
      value: scenario?.budget?.totals?.changePercentTotal,
      wrap: true,
      span: 1,
      type: Number,
    });

    scenario.funnelSteps.forEach((funnelStep) => {
      // Funnel step value
      childCells.push({
        value: funnelStep?.total?.currentScenario,
        span: 1,
        align: 'center',
        type: Number,
        format: '#,##0',
      });
      // Funnel step change %
      childCells.push({
        value: funnelStep?.total?.changePercent,
        span: 1,
        align: 'center',
        type: Number,
      });
    });

    scenario.funnelSteps.forEach((funnelStep) => {
      // Funnel step value
      childCells.push({
        value: funnelStep?.costPer?.currentScenario,
        span: 1,
        align: 'center',
        type: Number,
        format: '#,##0',
      });

      // Funnel step change %
      childCells.push({
        value: funnelStep?.costPer?.changePercent,
        span: 1,
        align: 'center',
        type: Number,
      });
    });

    // @ts-ignore
    contentRows.push(childCells);
  });

  return [titlesRow, subTitlesRow, ...contentRows];
}
