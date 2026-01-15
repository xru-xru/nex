import dayjs from 'dayjs';

import { CalendarCard, CalendarDay, CalendarMonth } from './styles';

export const CalendarDateCard = ({ date }: { date: Date }) => {
  const month = dayjs(date).endOf('day').format('MMM');
  const day = dayjs(date).endOf('day').format('DD');

  return (
    <CalendarCard>
      <CalendarMonth>{month}</CalendarMonth>
      <CalendarDay>{day}</CalendarDay>
    </CalendarCard>
  );
};
