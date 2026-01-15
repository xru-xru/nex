import { create } from 'zustand';
import { NexoyaContentV2 } from '../types';

interface ProviderRuleState {
  providerMapSelection: { [providerId: string]: number[] };
  subAccounts: NexoyaContentV2[];
  setProviderMapSelection: (selection: { [providerId: string]: number[] }) => void;
  setSubAccounts: (accounts: NexoyaContentV2[]) => void;
}

export const useProviderRuleStore = create<ProviderRuleState>((set) => ({
  providerMapSelection: {},
  subAccounts: [],
  setProviderMapSelection: (selection) => set({ providerMapSelection: selection }),
  setSubAccounts: (accounts) => set({ subAccounts: accounts }),
}));
