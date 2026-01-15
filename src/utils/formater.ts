export const formatDate = (date: Date | string, locale = 'de-CH', opt?: Record<string, any>): string => {
  const validDate = new Date(date);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opt,
  };
  // @ts-ignore
  return validDate.toLocaleDateString(locale, options);
};
export const formatShortDate = (date: Date | string, opt?: Record<string, any>, locale = 'de-CH'): string => {
  const validDate = new Date(date);
  const options = {
    ...{
      day: 'numeric',
      month: 'short',
    },
    ...opt,
  };
  // @ts-ignore
  return validDate.toLocaleDateString(locale, options);
};

export const formatNumber = (numberToFormat: number, locales = 'de-CH', opt?: Record<string, any>): string =>
  new Intl.NumberFormat(locales, opt).format(numberToFormat);
