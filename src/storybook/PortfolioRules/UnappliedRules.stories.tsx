import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { UnappliedRules } from '../../routes/portfolio/Content/UnappliedRules';
import { mock_decorators } from '../../../.storybook/preview.jsx';

export default {
  title: 'Portfolio Rules/Unapplied rules',
  component: UnappliedRules,
  decorators: mock_decorators(),
  parameters: {
    docs: {
      description: {
        component:
          'Display rules that have not been applied to any content in the portfolio. This component helps users identify and manage unused rules.',
      },
    },
  },
} as Meta;

const Template: StoryFn = () => <UnappliedRules />;

export const Default = Template.bind({});
