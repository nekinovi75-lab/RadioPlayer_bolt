import { create } from 'zustand';

interface SearchState {
  searchQuery: string;
  categoryFilter: string;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
}

export const useSearch = create<SearchState>()((set) => ({
  searchQuery: '',
  categoryFilter: 'All',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
}));

