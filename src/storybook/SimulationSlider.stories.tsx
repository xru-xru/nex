import { Meta, StoryFn } from '@storybook/react';

import 'rc-slider/assets/index.css';

import {
  ScenarioSliderBudget,
  SimulationSlider,
  SimulationSliderProps,
} from '../routes/portfolio/components/Simulations/SimulationSlider';

export default {
  title: 'Simulation/Slider',
  component: SimulationSlider,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

const scenarioBudgets: ScenarioSliderBudget[] = [
  { scenarioId: 1, budget: 5000, isBaseScenario: false },
  { scenarioId: 2, budget: 10000, isBaseScenario: true },
  { scenarioId: 3, budget: 15000, isBaseScenario: false },
];

const Template: StoryFn<SimulationSliderProps> = (args) => (
  <div style={{ width: '100%' }}>
    <SimulationSlider {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  scenarioBudgets,
};
