// Helper to get all dates between two given dates
import { NexoyaDailyPredictionTotal, NexoyaFunnelStepPredictionScore } from '../../../types';
import dayjs from 'dayjs';

export const getDateRange = (startDate: Date, endDate: Date): string[] => {
  // Normalize to pure UTC calendar dates (no local TZ drift)
  const start = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
  const end = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

  if (end < start) return [];

  const result: string[] = [];
  for (let t = start; t <= end; t += 24 * 60 * 60 * 1000) {
    result.push(new Date(t).toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return result;
};

// Helper to fill missing daily predictions in a funnel step
export const fillDailyPredictions = (funnelStep: NexoyaFunnelStepPredictionScore, dateRange: string[]) =>
  dateRange
    .map((date) => {
      const existingPrediction = funnelStep.dailyPredictions.find((p) => p.day === date);
      return (
        existingPrediction || {
          achieved: 0,
          day: date,
          predicted: 0,
          score: 0,
        }
      );
    })
    .filter((prediction) => dayjs(prediction.day).isBefore(dayjs(), 'day'));

// Helper to fill missing totals for dailyPredictionTotal
export const fillDailyPredictionTotal = (
  dailyPredictionTotal: NexoyaDailyPredictionTotal[],
  dateRange: Array<string>,
) =>
  dateRange.map((date) => {
    const existingPrediction = dailyPredictionTotal.find((p) => p.day === date);
    return (
      existingPrediction || {
        day: date,
        achieved: 0,
        predicted: 0,
        score: 0,
      }
    );
  });
