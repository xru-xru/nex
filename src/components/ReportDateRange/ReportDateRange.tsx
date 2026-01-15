import dayjs from 'dayjs';

import { NexoyaReportDateRange } from '../../types';

import { DateSelector, IDateRangeShort } from '../DateSelector/DateSelector';
import { DateIcon } from '../icons';

type Props = {
  handleDateChange?: (customRange: IDateRangeShort) => void;
  dateRange?: NexoyaReportDateRange;
};
function ReportDateRange({ dateRange, handleDateChange }: Props) {
  const { customRange } = dateRange;
  const dateFrom = customRange?.dateFrom;
  const dateTo = customRange?.dateTo;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DateIcon
        style={{
          fontSize: '20px',
          marginRight: '15px',
        }}
      />
      <p
        style={{
          marginRight: 15,
        }}
      >
        Date range:
      </p>
      <DateSelector
        dateFrom={dateFrom || dayjs().subtract(7, 'day').toDate()}
        dateTo={dateTo || dayjs().toDate()}
        onDateChange={handleDateChange}
        disableAfterDate={null}
        hideFutureQuickSelection={false}
        panelProps={{
          side: 'bottom',
          align: 'start',
        }}
      />
    </div>
  );
}

export default ReportDateRange;
