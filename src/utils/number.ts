// Comment: round to 2 decimal points by default
import { nexyColors } from '../theme';

export function round(num: number): number {
  return Math.round(num * 100) / 100;
}
// Comment:  make an average of number and number of elements
export function average(value: number, length: number): number {
  return Math.round((value / length) * 100) / 100;
}

export function shortenNumber(number, precision = 2, divisors = null) {
  if (!number) {
    return 0;
  }
  // Setup default divisors if not provided
  if (!divisors) {
    divisors = {
      [Math.pow(1000, 0)]: '', // 1000^0 == 1
      [Math.pow(1000, 1)]: 'K', // Thousand
      [Math.pow(1000, 2)]: 'M', // Million
      [Math.pow(1000, 3)]: 'B', // Billion
      [Math.pow(1000, 4)]: 'T', // Trillion
      [Math.pow(1000, 5)]: 'Qa', // Quadrillion
      [Math.pow(1000, 6)]: 'Qi', // Quintillion
    };
  }

  // Loop through each divisor and find the
  // lowest amount that matches
  let divisor, shorthand;
  for ([divisor, shorthand] of Object.entries(divisors)) {
    if (Math.abs(number) < divisor * 1000) {
      // We found a match!
      break;
    }
  }

  // Convert the number to string with desired precision without rounding
  const numStr = (number / divisor).toString();
  const decimalIndex = numStr.indexOf('.');
  const shortenedNumber = decimalIndex === -1 ? numStr : numStr.substring(0, decimalIndex + precision + 1);

  return shortenedNumber + shorthand;
}

export const getPercentageColor = (value: number, lowerIsBetter: boolean) => {
  if (lowerIsBetter) {
    return value > 0 ? nexyColors.red400 : nexyColors.greenTeal;
  }
  return value > 0 ? nexyColors.greenTeal : nexyColors.red400;
};
