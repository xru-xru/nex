import { NexoyaFunnelStepPerformance, NexoyaValidationReportRows, NexoyaValidationReportValuesPerFunnel } from 'types';

import { useProviders } from 'context/ProvidersProvider';

import translate from 'utils/translate';
import useTranslationStore from '../store/translations';

const sortFunnelSteps = (
  incorrectOrderArray: NexoyaValidationReportValuesPerFunnel[],
  correctOrderArray: NexoyaFunnelStepPerformance[],
) => {
  const order = correctOrderArray.reduce((acc, step, idx) => {
    acc[step?.funnelStep?.funnelStepId] = idx;
    return acc;
  }, {});

  return [...incorrectOrderArray].sort((stepA, stepB) => {
    const indexA = order[stepA.funnelStepId];
    const indexB = order[stepB.funnelStepId];
    return indexA - indexB;
  });
};

export default function PerformanceReportController(
  data: NexoyaValidationReportRows[] = [],
  initialFunnelSteps: NexoyaFunnelStepPerformance[],
  portfolioTitle: string,
  duration: string,
) {
  const { providerById } = useProviders();
  const funnelSteps = sortFunnelSteps(data[0]?.valuesPerFunnel, initialFunnelSteps);

  const { translations } = useTranslationStore();

  const portfolioRow = [
    { value: 'Portfolio' },
    { value: portfolioTitle },
    null,
    null,
    null,
    null,
    null,
    ...funnelSteps
      .map(() => [
        {
          value: '',
        },
        null,
        null,
        null,
      ])
      .flat(),
  ];
  const durationRow = [
    { value: 'Duration' },
    { value: duration },
    null,
    null,
    null,
    null,
    null,
    ...funnelSteps
      .map(() => [
        {
          value: '',
        },
        null,
        null,
        null,
      ])
      .flat(),
  ];
  const dummyRow = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    ...funnelSteps
      .map(() => [
        {
          value: '',
        },
        null,
        null,
        null,
      ])
      .flat(),
  ];
  const titlesRow = [
    null,
    null,
    null,
    {
      value: 'Spendings',
      align: 'center',
      span: 2,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
      leftBorderColor: '#000000',
      leftBorderStyle: 'thin',
      rightBorderColor: '#000000',
      rightBorderStyle: 'thin',
    },
    null,
    {
      value: 'Budget changes',
      align: 'center',
      span: 3,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
      leftBorderColor: '#000000',
      leftBorderStyle: 'thin',
      rightBorderColor: '#000000',
      rightBorderStyle: 'thin',
    },
    null,
    null,
    ...funnelSteps
      .map((fs) => [
        {
          value: fs.funnelStepTitle,
          align: 'center',
          span: 4,
          fontWeight: 'bold',
          height: 30,
          backgroundColor: '#0ec76a',
          leftBorderColor: '#000000',
          leftBorderStyle: 'thin',
          rightBorderColor: '#000000',
          rightBorderStyle: 'thin',
        },
        null,
        null,
        null,
      ])
      .flat(),
  ];

  const subtitlesRow = [
    {
      value: 'Channel',
      height: 25,
      fontWeight: 'bold',
      topBorderColor: '#000000',
      topBorderStyle: 'thin',
      leftBorderColor: '#000000',
      leftBorderStyle: 'thin',
      rightBorderStyle: 'thin',
      rightBorderColor: '#000000',
      bottomBorderColor: '#000000',
      bottomBorderStyle: 'thin',
    },
    {
      value: 'Content',
      fontWeight: 'bold',
      topBorderColor: '#000000',
      topBorderStyle: 'thin',
      bottomBorderColor: '#000000',
      bottomBorderStyle: 'thin',
    },
    {
      value: 'Parent Content',
      fontWeight: 'bold',
      topBorderColor: '#000000',
      topBorderStyle: 'thin',
      bottomBorderColor: '#000000',
      bottomBorderStyle: 'thin',
    },
    {
      value: 'Proposed',
      fontWeight: 'bold',
      align: 'right',
      leftBorderColor: '#000000',
      leftBorderStyle: 'thin',
      bottomBorderColor: '#000000',
      bottomBorderStyle: 'thin',
    },
    {
      value: 'Spent',
      fontWeight: 'bold',
      align: 'right',
      rightBorderColor: '#000000',
      rightBorderStyle: 'thin',
      bottomBorderColor: '#000000',
      bottomBorderStyle: 'thin',
    },
    {
      value: 'Suggested % budget change',
      fontWeight: 'bold',
      align: 'right',
      leftBorderColor: '#000000',
      leftBorderStyle: 'thin',
      bottomBorderColor: '#000000',
      bottomBorderStyle: 'thin',
    },
    {
      value: 'Applied % budget change',
      fontWeight: 'bold',
      align: 'right',
      bottomBorderColor: '#000000',
      bottomBorderStyle: 'thin',
    },
    {
      value: 'Application delta',
      fontWeight: 'bold',
      align: 'right',
      rightBorderColor: '#000000',
      rightBorderStyle: 'thin',
      bottomBorderColor: '#000000',
      bottomBorderStyle: 'thin',
    },
    ...funnelSteps
      .map((fs) => [
        {
          value: `Cost per ${fs.funnelStepTitle}`,
          align: 'right',
          fontWeight: 'bold',
          leftBorderColor: '#000000',
          leftBorderStyle: 'thin',
          bottomBorderColor: '#000000',
          bottomBorderStyle: 'thin',
          rightBorderColor: '#000000',
          rightBorderStyle: 'thin',
        },
        {
          value: `Achieved ${fs.funnelStepTitle}`,
          align: 'right',
          fontWeight: 'bold',
          bottomBorderColor: '#000000',
          bottomBorderStyle: 'thin',
        },
        {
          value: `Optimized ${fs.funnelStepTitle}`,
          align: 'right',
          fontWeight: 'bold',
          bottomBorderColor: '#000000',
          bottomBorderStyle: 'thin',
        },
        {
          value: `Non-optimized ${fs.funnelStepTitle}`,
          align: 'right',
          fontWeight: 'bold',
          rightBorderColor: '#000000',
          rightBorderStyle: 'thin',
          bottomBorderColor: '#000000',
          bottomBorderStyle: 'thin',
        },
      ])
      .flat(),
  ];
  const contentRows: any = [
    ...data.map((item, index) => {
      const cells = [];
      const provider = providerById(Number(item.channelTitle));
      const providerName = translate(translations, provider.name);
      const last = index === data.length - 1;
      // provider name
      cells.push({
        value: providerName,
        leftBorderColor: '#000000',
        leftBorderStyle: 'thin',
        rightBorderColor: '#000000',
        rightBorderStyle: 'thin',
        ...(last
          ? {
              bottomBorderColor: '#000000',
              bottomBorderStyle: 'thin',
            }
          : {}),
      });

      // collection name
      cells.push({
        value: translate(translations, item.contentTitle),
        rightBorderColor: '#000000',
        rightBorderStyle: 'thin',
        ...(last
          ? {
              bottomBorderColor: '#000000',
              bottomBorderStyle: 'thin',
            }
          : {}),
      });

      // parent collection name
      cells.push({
        value: item.parentContentTitle ? translate(translations, item.parentContentTitle) : '',
        rightBorderColor: '#000000',
        rightBorderStyle: 'thin',
        ...(last
          ? {
              bottomBorderColor: '#000000',
              bottomBorderStyle: 'thin',
            }
          : {}),
      });

      //planned
      cells.push({
        value: item.spendings?.proposed,
        type: Number,
        format: '#,##0.00',
        leftBorderColor: '#000000',
        leftBorderStyle: 'thin',
        ...(last
          ? {
              bottomBorderColor: '#000000',
              bottomBorderStyle: 'thin',
            }
          : {}),
      });
      //spent
      cells.push({
        value: item.spendings?.spent,
        type: Number,
        format: '#,##0.00',
        rightBorderColor: '#000000',
        rightBorderStyle: 'thin',
        ...(last
          ? {
              bottomBorderColor: '#000000',
              bottomBorderStyle: 'thin',
            }
          : {}),
      });
      cells.push({
        value: `${(item.budgetChanges?.suggestedPctChange * 100).toFixed(2)}%`,
        leftBorderColor: '#000000',
        leftBorderStyle: 'thin',
        ...(last
          ? {
              bottomBorderColor: '#000000',
              bottomBorderStyle: 'thin',
            }
          : {}),
      });
      cells.push({
        value: `${(item.budgetChanges?.appliedPctChange * 100).toFixed(2)}%`,
        ...(last
          ? {
              bottomBorderColor: '#000000',
              bottomBorderStyle: 'thin',
            }
          : {}),
      });
      cells.push({
        value: `${(item.budgetChanges?.applicationDelta * 100).toFixed(2)}%`,
        rightBorderColor: '#000000',
        rightBorderStyle: 'thin',
        ...(last
          ? {
              bottomBorderColor: '#000000',
              bottomBorderStyle: 'thin',
            }
          : {}),
      });
      sortFunnelSteps(item.valuesPerFunnel, initialFunnelSteps).map((fs) => {
        cells.push({
          value: fs.costPer,
          type: Number,
          format: '#,##0.00',
          leftBorderColor: '#000000',
          leftBorderStyle: 'thin',
          ...(last
            ? {
                bottomBorderColor: '#000000',
                bottomBorderStyle: 'thin',
              }
            : {}),
        });
        cells.push({
          value: fs.achieved,
          ...(last
            ? {
                bottomBorderColor: '#000000',
                bottomBorderStyle: 'thin',
              }
            : {}),
        });
        cells.push({
          value: fs.optimized,
          ...(last
            ? {
                bottomBorderColor: '#000000',
                bottomBorderStyle: 'thin',
              }
            : {}),
        });
        cells.push({
          value: fs.nonOptimized,
          rightBorderStyle: 'thin',
          rightBorderColor: '#000000',
          ...(last
            ? {
                bottomBorderColor: '#000000',
                bottomBorderStyle: 'thin',
              }
            : {}),
        });
        return fs;
      });
      return cells;
    }),
  ];
  const notificationRow = [{ value: `This report doesn't contain skipped contents.` }];

  return [portfolioRow, durationRow, dummyRow, titlesRow, subtitlesRow, ...contentRows, notificationRow];
}
