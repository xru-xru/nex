import { create } from 'zustand';
import { NexoyaOrg, NexoyaTenantUiCustomization } from '../types';

const NEXOYA_TENANT_ID = 1;

export const DEFAULT_UI_CUSTOMIZATION_FALLBACK: Partial<NexoyaTenantUiCustomization> = {
  helpPageUrl: 'https://nexoya.com/help',
  onboardingMail: 'onboaridng@nexoya.io',
  supportMail: 'support@nexoya.io',
};

type OrganizationStore = {
  organization: NexoyaOrg | null;
  setOrganization: (organization: NexoyaOrg | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isNexoya: () => boolean;
  customization: NexoyaTenantUiCustomization;
  setCustomization: (customization: NexoyaTenantUiCustomization) => void;
};

const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  organization: null,
  setOrganization: (organization) => set({ organization }),
  error: null,
  setError: (error) => set({ error }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  isNexoya: () => get().organization?.tenant.tenant_id === NEXOYA_TENANT_ID,
  customization: {},
  setCustomization: (customization) => set({ customization }),
}));

export default useOrganizationStore;
