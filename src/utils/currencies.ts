export interface Currency {
  code: string;
  name: string;
  emoji: string;
  symbol: string;
}

export const CURRENCY_LIST: Currency[] = [
  { code: 'USD', name: 'United States Dollar', emoji: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', emoji: '🇪🇺', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', emoji: '🇯🇵', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', emoji: '🇬🇧', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', emoji: '🇦🇺', symbol: '$' },
  { code: 'CAD', name: 'Canadian Dollar', emoji: '🇨🇦', symbol: '$' },
  { code: 'CHF', name: 'Swiss Franc', emoji: '🇨🇭', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', emoji: '🇨🇳', symbol: '¥' },
  { code: 'SEK', name: 'Swedish Krona', emoji: '🇸🇪', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', emoji: '🇳🇿', symbol: '$' },
  { code: 'MXN', name: 'Mexican Peso', emoji: '🇲🇽', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', emoji: '🇸🇬', symbol: '$' },
  { code: 'HKD', name: 'Hong Kong Dollar', emoji: '🇭🇰', symbol: '$' },
  { code: 'NOK', name: 'Norwegian Krone', emoji: '🇳🇴', symbol: 'kr' },
  { code: 'KRW', name: 'South Korean Won', emoji: '🇰🇷', symbol: '₩' },
  { code: 'RON', name: 'Romanian Leu', emoji: '🇷🇴', symbol: 'RON' },
  { code: 'TRY', name: 'Turkish Lira', emoji: '🇹🇷', symbol: '₺' },
  { code: 'INR', name: 'Indian Rupee', emoji: '🇮🇳', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', emoji: '🇧🇷', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', emoji: '🇿🇦', symbol: 'R' },
  { code: 'DKK', name: 'Danish Krone', emoji: '🇩🇰', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', emoji: '🇵🇱', symbol: 'zł' },
  { code: 'TWD', name: 'New Taiwan Dollar', emoji: '🇹🇼', symbol: 'NT$' },
  { code: 'THB', name: 'Thai Baht', emoji: '🇹🇭', symbol: '฿' },
  { code: 'MYR', name: 'Malaysian Ringgit', emoji: '🇲🇾', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesian Rupiah', emoji: '🇮🇩', symbol: 'Rp' },
  { code: 'CZK', name: 'Czech Koruna', emoji: '🇨🇿', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', emoji: '🇭🇺', symbol: 'Ft' },
  { code: 'ILS', name: 'Israeli New Shekel', emoji: '🇮🇱', symbol: '₪' },
  { code: 'AED', name: 'United Arab Emirates Dirham', emoji: '🇦🇪', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', emoji: '🇸🇦', symbol: '﷼' },
];

export const findCurrency = (code: string): Currency | undefined => {
  return CURRENCY_LIST.find((c) => c.code === code);
};
