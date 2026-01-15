import { NexoyaDailyPrediction, NexoyaLifetimeBudgetSegment } from '../../../types';

export const extractSumOfDailyPredictionValues = (
  dailyPredictionValues: NexoyaDailyPrediction[]
): { predicted: number; achieved: number } => {
  const predicted = dailyPredictionValues?.reduce((acc, curr) => acc + curr.predicted, 0);
  const achieved = dailyPredictionValues?.reduce((acc, curr) => acc + curr.achieved, 0);

  return { predicted, achieved };
};

export const sumLifetimeBudgetSegments = (segments: NexoyaLifetimeBudgetSegment[] | undefined) => {
  return segments?.reduce(
    (acc, curr) => {
      acc.endDate = acc.endDate
        ? new Date(curr.endDate) > new Date(acc.endDate)
          ? curr.endDate
          : acc.endDate
        : curr.endDate;
      acc.startDate = acc.startDate
        ? new Date(curr.startDate) < new Date(acc.startDate)
          ? curr.startDate
          : acc.startDate
        : curr.startDate;
      acc.spendUpdatedAt = acc.spendUpdatedAt
        ? new Date(curr.spendUpdatedAt || 0) < new Date(acc.spendUpdatedAt)
          ? curr.spendUpdatedAt
          : acc.spendUpdatedAt
        : curr.spendUpdatedAt;
      acc.initialBudget += curr.initialBudget;
      acc.proposedBudget += curr.proposedBudget;
      acc.spend = (acc.spend || 0) + (curr.spend || 0);
      return acc;
    },
    {
      endDate: '',
      initialBudget: 0,
      proposedBudget: 0,
      spend: null,
      spendUpdatedAt: null,
      startDate: '',
    } as NexoyaLifetimeBudgetSegment
  );
};
