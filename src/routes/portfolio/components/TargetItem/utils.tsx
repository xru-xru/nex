import dayjs from 'dayjs';

import {
  NexoyaDailyMetric,
  NexoyaPortfolioTargetItem,
  NexoyaTargetDailyItem,
  NexoyaTargetItemStatus,
} from '../../../../types';

import { GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import { TagStyled } from '../../styles/OptimizationProposal';

import { nexyColors } from '../../../../theme';

export const areTargetItemValuesEqual = (
  propertyKey: keyof NexoyaPortfolioTargetItem,
  initialTargetItem: NexoyaPortfolioTargetItem,
  editedTargetItem: NexoyaPortfolioTargetItem,
) => initialTargetItem?.[propertyKey] === editedTargetItem?.[propertyKey];

export const renderTargetItemStatus = (status: NexoyaTargetItemStatus) => {
  switch (status) {
    case NexoyaTargetItemStatus.Active:
      return <TagStyled bgColor="#88E7B7">Active</TagStyled>;
    case NexoyaTargetItemStatus.ActiveNoOptimization:
      return <TagStyled bgColor="#88E7B7">Active</TagStyled>;
    case NexoyaTargetItemStatus.Past:
      return <TagStyled bgColor={nexyColors.frenchGray}>Past</TagStyled>;
    case NexoyaTargetItemStatus.Planned:
      return <TagStyled bgColor="#94DCF4">Future</TagStyled>;
    default:
      return null;
  }
};

export const findTargetItemForDay = (day: string, dailyTargets: NexoyaTargetDailyItem[]) => {
  const dateStr = dayjs(day).format(GLOBAL_DATE_FORMAT);
  return dailyTargets?.find((item) => item.date === dateStr);
};

export const calculateCostRatioPerDay = (dailyMetric: NexoyaDailyMetric): { costRatio: number; roas: number } => {
  if (!dailyMetric?.providers?.length) {
    return { costRatio: 0, roas: 0 };
  }
  const adSpend = dailyMetric.providers.reduce((acc, providerMetric) => acc + providerMetric?.value?.adSpend, 0);
  const achieved = dailyMetric.providers.reduce((acc, providerMetric) => acc + providerMetric?.value?.value, 0);
  const costRatio = achieved ? adSpend / achieved : 0;
  const roas = (achieved / adSpend) * 100;
  return { costRatio, roas };
};

const computeTargetDailyItems = (targetItem: NexoyaPortfolioTargetItem): NexoyaTargetDailyItem[] => {
  const start = dayjs(targetItem.start);
  const end = dayjs(targetItem.end);
  const diffInDays = end.diff(start, 'day', true) + 1; // +1 to include the end date
  const maxBudget = targetItem.maxBudget / diffInDays;

  return Array.from({ length: diffInDays }).map((_, index) => ({
    date: start.add(index, 'day').format(GLOBAL_DATE_FORMAT),
    value: targetItem.value,
    maxBudget: maxBudget,
  }));
};

export function computeUnionOfTargetItems(
  targetItems: NexoyaPortfolioTargetItem[],
): NexoyaPortfolioTargetItem & { targetDailyItems: NexoyaTargetDailyItem[] } {
  if (!targetItems?.length) {
    return null;
  }

  const unionTargetItem: NexoyaPortfolioTargetItem & { targetDailyItems: NexoyaTargetDailyItem[] } = {
    status: undefined,
    name: targetItems.map((item) => item.name).join(', '),
    value: targetItems.reduce((acc, item) => acc + item.value, 0),
    targetItemId: Math.max(...targetItems.map((item) => item.targetItemId)),
    maxBudget: Math.max(...targetItems.map((item) => item.maxBudget)),
    targetDailyItems: [],
    portfolioId: -1, // fallback value
    end: '',
    start: '',
  };

  const { earliestStartDate, latestEndDate } = targetItems.reduce(
    (acc, item) => {
      const { earliestStartDate, latestEndDate } = acc;
      const currentStartDate = dayjs(item.start);
      const currentEndDate = dayjs(item.end);
      return {
        earliestStartDate: currentStartDate.isBefore(earliestStartDate) ? currentStartDate : earliestStartDate,
        latestEndDate: currentEndDate.isAfter(latestEndDate) ? currentEndDate : latestEndDate,
      };
    },
    { earliestStartDate: dayjs(targetItems[0].start), latestEndDate: dayjs(targetItems[0].end) },
  );

  unionTargetItem.start = earliestStartDate.format(GLOBAL_DATE_FORMAT);
  unionTargetItem.end = latestEndDate.format(GLOBAL_DATE_FORMAT);

  const dailyItemMap = new Map();

  targetItems.forEach((item) => {
    computeTargetDailyItems(item).forEach((dailyItem) => {
      const existingValue = dailyItemMap.get(dailyItem.date) ? dailyItemMap.get(dailyItem.date).value : 0;
      const existingDailyMaxBudget = dailyItemMap.get(dailyItem.date) ? dailyItemMap.get(dailyItem.date).maxBudget : 0;

      dailyItemMap.set(dailyItem.date, {
        value: existingValue + dailyItem.value,
        maxBudget: Math.max(existingDailyMaxBudget, dailyItem.maxBudget),
      });
    });
  });

  unionTargetItem.targetDailyItems = Array.from(dailyItemMap, ([date, valueObj]) => ({
    date,
    value: valueObj.value,
    maxBudget: valueObj.maxBudget,
  })) as NexoyaTargetDailyItem[];

  return unionTargetItem;
}

export const filterDailyMetricsBySelectedPeriod = (
  dailyMetric: NexoyaDailyMetric,
  {
    start,
    end,
  }: {
    start: Date;
    end: Date;
  },
): boolean => dayjs(dailyMetric.day).isBetween(dayjs(start), dayjs(end), 'day', '[]');

export const isTargetItemActive = (
  targetItem: NexoyaPortfolioTargetItem | Partial<NexoyaPortfolioTargetItem>,
): boolean => {
  const currentDate = new Date();
  const startDate = new Date(targetItem.start);
  const endDate = new Date(targetItem.end);

  return currentDate >= startDate && currentDate <= endDate;
};
