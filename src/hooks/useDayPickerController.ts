import React from 'react';
import { DateUtils } from 'react-day-picker';

import dayjs from 'dayjs';

import { DatePickerDateRange } from 'types';

type Options = {
  from?: Date;
  to?: Date;
  singleSelectedDate?: Date;
};

function useDayPickerController({ from: fromProp, to: toProp, singleSelectedDate }: Options) {
  const [fromValue, setFromValue] = React.useState<Date>(fromProp);
  const [toValue, setToValue] = React.useState<Date>(toProp);
  const [singleDateValue, setSingleDateValue] = React.useState<Date>(singleSelectedDate);

  function handleDayChange(day: Date, modifiers: Record<string, any>) {
    if (modifiers.disabled) return;

    // Check if the same day is pressed 3 times so that we avoid creating a range with the same day
    if (
      dayjs(fromValue).isSame(dayjs(toValue), 'day') &&
      dayjs(day).isSame(dayjs(fromValue), 'day') &&
      dayjs(day).isSame(dayjs(toValue), 'day')
    ) {
      setFromValue(fromValue);
      setToValue(toValue);
      return;
    }

    const { from, to } = DateUtils.addDayToRange(day, {
      from: fromValue,
      to: toValue,
    });

    setFromValue(from);
    setToValue(to);
  }

  function handleSingleDayChange(day: Date, modifiers: Record<string, any>) {
    if (modifiers?.disabled) return;
    setSingleDateValue(day);
  }

  function handleRangeChange(nextRange: DatePickerDateRange) {
    setFromValue(nextRange.from);
    setToValue(nextRange.to);
  }

  function reset() {
    setFromValue(fromProp);
    setToValue(toProp);
  }

  const selected = {
    from: fromValue,
    to: toValue,
  };
  const startEnd = {
    start: fromValue,
    end: toValue,
  };

  return {
    from: {
      value: fromValue,
    },
    to: {
      value: toValue,
    },
    singleDateValue,
    onSingleDateChange: handleSingleDayChange,
    onChange: handleDayChange,
    onRangeChange: handleRangeChange,
    modifiers: {
      selected,
      startEnd,
      toMonth: toProp,
      firstDayOfWeek: 1,
      initialMonth: fromProp,
    },
    reset,
  };
}

export default useDayPickerController;
