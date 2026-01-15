import { format } from '../../utils/dates';

import { IDateRangeShort } from './DateSelector';

const selectorToNexoyaDateRange = ({ from, to }: IDateRangeShort) => {
  const nexoyaDateRange = {
    from: new Date(format(from, 'utcStartMidnight')),
    to: new Date(format(to, 'utcEndMidnight')),
  };
  return nexoyaDateRange;
};
const nexoyaToSelectorDateRange = ({ from, to }: IDateRangeShort) => {
  const selectorDateRange = {
    from: from ? new Date(format(from, 'utcMidday', true)) : null,
    to: to ? new Date(format(to, 'utcMidday', true)) : null,
  };
  return selectorDateRange;
};
export const convertToNexoyaDateRanges = (
  dateFromNexoya: Date,
  dateToNexoya: Date,
  onDateChangeNexoya: (props: IDateRangeShort) => void,
) => {
  const onDateChange = (props: IDateRangeShort) => onDateChangeNexoya(selectorToNexoyaDateRange(props));
  const { from, to } = nexoyaToSelectorDateRange({
    from: dateFromNexoya,
    to: dateToNexoya,
  });
  return { dateFrom: from, dateTo: to, onDateChange };
};
