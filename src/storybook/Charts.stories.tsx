import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { NexoyaBudgetItem, NexoyaBudgetItemStatus, NexoyaPacingType, NexoyaPredictionTotal } from '../types';

import PortfolioPerformanceChart from '../components/Charts/PortfolioPerformanceChart';
import BudgetOverview from '../components/Charts/budget/BudgetOverview';
import PacingView from '../components/Charts/budget/PacingView';
import { computeUnionOfBudgetItems } from '../routes/portfolio/components/BudgetItem/utils';
import { PredictedVsAchievedChart } from '../routes/portfolio/components/DetailedReport/PredictedVsAchievedChart';
import { PredictionThresholdsChart } from '../routes/portfolio/components/DetailedReport/Prediction/PredictionThresholdsChart';
import { PredictionTimelineChart } from '../routes/portfolio/components/DetailedReport/PredictionTimelineChart';
import { mock_decorators } from '../../.storybook/preview.jsx';

export default {
  title: 'Portfolio/Charts',
  decorators: mock_decorators(),
} as Meta;

const performanceChartData = [
  {
    timestamp: new Date('2025-01-01'),
    value: 10,
  },
  {
    timestamp: new Date('2025-01-02'),
    value: 15,
  },
  {
    timestamp: new Date('2025-01-03'),
    value: 4,
  },
  {
    timestamp: new Date('2025-01-04'),
    value: 7,
  },
  {
    timestamp: new Date('2025-01-05'),
    value: 25,
  },
  {
    timestamp: new Date('2025-01-06'),
    value: 31,
  },
  {
    timestamp: new Date('2025-01-07'),
    value: 60,
  },
  {
    timestamp: new Date('2025-01-08'),
    value: 35,
  },
  {
    timestamp: new Date('2025-01-09'),
    value: 40,
    baselinePerformanceRelative: 40,
    expectedPerformanceRelative: 40,
  },

  {
    timestamp: new Date('2025-01-10'),
    baselinePerformanceRelative: 45,
    expectedPerformanceRelative: 85,
  },
  {
    timestamp: new Date('2025-01-11'),
    baselinePerformanceRelative: 50,
    expectedPerformanceRelative: 95,
  },
  {
    timestamp: new Date('2025-01-12'),
    baselinePerformanceRelative: 50,
    expectedPerformanceRelative: 100,
  },
];
const dailySpendings = [
  {
    day: '2024-04-01',
    labels: [],
    providers: [
      {
        adSpend: 120.5,
        costRatio: 1.15,
        cumulative: 520.3,
        providerId: 101,
        relative: 0.95,
      },
    ],
  },
  {
    day: '2024-04-02',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-02',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-03',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-04',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-05',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-06',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-07',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-08',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-09',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-10',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-11',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-12',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-13',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-14',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-15',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-16',
    labels: [],
    providers: [
      {
        adSpend: 130.5,
        costRatio: 1.25,
        cumulative: 530.4,
        providerId: 102,
        relative: 0.85,
      },
    ],
  },
  {
    day: '2024-04-17',
    labels: [],
    providers: [
      {
        adSpend: 140.5,
        costRatio: 1.35,
        cumulative: 540.5,
        providerId: 110,
        relative: 0.75,
      },
    ],
  },
];
const budgetItems: NexoyaBudgetItem[] = [
  {
    budgetItemId: 1,
    name: 'Budget item 1',
    startDate: '2024-04-01',
    endDate: '2024-04-10',
    budgetAmount: 1000,
    pacing: NexoyaPacingType.Fixed,
    status: NexoyaBudgetItemStatus.Active,
    budgetDailyItems: [
      {
        date: '2024-04-01',
        budgetAmount: 100,
      },
      {
        date: '2024-04-02',
        budgetAmount: 100,
      },
      {
        date: '2024-04-03',
        budgetAmount: 100,
      },
      {
        date: '2024-04-04',
        budgetAmount: 100,
      },
      {
        date: '2024-04-05',
        budgetAmount: 100,
      },
      {
        date: '2024-04-06',
        budgetAmount: 100,
      },
      {
        date: '2024-04-07',
        budgetAmount: 100,
      },
      {
        date: '2024-04-08',
        budgetAmount: 100,
      },
      {
        date: '2024-04-09',
        budgetAmount: 100,
      },
      {
        date: '2024-04-10',
        budgetAmount: 100,
      },
    ],
  },
  {
    budgetItemId: 2,
    name: 'Budget item 2',
    startDate: '2024-04-10',
    endDate: '2024-04-17',
    budgetAmount: 2000,
    pacing: NexoyaPacingType.Fixed,
    status: NexoyaBudgetItemStatus.Planned,
    budgetDailyItems: [
      {
        date: '2024-04-10',
        budgetAmount: 200,
      },
      {
        date: '2024-04-11',
        budgetAmount: 200,
      },
      {
        date: '2024-04-12',
        budgetAmount: 200,
      },
      {
        date: '2024-04-13',
        budgetAmount: 200,
      },
      {
        date: '2024-04-14',
        budgetAmount: 200,
      },
      {
        date: '2024-04-15',
        budgetAmount: 200,
      },
      {
        date: '2024-04-16',
        budgetAmount: 200,
      },
      {
        date: '2024-04-17',
        budgetAmount: 200,
      },
    ],
  },
];

const dailyPredictions = [
  {
    day: new Date('2024-04-01'),
    predicted: 150 + Math.floor(Math.random() * 20 - 10),
    achieved: 120 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-02'),
    predicted: 160 + Math.floor(Math.random() * 20 - 10),
    achieved: 130 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-03'),
    predicted: 170 + Math.floor(Math.random() * 20 - 10),
    achieved: 140 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-04'),
    predicted: 180 + Math.floor(Math.random() * 20 - 10),
    achieved: 150 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-05'),
    predicted: 190 + Math.floor(Math.random() * 20 - 10),
    achieved: 160 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-06'),
    predicted: 200 + Math.floor(Math.random() * 20 - 10),
    achieved: 170 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-07'),
    predicted: 210 + Math.floor(Math.random() * 20 - 10),
    achieved: 180 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-08'),
    predicted: 220 + Math.floor(Math.random() * 20 - 10),
    achieved: 190 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-09'),
    predicted: 230 + Math.floor(Math.random() * 20 - 10),
    achieved: 200 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-10'),
    predicted: 240 + Math.floor(Math.random() * 20 - 10),
    achieved: 210 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-11'),
    predicted: 250 + Math.floor(Math.random() * 20 - 10),
    achieved: 220 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-12'),
    predicted: 260 + Math.floor(Math.random() * 20 - 10),
    achieved: 230 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-13'),
    predicted: 270 + Math.floor(Math.random() * 20 - 10),
    achieved: 240 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-14'),
    predicted: 280 + Math.floor(Math.random() * 20 - 10),
    achieved: 250 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-15'),
    predicted: 290 + Math.floor(Math.random() * 20 - 10),
    achieved: 260 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-16'),
    predicted: 300 + Math.floor(Math.random() * 20 - 10),
    achieved: 270 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
  {
    day: new Date('2024-04-17'),
    predicted: 310 + Math.floor(Math.random() * 20 - 10),
    achieved: 280 + Math.floor(Math.random() * 20 - 10),
    score: 90 + Math.floor(Math.random() * 20 - 10),
  },
];

const generateRandomNexoyaPredictionTotal = (): NexoyaPredictionTotal => {
  const accuracyBuckets = Array.from({ length: 100 }, () => ({
    contentCount: Math.floor(Math.random() * 100),
    threshold: Math.floor(Math.random() * 100),
  }));

  const dailyPredictionTotal = Array.from({ length: 100 }, () => ({
    day: new Date(+new Date() - Math.floor(Math.random() * 10000000000)).toISOString(),
    score: Math.random() * 100,
  }));

  return {
    accuracyBuckets,
    dailyPredictionTotal,
    score: Math.random() * 100,
  };
};

const portfolioTitle = 'Portfolio example';

const PerformanceChartStory: StoryFn = () => {
  return (
    <PortfolioPerformanceChart
      data={performanceChartData}
      validationData={[]}
      validationTooltip={[]}
      portfolioId={1}
      portfolioTitle={portfolioTitle}
      optimizations={[]}
    />
  );
};

const BudgetOverviewChartStory: StoryFn = () => (
  <BudgetOverview
    dailySpendings={dailySpendings}
    budgetDailyItems={computeUnionOfBudgetItems(budgetItems)?.budgetDailyItems}
    portfolioName={portfolioTitle}
  />
);

const BudgetPacingChartStory: StoryFn = () => (
  <PacingView
    dailySpendings={dailySpendings}
    budgetDailyItems={computeUnionOfBudgetItems(budgetItems)?.budgetDailyItems}
    portfolioName={portfolioTitle}
    budgetReallocation={{ pastBudget: 0, pastSpend: 0, dates: [] }}
  />
);

const AchievedVsPredictedChartStory: StoryFn = () => <PredictedVsAchievedChart data={dailyPredictions} />;
const PredictionTimelineChartStory: StoryFn = () => <PredictionTimelineChart data={dailyPredictions} />;
const PredictionThresholdChartStory: StoryFn = () => (
  <PredictionThresholdsChart
    selectedFunnelStepId={-1}
    totalPredictionData={generateRandomNexoyaPredictionTotal()}
    predictionFunnelSteps={[]}
    dateFrom={new Date()}
    dateTo={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}
  />
);

export const PerformanceChart = PerformanceChartStory.bind({});
export const BudgetOverviewChart = BudgetOverviewChartStory.bind({});
export const BudgetPacingChart = BudgetPacingChartStory.bind({});
export const AchievedVsPredictedChart = AchievedVsPredictedChartStory.bind({});
export const PredictionTimeline = PredictionTimelineChartStory.bind({});
export const PredictionThreshold = PredictionThresholdChartStory.bind({});

PerformanceChart.args = {};
BudgetOverviewChart.args = {};
BudgetPacingChart.args = {};
AchievedVsPredictedChart.args = {};
PredictionTimeline.args = {};
PredictionThreshold.args = {};
