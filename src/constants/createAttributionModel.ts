import { WizardStep } from '../routes/components/CreateAttributionModel/types';

export const EXPORT_LEVEL_OPTIONS = [
  { value: 'CAMPAIGN', label: 'Campaign' },
  { value: 'AD_SET', label: 'Ad set' },
];
export const GA4_INTEGRATION_ID = 168;
export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'basic',
    title: 'Basic run data',
    description: 'Name your model run and select the timeframe.',
  },
  {
    id: 'channels',
    title: 'Channel selection',
    description: 'Pick the channels, ad accounts, and export levels.',
  },
  {
    id: 'ga4',
    title: 'GA4 configuration',
    description: 'Configure the GA4 property and required dimensions.',
  },
  {
    id: 'target',
    title: 'Target metric',
    description: 'Define the target metric and upload the metric file.',
  },
];
