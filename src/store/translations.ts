import { create } from 'zustand';
import { NexoyaTranslation } from '../types';

type TranslationStore = {
  translations: NexoyaTranslation[];
  setTranslations: (data: NexoyaTranslation[]) => void;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useTranslationStore = create<TranslationStore>((set) => ({
  translations: [],
  setTranslations: (data) => set({ translations: data }),
  error: null,
  setError: (error) => set({ error }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default useTranslationStore;
