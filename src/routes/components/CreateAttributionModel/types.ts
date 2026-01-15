import { DataTableFilterOption } from '../../portfolio/components/Content/PortfolioRule/types';

export type ChannelAccount = {
  id: string;
  label: string;
};

export type ChannelSelection = {
  providerId: number;
  providerName: string;
  providerLogo?: string;
  integrationId: number;
  accounts: ChannelAccount[];
  selectedAccountIds: string[];
  exportLevel: string;
  filters: DataTableFilterOption[];
  fields: DataTableFilterOption[];
  shouldFetch: boolean;
};

export type BasicRunState = {
  name: string;
  start: Date | null;
};

export type Ga4State = {
  propertyId: string;
  propertyLabel?: string;
  dimensions: Array<{ value: string }>;
  metricIds: number[];
};

export type TargetMetricState = {
  metricId: number | null;
  file: File | null;
  skipFile: boolean;
};

export type WizardStep = {
  id: 'basic' | 'channels' | 'ga4' | 'target' | 'review';
  title: string;
  description: string;
};
