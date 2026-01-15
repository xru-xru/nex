import React from 'react';

import dayjs from 'dayjs';
import { round } from 'lodash';

import {
  NexoyaBudgetDailyItem,
  NexoyaBudgetItem,
  NexoyaBudgetItemStatus,
  NexoyaBudgetReallocationDate,
  NexoyaDailyMetric,
} from '../../../../types';

import { GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import { TagStyled } from '../../styles/OptimizationProposal';

import { nexyColors } from '../../../../theme';

export const findBudgetItemAmountForDay = (day: string, dailyBudgets: NexoyaBudgetDailyItem[]) => {
  const dateStr = dayjs(day).format(GLOBAL_DATE_FORMAT);
  return dailyBudgets?.find((item) => item.date === dateStr)?.budgetAmount || 0;
};

export const findReallocatedBudgetForDay = (day: string, reallocatedBudgetDates: NexoyaBudgetReallocationDate[]) => {
  const dateStr = dayjs(day).format(GLOBAL_DATE_FORMAT);
  return reallocatedBudgetDates?.find((item) => item.date === dateStr)?.budgetAmount || 0;
};

export const calculateBudgetPlannedBetweenDates = (
  budgetDailyItems: NexoyaBudgetDailyItem[],
  start: string | Date,
  end: string | Date,
) => {
  // Normalize dates to UTC and format as YYYY-MM-DD to avoid timezone issues
  const startDateStr = dayjs(start).utc().format(GLOBAL_DATE_FORMAT);
  const endDateStr = dayjs(end).utc().format(GLOBAL_DATE_FORMAT);

  return round(
    budgetDailyItems
      ?.filter((budgetDailyItem) => {
        // Normalize budgetDailyItem.date to UTC and format as YYYY-MM-DD
        const itemDateStr = dayjs(budgetDailyItem.date).utc().format(GLOBAL_DATE_FORMAT);
        // Compare date strings directly (inclusive range)
        return itemDateStr >= startDateStr && itemDateStr <= endDateStr;
      })
      ?.reduce((acc, item) => acc + Math.abs(item.budgetAmount), 0),
  );
};

export const calculateSpentBudgetForDailyMetric = (
  dailyMetrics: NexoyaDailyMetric[],
  start: string | Date,
  end: string | Date,
) => {
  return round(
    dailyMetrics
      .filter((dailyMetric) => dayjs(dailyMetric.day).isBetween(dayjs(start), dayjs(end), 'day', '[]'))
      .map((dailyMetric) => ({ spend: dailyMetric.providers.reduce((acc, curr) => acc + curr?.value?.adSpend, 0) }))
      .reduce((acc, curr) => acc + curr.spend, 0),
  );
};

export const renderBudgetItemStatus = (budgetItem: Partial<NexoyaBudgetItem>) => {
  switch (budgetItem?.status) {
    case NexoyaBudgetItemStatus.Active:
      return <TagStyled bgColor="#88E7B7">Active</TagStyled>;
    case NexoyaBudgetItemStatus.ActiveNoOptimization:
      return <TagStyled bgColor="#88E7B7">Active</TagStyled>;
    case NexoyaBudgetItemStatus.Past:
      return <TagStyled bgColor={nexyColors.frenchGray}>Past</TagStyled>;
    case NexoyaBudgetItemStatus.Planned:
      return <TagStyled bgColor="#94DCF4">Future</TagStyled>;
    default:
      return null;
  }
};

export const areBudgetItemValuesEqual = (
  propertyKey: keyof NexoyaBudgetItem,
  initialBudget: NexoyaBudgetItem,
  editedBudgetItem: NexoyaBudgetItem,
) => initialBudget?.[propertyKey] === editedBudgetItem?.[propertyKey];

export function computeUnionOfBudgetItems(budgetItems: NexoyaBudgetItem[]): NexoyaBudgetItem {
  if (!budgetItems?.length) {
    return null;
  }

  // Define initial values
  const unionBudgetItem: NexoyaBudgetItem = {
    status: null,
    budgetAmount: 0,
    budgetDailyItems: [],
    budgetItemId: -1,
    endDate: '',
    name: '',
    pacing: budgetItems?.[0]?.pacing, // assuming all items have the same pacing type
    startDate: '',
  };

  let earliestStartDate = new Date(budgetItems[0].startDate);
  let latestEndDate = new Date(budgetItems[0].endDate);

  // Create a map to hold unique dates and their budgetAmount totals
  const dailyItemMap = new Map();

  for (let i = 0; i < budgetItems.length; i++) {
    const item = budgetItems[i];

    // Union operation for each attribute
    unionBudgetItem.budgetAmount += item.budgetAmount;
    unionBudgetItem.budgetItemId = Math.max(unionBudgetItem.budgetItemId, item.budgetItemId);
    unionBudgetItem.name += (i !== 0 ? ', ' : '') + item.name;

    // For each budgetDailyItem, if the date already exists in the map, add the budgetAmount to the existing value
    // If it doesn't exist, add a new entry to the map
    item?.budgetDailyItems.forEach((dailyItem) => {
      if (dailyItemMap.has(dailyItem.date)) {
        dailyItemMap.set(dailyItem.date, dailyItemMap.get(dailyItem.date) + dailyItem.budgetAmount);
      } else {
        dailyItemMap.set(dailyItem.date, dailyItem.budgetAmount);
      }
    });

    // For start and end date we have to compare and take the earliest and latest respectively
    const itemStartDate = new Date(item.startDate);
    const itemEndDate = new Date(item.endDate);

    if (itemStartDate < earliestStartDate) {
      earliestStartDate = itemStartDate;
    }

    if (itemEndDate > latestEndDate) {
      latestEndDate = itemEndDate;
    }
  }

  // Convert Date objects back to strings
  unionBudgetItem.startDate = earliestStartDate.toISOString();
  unionBudgetItem.endDate = latestEndDate.toISOString();

  // Convert map entries into budgetDailyItems
  unionBudgetItem.budgetDailyItems = Array.from(dailyItemMap.entries()).map(([date, budgetAmount]) => ({
    date,
    budgetAmount,
  }));

  return unionBudgetItem;
}
