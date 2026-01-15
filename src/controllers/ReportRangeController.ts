import React from 'react';

import { NexoyaReportDateRange } from '../types/types';
import { RangeTypes } from '../types/types.custom';

import { distanceRange, djsAnchors } from '../utils/dates';

import { IDateRangeShort } from '../components/DateSelector';

type Options = {
  initialRange?: NexoyaReportDateRange;
};
const defaultCustomRange = distanceRange({
  distance: 6,
  anchor: djsAnchors.yesterday,
});
const initDateRange = {
  rangeType: 'custom',
  customRange: { dateFrom: new Date(), dateTo: new Date() },
};

function useReportRangeController({ initialRange = initDateRange }: Options = {}) {
  const initialState = React.useMemo(() => initialRange, [initialRange]);
  const [dateRange, setDateRange] = React.useState<NexoyaReportDateRange>(initialRange);

  // When we change "last week", "last month",
  function handleRangeTypeChange(rangeType: RangeTypes = 'custom') {
    // Comment: in case it's predefined type (last week...) we just return "null" which
    // is what backend expects. Otherwise we set the {dateFrom, dateTo} to default values
    setDateRange({
      rangeType,
      customRange: rangeType === 'custom' ? { ...defaultCustomRange } : null,
    });
  }

  // When we change custom "date", either dateFrom or dateTo
  function handleDateChange(customRange: IDateRangeShort) {
    setDateRange({
      rangeType: 'custom',
      customRange: { dateFrom: customRange.from, dateTo: customRange.to },
    });
  }

  function reset() {
    setDateRange({ ...initialState });
  }

  return {
    dateRange,
    handleRangeTypeChange,
    handleDateChange,
    reset,
  };
}

export default useReportRangeController;
