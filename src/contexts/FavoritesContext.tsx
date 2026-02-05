import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: Set<string>;
  loading: boolean;
  toggleFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (show: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'radio-favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveFavorites();
    }
  }, [favorites, loading]);

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const favArray = JSON.parse(stored);
        setFavorites(new Set(favArray));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = () => {
    try {
      const favArray = Array.from(favorites);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favArray));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (stationId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stationId)) {
        newSet.delete(stationId);
      } else {
        newSet.add(stationId);
      }
      return newSet;
    });
  };

  const isFavorite = (stationId: string): boolean => {
    return favorites.has(stationId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      toggleFavorite,
      isFavorite,
      showOnlyFavorites,
      setShowOnlyFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
