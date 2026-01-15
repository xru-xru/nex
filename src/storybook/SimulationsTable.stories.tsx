import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import dayjs from 'dayjs';

import { NexoyaSimulation, NexoyaSimulationState } from '../types';

import { SimulationTable } from '../routes/portfolio/components/Simulations/SimulationTable';
import { mock_decorators } from '../../.storybook/preview.jsx';

export default {
  title: 'Simulation/Simulations Table',
  component: SimulationTable,
  decorators: mock_decorators(),
} as Meta<{
  simulations: NexoyaSimulation[];
  portfolioId: number;
}>;

const simulations: Partial<NexoyaSimulation>[] = [
  {
    simulationId: 1,
    name: 'Simulation 1',
    state: NexoyaSimulationState.Completed,
    budget: { min: 1000, max: 5000, stepSize: 100, stepCount: 40 },
    start: dayjs().subtract(7, 'day').toDate(),
    end: dayjs().subtract(1, 'day').toDate(),
    createdAt: dayjs().subtract(10, 'day').toDate(),
  },
  {
    simulationId: 1,
    name: 'Simulation 2',
    state: NexoyaSimulationState.Applied,
    budget: { min: 1000, max: 5000, stepSize: 100, stepCount: 40 },
    start: dayjs().subtract(7, 'day').toDate(),
    end: dayjs().subtract(1, 'day').toDate(),
    createdAt: dayjs().subtract(10, 'day').toDate(),
  },
  {
    simulationId: 1,
    name: 'Simulation 3',
    state: NexoyaSimulationState.Running,
    budget: { min: 1000, max: 5000, stepSize: 100, stepCount: 40 },
    start: dayjs().subtract(7, 'day').toDate(),
    end: dayjs().subtract(1, 'day').toDate(),
    createdAt: dayjs().subtract(10, 'day').toDate(),
  },
  {
    simulationId: 1,
    name: 'Simulation 4',
    state: NexoyaSimulationState.Pending,
    budget: { min: 1000, max: 5000, stepSize: 100, stepCount: 40 },
    start: dayjs().subtract(7, 'day').toDate(),
    end: dayjs().subtract(1, 'day').toDate(),
    createdAt: dayjs().subtract(10, 'day').toDate(),
  },
];

const Template: StoryFn<{
  simulations: NexoyaSimulation[];
  portfolioId: number;
}> = (args) => <SimulationTable {...args} />;

export const Default = Template.bind({});
Default.args = {
  simulations,
  portfolioId: 1,
};
