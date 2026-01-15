import { create } from 'zustand';

export enum Currency {
  CHF = 'CHF',
  EUR = 'EUR',
  GBP = 'GBP',
  USD = 'USD',
  SAR = 'SAR',
  CAD = 'CAD',
  TRY = 'TRY',
  AED = 'AED',
  SGD = 'SGD',
}

export const currencySymbol: Record<Currency, string> = {
  [Currency.CHF]: 'CHF',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.USD]: '$',
  [Currency.SAR]: 'ر.س',
  [Currency.CAD]: 'CA$',
  [Currency.TRY]: '₺',
  [Currency.AED]: 'د.إ',
  [Currency.SGD]: 'S$',
};

type TeamCurrencySettings = {
  teamId: number;
  currency: Currency;
  numberFormat: string;
};
type CurrencyStore = {
  currency: Currency;
  numberFormat: string;
  usingOverride: boolean;
  setTeamCurrencySettings: (teamCurrencySettings: TeamCurrencySettings) => void;
  setCurrencyOverride: (teamId: number, currency: Currency) => void;
  missingCurrencyCoverage: boolean;
  setMissingCurrencyCoverage: (missingCurrencyCoverage: boolean) => void;
  // List of pairs that are missing coverage, used to pre-populate empty columns in settings
  missingCurrencyPairs: { from: string; to: string }[];
  setMissingCurrencyPairs: (pairs: { from: string; to: string }[]) => void;
  // Union of missing date ranges across pairs (ISO strings from BE)
  missingCurrencyRanges: { from: string; to: string }[];
  setMissingCurrencyRanges: (ranges: { from: string; to: string }[]) => void;
};

const buildTeamCurrencyOverrides = () => {
  const STORAGE_KEY = 'team_currency_overrides';
  const state = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
  return {
    get: (teamId: number) => state[teamId],
    set: (teamId: number, currency: Currency) => {
      state[teamId] = currency;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
  };
};
const teamCurrencyOverrides = buildTeamCurrencyOverrides();

const getCurrencyNumberFormat = (currency: Currency): string => {
  const currencyToNumberFormat: Record<Currency, string> = {
    [Currency.CHF]: 'de-CH',
    [Currency.EUR]: 'de-DE',
    [Currency.GBP]: 'en-GB',
    [Currency.USD]: 'en-US',
    [Currency.SAR]: 'en-US',
    [Currency.CAD]: 'en-CA',
    [Currency.TRY]: 'tr-TR',
    [Currency.AED]: 'en-AE',
    [Currency.SGD]: 'en-SG',
  };
  return currencyToNumberFormat[currency] ?? 'de-CH';
};
const getNumberFormat = (teamCurrencySettings: TeamCurrencySettings) => {
  const currencyOverride = teamCurrencyOverrides.get(teamCurrencySettings.teamId);
  if (currencyOverride) return getCurrencyNumberFormat(currencyOverride) || DEFAULTS.numberFormat;
  return teamCurrencySettings.numberFormat || DEFAULTS.numberFormat;
};
const DEFAULTS = {
  currency: Currency.CHF,
  numberFormat: getCurrencyNumberFormat(Currency.CHF),
};

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: DEFAULTS.currency,
  numberFormat: DEFAULTS.numberFormat,
  usingOverride: false,
  missingCurrencyCoverage: false,
  setMissingCurrencyCoverage: (missingCurrencyCoverage) =>
    set(() => ({
      missingCurrencyCoverage,
    })),
  missingCurrencyPairs: [],
  setMissingCurrencyPairs: (pairs) =>
    set(() => ({
      missingCurrencyPairs: pairs || [],
    })),
  missingCurrencyRanges: [],
  setMissingCurrencyRanges: (ranges) =>
    set(() => ({
      missingCurrencyRanges: ranges || [],
    })),
  setTeamCurrencySettings: (teamCurrencySettings) =>
    set({
      currency:
        teamCurrencyOverrides.get(teamCurrencySettings.teamId) || teamCurrencySettings.currency || DEFAULTS.currency,
      numberFormat: getNumberFormat(teamCurrencySettings),
      usingOverride: Boolean(teamCurrencyOverrides.get(teamCurrencySettings.teamId)),
    }),
  setCurrencyOverride: (teamId, currency) => {
    teamCurrencyOverrides.set(teamId, currency);
    set({
      currency,
      numberFormat: getCurrencyNumberFormat(currency) || DEFAULTS.numberFormat,
      usingOverride: true,
    });
  },
}));
