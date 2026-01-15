import { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import { DateSelector, SingleDateSelector } from '../components/DateSelector';
import { mock_decorators } from '../../.storybook/preview.jsx';

export default {
  title: 'Portfolio/Date selector',
  decorators: mock_decorators(),
} as Meta;

const DateSelectorStory: StoryFn = () => {
  const [dates, setDates] = useState<{ from: Date; to: Date }>({
    from: new Date('2022-01-01'),
    to: new Date('2022-12-31'),
  });

  return (
    <DateSelector
      style={{ width: 200 }}
      dateFrom={dates.from}
      dateTo={dates.to}
      useNexoyaDateRanges={false}
      onDateChange={({ from, to }) => setDates({ from, to })}
    />
  );
};

const SingleDateSelectorStory: StoryFn = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2022-01-01'));

  return (
    <SingleDateSelector
      style={{ width: 200 }}
      selectedDate={selectedDate}
      onDateChange={({ selectedDate }) => setSelectedDate(selectedDate)}
    />
  );
};

export const MultipleDateSelector = DateSelectorStory.bind({});
export const SingleSelector = SingleDateSelectorStory.bind({});

MultipleDateSelector.args = {};
SingleSelector.args = {};
