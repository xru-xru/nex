import dayjs from 'dayjs';

import { GLOBAL_DATE_FORMAT } from './dates';

export const addDays = (currentDays, startDate, numberOfDays) => {
  let date = dayjs(startDate);
  const newDays = [...currentDays];

  for (let i = 0; i < numberOfDays; i++) {
    date = dayjs(date).add(1, 'd');

    const newSpending = {
      day: dayjs(date).format(GLOBAL_DATE_FORMAT),
    };

    newDays.push(newSpending);
  }

  return newDays;
};
