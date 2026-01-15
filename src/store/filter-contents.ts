import { create } from 'zustand';
import { NexoyaContentV2 } from '../types';

interface FilteredContentsState {
  filteredContents: NexoyaContentV2[];
  setFilteredContents: (contents: NexoyaContentV2[]) => void;
  selectedContentIds: number[];
  setSelectedContentIds: (contentIds: number[]) => void;
}

export const useFilteredContentsStore = create<FilteredContentsState>((set) => ({
  filteredContents: [],
  setFilteredContents: (contents) => set({ filteredContents: contents }),
  selectedContentIds: [],
  setSelectedContentIds: (contentIds) => set({ selectedContentIds: contentIds }),
}));
