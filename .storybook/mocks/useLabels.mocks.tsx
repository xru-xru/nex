// Import your component and other necessary items
import React from 'react';

import { LabelsProvider } from '../../src/context/LabelsProvider';

// Manually create a mock for usePortfolio
const mockUseLabels = () => ({
  ...useLabelsMockData,
});

// Define a custom provider to inject the mock
export const MockLabelsProvider = ({ children }) => {
  // Override the usePortfolio hook value with the mock implementation
  // @ts-ignore
  LabelsProvider.useLabels = mockUseLabels;
  return <LabelsProvider>{children}</LabelsProvider>;
};

const useLabelsMockData = {
  labels: [
    {
      funnelStepWeights: [
        {
          value: 40,
          funnelStepId: 6340,
        },
        {
          value: 0,
          funnelStepId: 6339,
        },
        {
          value: 55,
          funnelStepId: 6342,
        },
        {
          value: 5,
          funnelStepId: 6341,
        },
        {
          value: 0,
          funnelStepId: 6343,
        },
      ],
      labelId: 672,
      name: 'Display',
    },
    {
      funnelStepWeights: [
        {
          value: 40,
          funnelStepId: 6340,
        },
        {
          value: 0,
          funnelStepId: 6339,
        },
        {
          value: 55,
          funnelStepId: 6342,
        },
        {
          value: 5,
          funnelStepId: 6341,
        },
        {
          value: 0,
          funnelStepId: 6343,
        },
      ],
      labelId: 673,
      name: 'FB Conversion',
    },
    {
      funnelStepWeights: [
        {
          value: 30,
          funnelStepId: 6340,
        },
        {
          value: 60,
          funnelStepId: 6339,
        },
        {
          value: 10,
          funnelStepId: 6342,
        },
        {
          value: 0,
          funnelStepId: 6341,
        },
        {
          value: 0,
          funnelStepId: 6343,
        },
      ],
      labelId: 674,
      name: 'FB Video',
    },
    {
      funnelStepWeights: [
        {
          value: 10,
          funnelStepId: 6340,
        },
        {
          value: 0,
          funnelStepId: 6339,
        },
        {
          value: 30,
          funnelStepId: 6342,
        },
        {
          value: 50,
          funnelStepId: 6341,
        },
        {
          value: 10,
          funnelStepId: 6343,
        },
      ],
      labelId: 675,
      name: 'GDN Remarketing',
    },
    {
      funnelStepWeights: [
        {
          value: 0,
          funnelStepId: 6340,
        },
        {
          value: 0,
          funnelStepId: 6339,
        },
        {
          value: 0,
          funnelStepId: 6342,
        },
        {
          value: 10,
          funnelStepId: 6341,
        },
        {
          value: 90,
          funnelStepId: 6343,
        },
      ],
      labelId: 676,
      name: 'PLA',
    },
    {
      funnelStepWeights: [
        {
          value: 0,
          funnelStepId: 6340,
        },
        {
          value: 0,
          funnelStepId: 6339,
        },
        {
          value: 0,
          funnelStepId: 6342,
        },
        {
          value: 10,
          funnelStepId: 6341,
        },
        {
          value: 90,
          funnelStepId: 6343,
        },
      ],
      labelId: 677,
      name: 'SEA',
    },
    {
      funnelStepWeights: [
        {
          value: 0,
          funnelStepId: 6340,
        },
        {
          value: 0,
          funnelStepId: 6339,
        },
        {
          value: 0,
          funnelStepId: 6342,
        },
        {
          value: 10,
          funnelStepId: 6341,
        },
        {
          value: 90,
          funnelStepId: 6343,
        },
      ],
      labelId: 678,
      name: 'SEA Non-Brand only',
    },
    {
      funnelStepWeights: [
        {
          value: 20,
          funnelStepId: 6340,
        },
        {
          value: 60,
          funnelStepId: 6339,
        },
        {
          value: 20,
          funnelStepId: 6342,
        },
        {
          value: 0,
          funnelStepId: 6341,
        },
        {
          value: 0,
          funnelStepId: 6343,
        },
      ],
      labelId: 679,
      name: 'YouTube',
    },
  ],
  labelsMap: {},
};
