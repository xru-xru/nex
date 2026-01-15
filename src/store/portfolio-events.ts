import { create } from 'zustand';
import { NexoyaPortfolioEvent } from '../types';
import { track } from '../constants/datadog';
import { EVENT } from '../constants/events';

type PortfolioEventsStore = {
  paginatedPortfolioEvents: { data: NexoyaPortfolioEvent[]; page: number }[];
  setPaginatedPortfolioEvents: (data: NexoyaPortfolioEvent[], page: number) => void;
  portfolioEvents: NexoyaPortfolioEvent[];
  setPortfolioEvents: (data: NexoyaPortfolioEvent[]) => void;
  areEventsExtended: boolean;
  setEventsExtended: (data: boolean) => void;
  showEvents: boolean;
  setShowEvents: (data: boolean) => void;
  newPortfolioEvent: Partial<NexoyaPortfolioEvent> & {
    file?: File | null;
    removeAsset?: boolean;
    hasDuplicateName?: boolean;
  };
  setNewPortfolioEvent: (
    data: Partial<NexoyaPortfolioEvent> & { file?: File | null; removeAsset?: boolean; hasDuplicateName?: boolean },
  ) => void;
  resetNewPortfolioEvent: () => void;
  loading: boolean;
  setLoading: (data: boolean) => void;
  resetStore: () => void;
};

const initialNewPortfolioEvent = {
  name: null,
  description: null,
  start: null,
  end: null,
  category: null,
  impact: null,
  file: null,
  removeAsset: false,
  hasDuplicateName: false,
};

const usePortfolioEventsStore = create<PortfolioEventsStore>((set) => ({
  loading: true,
  paginatedPortfolioEvents: [],
  setPaginatedPortfolioEvents: (data, page) =>
    set((state) => {
      const existingPage = state.paginatedPortfolioEvents.find((p) => p.page === page);
      if (existingPage) {
        return {
          paginatedPortfolioEvents: state.paginatedPortfolioEvents.map((p) => (p.page === page ? { ...p, data } : p)),
        };
      }
      return { paginatedPortfolioEvents: [...state.paginatedPortfolioEvents, { data, page }] };
    }),
  setLoading: (data) => set({ loading: data }),
  portfolioEvents: [],
  setPortfolioEvents: (data) => set({ portfolioEvents: data }),
  areEventsExtended: false,
  setEventsExtended: (data) => set({ areEventsExtended: data }),
  showEvents: true,
  setShowEvents: (showEvents) => {
    set({ showEvents });
    track(EVENT.PORTFOLIO_EVENT_SHOW_EVENTS, {
      'Show Events': showEvents,
    });
  },

  newPortfolioEvent: initialNewPortfolioEvent,
  setNewPortfolioEvent: (data) => set((state) => ({ newPortfolioEvent: { ...state.newPortfolioEvent, ...data } })),
  resetNewPortfolioEvent: () => set({ newPortfolioEvent: initialNewPortfolioEvent }),
  resetStore: () =>
    set({
      paginatedPortfolioEvents: [],
      portfolioEvents: [],
      newPortfolioEvent: initialNewPortfolioEvent,
      loading: true,
      showEvents: true,
      areEventsExtended: false,
    }),
}));

export default usePortfolioEventsStore;
