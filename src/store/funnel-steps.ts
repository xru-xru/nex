import { create } from 'zustand';
import { NexoyaFunnelStepV2 } from '../types';

type FunnelStepsStore = {
  funnelSteps: NexoyaFunnelStepV2[];
  setFunnelSteps: (data: NexoyaFunnelStepV2[]) => void;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useFunnelStepsStore = create<FunnelStepsStore>((set) => ({
  funnelSteps: [],
  setFunnelSteps: (data) => set({ funnelSteps: data }),
  error: null,
  setError: (error) => set({ error }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default useFunnelStepsStore;
