import { create } from 'zustand';

const STORAGE_KEY = 'radio-favorites';

const loadFavoritesFromStorage = (): Set<string> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
  return new Set();
};

interface FavoritesState {
  favorites: Set<string>;
  showOnlyFavorites: boolean;
  toggleFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
  setShowOnlyFavorites: (show: boolean) => void;
}

export const useFavorites = create<FavoritesState>()((set, get) => ({
  favorites: loadFavoritesFromStorage(),
  showOnlyFavorites: false,

  toggleFavorite: (stationId) =>
    set((state) => {
      const newSet = new Set(state.favorites);
      if (newSet.has(stationId)) {
        newSet.delete(stationId);
      } else {
        newSet.add(stationId);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSet)));
      return { favorites: newSet };
    }),

  isFavorite: (stationId) => get().favorites.has(stationId),

  setShowOnlyFavorites: (show) => set({ showOnlyFavorites: show }),
}));

