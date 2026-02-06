import React, { useMemo } from 'react';
import { useStations } from '../contexts/StationsContext';
import { useViewMode } from '../contexts/ViewModeContext';
import { useSearch } from '../contexts/SearchContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { StationCard } from './StationCard';
import { StationListItem } from './StationListItem';
import { Loader2, Music, SearchX, Heart } from 'lucide-react';

export const StationsDisplay: React.FC = () => {
  const { stations, loading } = useStations();
  const { viewMode } = useViewMode();
  const { searchQuery, categoryFilter } = useSearch();
  const { favorites, showOnlyFavorites } = useFavorites();

  const filteredStations = useMemo(() => {
    let result = stations;

    if (showOnlyFavorites) {
      result = result.filter(station => favorites.has(station.id));
    }

    if (categoryFilter && categoryFilter !== 'All') {
      result = result.filter(station => station.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(station =>
        station.stationName.toLowerCase().includes(query) ||
        station.url.toLowerCase().includes(query)
      );
    }

    return result;
  }, [stations, searchQuery, categoryFilter, showOnlyFavorites, favorites]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-t-primary animate-spin" />
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-t-card flex items-center justify-center mb-4">
          <Music className="w-10 h-10 text-t-text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-t-text mb-2">
          No stations yet
        </h3>
        <p className="text-t-text-secondary max-w-md">
          Add your first radio station to get started, or import a CSV file with your favorite stations.
        </p>
      </div>
    );
  }

  if (filteredStations.length === 0) {
    if (showOnlyFavorites) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-t-card flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-t-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-t-text mb-2">
            No favorite stations
          </h3>
          <p className="text-t-text-secondary max-w-md">
            Mark stations as favorites by clicking the heart icon to see them here.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-t-card flex items-center justify-center mb-4">
          <SearchX className="w-10 h-10 text-t-text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-t-text mb-2">
          No stations found
        </h3>
        <p className="text-t-text-secondary max-w-md">
          No stations match "{searchQuery}". Try a different search term.
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
        {filteredStations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {filteredStations.map((station) => (
        <StationListItem key={station.id} station={station} />
      ))}
    </div>
  );
};
