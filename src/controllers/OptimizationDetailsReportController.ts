import dayjs from 'dayjs';

import {
  NexoyaFunnelStepType,
  NexoyaOptimizationV2,
  NexoyaOptimizedContent,
  NexoyaOptimizedContentStatusType,
  NexoyaPortfolioV2,
  NexoyaTranslation,
} from 'types/types';

import { formatShortDate } from 'utils/formater';
import { getShareUrl } from 'utils/helpers';
import translate from 'utils/translate';

import { translateBiddingStrategyType } from '../routes/portfolio/components/OptimizationProposal/utils';
import { currencySymbol } from 'store/currency-selection';

const getArrayOfDatesFromDuration = (startDate: Date, endDate: Date): string[] => {
  const duration = dayjs(endDate).diff(dayjs(startDate), 'day');
  return Array.from({ length: duration + 1 }, (_, i) => dayjs(startDate).add(i, 'day').format('DD MMM YYYY'));
};

export function OptimizationDetailsReportController(
  portfolio: NexoyaPortfolioV2,
  optimization: NexoyaOptimizationV2,
  translations: NexoyaTranslation[],
  currency,
  numberFormat,
) {
  const formatCurrency = (value: number) => {
    if (value === null || value === undefined) {
      return '';
    }
    const formatted = Intl.NumberFormat(numberFormat, {
      style: 'currency',
      currency,
    }).format(value);
    const symbol = currencySymbol[currency];
    if (symbol) {
      return formatted.replace(currency, symbol);
    }
    return formatted;
  };

  const optiDurationArray = getArrayOfDatesFromDuration(optimization.start, optimization.end).map((item) => ({
    timestamp: item,
  }));
  const optimizationContent = optimization?.performance?.contents;
  const funnelStepsTotal = optimization.performance?.total?.funnelSteps.map((item) => ({
    title: item?.funnelStep?.title,
    type: item?.funnelStep?.type,
    ...item,
  }));

  const conversionValueTotalFunnelSteps = funnelStepsTotal.filter(
    (item) => item.type === NexoyaFunnelStepType.ConversionValue,
  );

  const totalBudgetChangePercent = optimization?.performance?.total?.budget?.changePercent;

  // There was a time when we had different daily budgets for each day
  // now we don't do that anymore, however we have kept the template as is for backwards compatibility for CSM
  const totalProposedBudget = optiDurationArray.map(() => optimization?.performance?.total?.budget?.proposed);

  // preparation of data for report header
  const reportHeader = [
    [
      {
        value: 'Portfolio',
        type: 'string',
      },
      {
        value: portfolio.title,
        type: 'string',
      },
    ],
    [
      {
        value: 'Duration',
        type: 'string',
      },
      {
        value: `${formatShortDate(
          portfolio?.start?.substring(0, 10),
          {
            year: 'numeric',
          },
          numberFormat,
        )} - ${formatShortDate(
          portfolio?.end?.substring(0, 10),
          {
            year: 'numeric',
          },
          numberFormat,
        )}`,
        type: 'string',
      },
    ],
    [
      {
        value: 'Optimization period: ',
        type: 'string',
      },
      {
        value: `${formatShortDate(
          optimization?.start?.substring(0, 10),
          {
            year: 'numeric',
          },
          numberFormat,
        )} - ${formatShortDate(
          optimization?.end?.substring(0, 10),
          {
            year: 'numeric',
          },
          numberFormat,
        )}`,
        type: 'string',
      },
    ],
    [
      {
        value: 'Currency',
        type: 'string',
      },
      {
        value: currency,
        type: 'string',
      },
    ],
    [
      {
        value: '',
        type: 'string',
      },
    ], // fake empty row
    [
      {
        value: 'Channel',
        type: 'string',
      },
      {
        value: 'Content',
        type: 'string',
      },
      {
        value: 'Parent Content',
        type: 'string',
      },
      {
        value: 'Type',
        type: 'string',
      },
      {
        value: 'Bidding strategy',
        type: 'string',
      },
      {
        value: 'Current target',
        type: 'string',
      },
      {
        value: 'Proposed target',
        type: 'string',
      },
      {
        value: 'Proposed target change',
        type: 'string',
      },
      {
        value: 'Previous lifetime budget',
        type: 'string',
      },
      {
        value: 'Proposed lifetime budget',
        type: 'string',
      },
      {
        value: 'Lifetime budget change',
        type: 'string',
      },
      {
        value: 'Avg. daily spend',
        type: 'string',
      },
      {
        value: 'Proposed daily budget',
        type: 'string',
      },
      {
        value: 'Budget delta',
        type: 'string',
      },
      {
        value: 'Change in compare to last days budget',
        type: 'string',
      },
      ...funnelStepsTotal.map((item) => ({
        value: `Cost-per ${item.title}`.toUpperCase(),
        type: 'string',
      })),
      ...conversionValueTotalFunnelSteps.map((item) => ({
        value: `Per-cost ${item.title}`,
        type: 'string',
      })),
      ...funnelStepsTotal.map((item) => ({
        value: `Total ${item.title}`,
        type: 'string',
      })),
      ...optiDurationArray.map((item) => ({
        value: item.timestamp,
        type: 'string',
      })),
      {
        value: 'Included in optimization',
        type: 'string',
      },
    ],
  ];
  // preparation of data for report content
  const reportContent = (optimizationContent || []).map((item: NexoyaOptimizedContent) => {
    const providerName = item?.content.provider.name;
    // Previous === spent
    const previousDailyBudget = item?.budget?.spent;
    const proposedDailyBudget = item?.budget?.proposed;
    const dailyBudgetPercentageChange = item?.budget?.changePercent;

    const funnelSteps = item.funnelSteps ?? [];
    const conversionValueFunnelSteps = funnelSteps.filter(
      (optimizedFunnelStep) => optimizedFunnelStep?.funnelStep?.type === NexoyaFunnelStepType.ConversionValue,
    );
    // There was a time when we had different daily budgets for each day
    // now we don't do that anymore, however we have kept the template as is for backwards compatibility for CSM
    const optiDurationArrayWithProposedBudget = optiDurationArray.map((date) => ({
      value: item?.budget?.proposed,
      timestamp: date,
    }));

    const teamCurrency = item?.budgetProposalData?.teamCurrency;
    const biddingStrategyType = teamCurrency?.proposedBiddingStrategy?.type;

    const previousLifetimeBudget = teamCurrency?.lifetimeBudget?.lifetimeBudgetSegments?.reduce(
      (acc, currItem) => acc + currItem.initialBudget,
      0,
    );
    const proposedLifetimeBudget = teamCurrency?.lifetimeBudget?.lifetimeBudgetSegments?.reduce(
      (acc, currItem) => acc + currItem.proposedBudget,
      0,
    );
    const lifetimeBudgetChangePercent =
      ((proposedLifetimeBudget - previousLifetimeBudget) / previousLifetimeBudget) * 100;

    const contentData = [
      {
        value: translate(translations, providerName),
        type: 'string',
      },
      {
        value: item?.content?.title || '',
        type: 'string',
      },
      {
        value: item?.content?.parent_collection?.title,
        type: 'string',
      },
      {
        value: item?.content?.collectionType?.name || '',
        type: 'string',
      },
      {
        value: translateBiddingStrategyType(biddingStrategyType) || '',
        type: 'string',
        wrap: true,
      },
      {
        value: teamCurrency?.initialBiddingStrategy?.value || '',
        type: Number,
      },
      {
        value: teamCurrency?.proposedBiddingStrategy?.value || '',
        type: Number,
      },
      {
        value: teamCurrency?.biddingStrategyChangePercent
          ? Intl.NumberFormat(numberFormat).format(teamCurrency?.biddingStrategyChangePercent) + '%'
          : '',
        type: Number,
      },

      {
        value: previousLifetimeBudget ? previousLifetimeBudget : '',
        type: Number,
      },
      {
        value: proposedLifetimeBudget ? proposedLifetimeBudget : '',
        type: Number,
      },
      {
        value: lifetimeBudgetChangePercent ? parseFloat(lifetimeBudgetChangePercent?.toFixed(2)) + '%' : '',
        type: Number,
      },
      {
        value: previousDailyBudget || '',
        type: Number,
      },
      {
        value: proposedDailyBudget || '',
        type: Number,
      },
      {
        value: parseFloat(Math.abs(previousDailyBudget - proposedDailyBudget).toFixed(2)) || '',
        type: Number,
      },
      {
        value: dailyBudgetPercentageChange ? `${dailyBudgetPercentageChange}%` : '',
        type: 'string',
      },
      ...funnelSteps.map((item) => ({
        value: item?.costPer?.predicted || '',
        type: Number,
      })),
      ...conversionValueFunnelSteps.map((conversionStep) => ({
        type: 'string',
        value: conversionStep?.roas?.predicted
          ? `${Intl.NumberFormat(numberFormat).format(conversionStep?.roas?.predicted)}%`
          : '',
      })),
      ...funnelSteps.map((item) => ({
        value: item?.metric?.predicted || '',
        type: Number,
      })),
      ...optiDurationArrayWithProposedBudget.map((da) => ({
        value: da?.value || '',
        type: Number,
      })),
      {
        value: item?.status?.type === NexoyaOptimizedContentStatusType?.Skipped ? 'Skipped' : 'Standard' || '',
        type: 'string',
      },
    ];
    return [...contentData];
  });
  // preparation of data for report footer (sums)
  const reportFooter = [
    [
      {
        type: 'string',
        value: 'Total ',
      },
      {
        type: 'string',
        value: ' ',
      },
      {
        type: 'string',
        value: ' ',
      },
      {
        type: 'string',
        value: ' ',
      },
      {
        type: 'string',
        value: ' ',
      },
      {
        type: 'string',
        value: ' ',
      },
      {
        type: 'string',
        value: ' ',
      },
      {
        type: 'string',
        value: ' ',
      },
      {
        type: Number,
        value: ' ',
      },
      {
        type: Number,
        value: ' ',
      },
      {
        type: 'string',
        value: ' ',
      },
      {
        type: 'string',
        value: formatCurrency(optimization?.performance?.total?.budget?.spent),
      },
      {
        type: 'string',
        value: formatCurrency(optimization?.performance?.total?.budget?.proposed),
      },
      {
        type: 'string',
        value: formatCurrency(
          Math.abs(
            optimization?.performance?.total?.budget?.spent - optimization?.performance?.total?.budget?.proposed,
          ),
        ),
      },
      {
        type: 'string',
        value: `${Intl.NumberFormat(numberFormat).format(totalBudgetChangePercent)}%`,
      },
      ...funnelStepsTotal.map((item) => ({
        type: 'string',
        value: formatCurrency(item?.costPer?.predicted),
      })),
      ...conversionValueTotalFunnelSteps.map((item) => ({
        type: 'string',
        value: `${Intl.NumberFormat(numberFormat).format(item?.roas?.predicted)}%`,
      })),
      ...funnelStepsTotal.map((item) => ({
        type: Number,
        value: Intl.NumberFormat(numberFormat).format(item?.metric?.predicted),
      })),
      ...totalProposedBudget.map((item) => ({
        type: 'string',
        value: formatCurrency(item),
      })),
    ],
    [
      {
        type: 'string',
        value: `Relevant links:`,
      },
    ],
    [
      {
        type: 'string',
        value: `${getShareUrl(portfolio.portfolioId, 'portfolio')}`,
      },
    ],
    [
      {
        type: 'string',
        value: 'https://www.nexoya.com/help/?embedded=true',
      },
    ],
  ];
  return {
    reportHeader,
    reportContent,
    reportFooter,
  };
}
