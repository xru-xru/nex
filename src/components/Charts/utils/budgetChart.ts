export const OVERSPEND_VS_UNDERSPEND_NAME = 'Overspend vs underspend';
export const REALLOCATED_TOOLTIP_NAME = 'Planned daily delta budget';
export const PLANNED_TOOLTIP_NAME = 'Planned daily budget';

export function formatCurrencyValue(value, format, currency) {
  return Intl.NumberFormat(format, {
    style: 'currency',
    currency: currency,
  }).format(value || 0);
}

export function determinePadding(index: number, seriesLength: number) {
  if (seriesLength === 1) {
    return '12px 8px 12px 8px'; // padding for the only item
  }
  if (index === 0) {
    return '12px 8px 4px 8px'; // padding for the first item
  }

  if (index === seriesLength - 1) {
    return '4px 8px 12px 8px'; // padding for the last item
  }

  return '4px 8px;'; // default padding
}

export function determineItemName(item, valueY, openValueY) {
  if (item?.name === OVERSPEND_VS_UNDERSPEND_NAME) {
    return valueY > openValueY ? 'Daily overspend' : 'Daily underspend';
  }
  return item?.name;
}
