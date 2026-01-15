import {
  NexoyaDailyContentMetric,
  NexoyaDailyMetric,
  NexoyaFunnelStepPerformance,
  NexoyaFunnelStepType,
  NexoyaFunnelStepV2,
  NexoyaProvider,
  NexoyaTranslation,
} from 'types';
import { useProviders } from 'context/ProvidersProvider';
import translate from 'utils/translate';
import { PerformanceProvider } from '../components/PerformanceTable/data-table';
import useTranslationStore from '../store/translations';

export default function AdSpendReportController({
  contentMetrics,
  performanceFunnelSteps,
  portfolioTitle,
  duration,
  funnelSteps,
  exportType,
}: {
  contentMetrics: PerformanceProvider[];
  performanceFunnelSteps: NexoyaFunnelStepPerformance[];
  portfolioTitle: string;
  duration: string;
  funnelSteps: NexoyaFunnelStepV2[];
  exportType: 'daily' | 'summed';
}) {
  const { providerById } = useProviders();
  const { translations } = useTranslationStore();

  if (exportType === 'summed') {
    return createSummedReport(contentMetrics, portfolioTitle, duration, funnelSteps, providerById, translations);
  } else {
    return createDailyReport(performanceFunnelSteps, portfolioTitle, duration, funnelSteps, providerById, translations);
  }
}

type DailyContentMetricWithMetadata = NexoyaDailyContentMetric & {
  impactGroup?: { name?: string | null } | null;
  label?: { name?: string | null } | null;
};

type DailyMetricWithMetadata = Omit<NexoyaDailyMetric, 'impactGroups' | 'labels' | 'providers' | 'contents'> & {
  contents: Array<DailyContentMetricWithMetadata>;
};

interface PartialNexoyaFunnelStepPerformance {
  funnelStep: NexoyaFunnelStepV2;
  dailyMetrics: DailyMetricWithMetadata[];
}

const createDailyReport = (
  performanceFunnelSteps: PartialNexoyaFunnelStepPerformance[],
  portfolioTitle: string,
  duration: string,
  funnelSteps: NexoyaFunnelStepV2[],
  providerById: (id: number) => NexoyaProvider,
  translations: NexoyaTranslation[],
) => {
  const portfolioRow = [{ value: 'Portfolio' }, { value: portfolioTitle, span: 5 }];
  const durationRow = [{ value: 'Duration' }, { value: duration, span: 5 }];
  const dummyRow = [{ value: '', span: 7 }];

  const titlesRow = [
    {
      value: 'Date',
      align: 'left',
      span: 1,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
    },
    {
      value: 'Channel',
      align: 'left',
      span: 1,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
    },
    {
      value: 'Content',
      align: 'left',
      span: 1,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
    },
    {
      value: 'Optimized',
      align: 'left',
      span: 1,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
    },
    {
      value: 'Impact Group',
      align: 'left',
      span: 1,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
    },
    {
      value: 'Label',
      align: 'left',
      span: 1,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
    },
    ...funnelSteps.flatMap((step) => [
      {
        value: step.type === NexoyaFunnelStepType.Cost ? 'Ad spend' : step.title,
        align: 'center' as const,
        span: 1,
        fontWeight: 'bold',
        wrap: true,
        backgroundColor: '#0ec76a',
      },
    ]),
    ...funnelSteps
      .filter((step) => step.type !== NexoyaFunnelStepType.Cost)
      .flatMap((step) => [
        {
          value: (step.type === NexoyaFunnelStepType.ConversionValue ? 'Ratio ' : 'Cost-per ') + step.title,
          align: 'center' as const,
          span: 1,
          fontWeight: 'bold',
          wrap: true,
          backgroundColor: '#0ec76a',
        },
      ]),
    ...funnelSteps
      .filter((step) => step.type === NexoyaFunnelStepType.ConversionValue)
      .flatMap((step) => [
        {
          value: `${step.title} per cost`,
          align: 'center',
          span: 1,
          fontWeight: 'bold',
          wrap: true,
          backgroundColor: '#0ec76a',
        },
      ]),
  ];

  const dailyRows = [];
  const totals: any = {};

  const days = performanceFunnelSteps[0]?.dailyMetrics || [];

  days.forEach((dailyMetric) => {
    dailyMetric.contents?.forEach((contentMetric) => {
      const contentTitle = contentMetric.title;
      const provider = providerById(Number(contentMetric.providerId));
      const providerName = translate(translations, provider.name);
      const impactGroupName = contentMetric.impactGroup?.name;
      const labelName = contentMetric.label?.name;

      const dailyRow: any[] = [
        {
          value: dailyMetric.day,
          span: 1,
          align: 'left',
        },
        {
          value: providerName,
          wrap: true,
          span: 1,
        },
        {
          value: contentTitle,
          span: 1,
          align: 'left',
        },
        {
          value: contentMetric.isIncludedInOptimization ? 'Yes' : 'No',
          span: 1,
          align: 'left',
        },
        {
          value: impactGroupName ?? '',
          span: 1,
          align: 'left',
        },
        {
          value: labelName ?? '',
          span: 1,
          align: 'left',
        },
      ];

      // First, add all value cells
      performanceFunnelSteps.forEach((fsp) => {
        const day = fsp.dailyMetrics.find((dm) => dm.day === dailyMetric.day);
        const cm = day.contents.find((cm) => cm.contentId === contentMetric.contentId);

        const value = cm?.value?.value || 0;

        dailyRow.push({
          value,
          span: 1,
          align: 'center',
          type: Number,
          format: '#,##0.00',
        });

        // Aggregate totals
        if (!totals[fsp.funnelStep.funnelStepId]) {
          totals[fsp.funnelStep.funnelStepId] = { value: 0, costRatio: 0, count: 0 };
        }

        totals[fsp.funnelStep.funnelStepId].value += value;
        totals[fsp.funnelStep.funnelStepId].count += 1;
      });

      // Then, add all costRatio cells
      performanceFunnelSteps.forEach((fsp) => {
        const day = fsp.dailyMetrics.find((dm) => dm.day === dailyMetric.day);
        const cm = day.contents.find((cm) => cm.contentId === contentMetric.contentId);

        const costRatio = cm?.value?.costRatio || 0;

        if (fsp.funnelStep?.type !== NexoyaFunnelStepType.Cost) {
          dailyRow.push({
            value: costRatio,
            span: 1,
            align: 'center',
            type: Number,
            format: '#,##0.00',
          });

          totals[fsp.funnelStep.funnelStepId].costRatio += costRatio;
        }
      });

      performanceFunnelSteps.forEach((fsp) => {
        if (fsp.funnelStep?.type === NexoyaFunnelStepType.ConversionValue) {
          const day = fsp.dailyMetrics.find((dm) => dm.day === dailyMetric.day);
          const cm = day.contents.find((cm) => cm.contentId === contentMetric.contentId);

          dailyRow.push({
            value: cm?.value?.roas || 0,
            span: 1,
            align: 'center',
            type: Number,
            format: '#,##0.00',
          });

          totals[fsp.funnelStep.funnelStepId].roas =
            (totals[fsp.funnelStep.funnelStepId].roas || 0) + (cm?.value?.roas || 0);
        }
      });

      dailyRows.push(dailyRow);
    });
  });

  // Construct the total row
  const totalRow: any[] = [
    {
      value: 'Average / Total',
      span: 1,
      rowSpan: 1,
      alignVertical: 'center',
      align: 'left',
      fontWeight: 'bold',
    },
    { value: '', span: 1 },
    { value: '', span: 1 },
    { value: '', span: 1 },
    { value: '', span: 1 },
    { value: '', span: 1 },
  ];

  performanceFunnelSteps.forEach((fsp) => {
    const stepTotal = totals[fsp.funnelStep.funnelStepId];

    totalRow.push({
      value: stepTotal.value,
      rowSpan: 1,
      alignVertical: 'center',
      span: 1,
      align: 'center',
      type: Number,
      format: '#,##0.00',
      fontWeight: 'bold',
    });
  });

  performanceFunnelSteps.forEach((fsp) => {
    if (fsp.funnelStep?.type !== NexoyaFunnelStepType.Cost) {
      const stepTotal = totals[fsp.funnelStep.funnelStepId];
      const averageCostRatio = stepTotal.costRatio / stepTotal.count;

      totalRow.push({
        value: averageCostRatio,
        rowSpan: 1,
        alignVertical: 'center',
        span: 1,
        align: 'center',
        type: Number,
        format: '#,##0.00',
        fontWeight: 'bold',
      });
    }
  });

  performanceFunnelSteps.forEach((fsp) => {
    if (fsp.funnelStep?.type === NexoyaFunnelStepType.ConversionValue) {
      const stepTotal = totals[fsp.funnelStep.funnelStepId];
      const costStep = performanceFunnelSteps.find((step) => step.funnelStep?.type === NexoyaFunnelStepType.Cost);
      const costStepTotal = totals[costStep.funnelStep.funnelStepId];

      totalRow.push({
        value: stepTotal.value && costStepTotal.value ? (stepTotal.value / costStepTotal.value) * 100 : 0,
        rowSpan: 1,
        alignVertical: 'center',
        span: 1,
        align: 'center',
        type: Number,
        format: '#,##0.00',
        fontWeight: 'bold',
      });
    }
  });

  return [portfolioRow, durationRow, dummyRow, titlesRow, ...dailyRows, totalRow];
};

const createSummedReport = (
  contentMetrics: PerformanceProvider[] = [],
  portfolioTitle: string,
  duration: string,
  funnelSteps: NexoyaFunnelStepV2[],
  providerById: (id: number) => NexoyaProvider,
  translations: NexoyaTranslation[],
) => {
  const portfolioRow = [{ value: 'Portfolio' }, { value: portfolioTitle, span: 5 }];
  const durationRow = [{ value: 'Duration' }, { value: duration, span: 5 }];
  const dummyRow = [{ value: '', span: 7 }];

  const funnelStepsWithoutCost = funnelSteps?.filter((step) => step.type !== NexoyaFunnelStepType.Cost);

  const titlesRow = [
    {
      value: 'Channel',
      align: 'left',
      span: 1,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
    },
    {
      value: 'Content',
      align: 'center',
      span: 1,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
    },
    {
      value: 'Ad spend',
      align: 'center',
      span: 1,
      fontWeight: 'bold',
      backgroundColor: '#0ec76a',
    },
    ...funnelStepsWithoutCost.flatMap((step) => [
      {
        value: step?.title,
        align: 'center' as const,
        span: 1,
        fontWeight: 'bold',
        backgroundColor: '#0ec76a',
      },
    ]),
    ...funnelStepsWithoutCost.flatMap((step) => [
      {
        value: (step?.type === NexoyaFunnelStepType.ConversionValue ? 'Ratio ' : 'Cost-per ') + step?.title,
        align: 'center' as const,
        span: 1,
        fontWeight: 'bold',
        backgroundColor: '#0ec76a',
      },
    ]),
    // Add ROAS columns for Conversion Value steps
    ...funnelStepsWithoutCost
      .filter((step) => step?.type === NexoyaFunnelStepType.ConversionValue)
      .flatMap((step) => [
        {
          value: `${step?.title} per cost`,
          align: 'center',
          span: 1,
          fontWeight: 'bold',
          backgroundColor: '#0ec76a',
        },
      ]),
  ];

  const contentRows = [];
  contentMetrics.forEach((cm) => {
    const provider = providerById(Number(cm.providerId));
    const providerName = translate(translations, provider.name);
    const firstFunnelStep = cm.funnelSteps[0];

    firstFunnelStep.contents.forEach((content) => {
      const contentRow: any = [
        // Provider name space
        {
          value: providerName,
          wrap: true,
          span: 1,
        },
        // Content name
        {
          value: content?.title || 'No data',
          wrap: true,
          span: 1,
        },
      ];

      // Ad spend
      contentRow.push({
        value: content?.total?.adSpend,
        span: 1,
        align: 'center',
        type: Number,
        format: '#,##0.00',
      });

      // Content rows
      funnelStepsWithoutCost.forEach((step) => {
        const stepData = cm.funnelSteps.find((fs) => fs.funnelStep?.funnelStepId === step.funnelStepId);
        const contentData = stepData?.contents.find((c) => c.contentId === content.contentId);

        contentRow.push({
          value: contentData?.total?.value,
          span: 1,
          align: 'center',
          type: Number,
          format: '#,##0.00',
        });
      });

      funnelStepsWithoutCost.forEach((step) => {
        const stepData = cm.funnelSteps.find((fs) => fs.funnelStep?.funnelStepId === step.funnelStepId);
        const contentData = stepData?.contents.find((c) => c.contentId === content.contentId);

        contentRow.push({
          value: contentData?.total?.costRatio,
          span: 1,
          align: 'center',
          type: Number,
          format: '#,##0.00',
        });
      });

      funnelStepsWithoutCost
        .filter((step) => step?.type === NexoyaFunnelStepType.ConversionValue)
        .forEach((step) => {
          const stepData = cm.funnelSteps.find((fs) => fs.funnelStep?.funnelStepId === step.funnelStepId);
          const contentData = stepData?.contents.find((c) => c.contentId === content.contentId);

          contentRow.push({
            value: contentData?.total?.roas || 0,
            span: 1,
            align: 'center',
            type: Number,
            format: '#,##0.00',
          });
        });

      contentRows.push(contentRow);
    });
  });

  const getTotalsRow = () => {
    const totals = contentMetrics[0].funnelSteps.map((step) => ({
      value: 0,
      adSpend: 0,
      type: step?.funnelStep?.type,
    }));

    contentMetrics.forEach((cm) => {
      cm.funnelSteps.forEach((fs, index) => {
        if (index < totals.length) {
          totals[index].value += fs?.total?.value;
          totals[index].adSpend += fs.contents.reduce((sum, content) => sum + content?.total?.adSpend, 0);
        }
      });
    });

    return [
      {
        value: 'Average / Total',
        span: 1,
        rowSpan: 1,
        alignVertical: 'center',
        align: 'left',
        fontWeight: 'bold',
      },
      { value: '', span: 1 },
      ...totals.flatMap((total) => [
        {
          value: total.value,
          rowSpan: 1,
          alignVertical: 'center',
          span: 1,
          align: 'center',
          type: Number,
          format: '#,##0.00',
          fontWeight: 'bold',
        },
      ]),
      ...totals.flatMap((total) =>
        [
          total?.type === NexoyaFunnelStepType.Cost
            ? null
            : {
                value: total.adSpend / total.value,
                rowSpan: 1,
                alignVertical: 'center',
                span: 1,
                align: 'center',
                type: Number,
                format: '#,##0.00',
                fontWeight: 'bold',
              },
        ].filter(Boolean),
      ),
      ...totals
        .filter((total) => total.type === NexoyaFunnelStepType.ConversionValue)
        .map((total) => ({
          value: total.value && total.adSpend ? (total.value / total.adSpend) * 100 : 0,
          rowSpan: 1,
          alignVertical: 'center',
          span: 1,
          align: 'center',
          type: Number,
          format: '#,##0.00',
          fontWeight: 'bold',
        })),
    ];
  };

  return [portfolioRow, durationRow, dummyRow, titlesRow, ...contentRows, getTotalsRow()];
};
