import React, { useState } from 'react';
import { RadioStation, getLogoPath } from '../utils/csvParser';
import { usePlayer } from '../stores/usePlayerStore';
import { useStations } from '../stores/useStationsStore';
import { useFavorites } from '../stores/useFavoritesStore';
import { Play, Pause, Trash2, Radio, Edit, Heart } from 'lucide-react';
import { EditStationModal } from './EditStationModal';

interface StationListItemProps {
  station: RadioStation;
}

export const StationListItem: React.FC<StationListItemProps> = ({ station }) => {
  const { currentStation, isPlaying, playStation } = usePlayer();
  const { deleteStation } = useStations();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isCurrentStation = currentStation?.id === station.id;
  const isFav = isFavorite(station.id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${station.stationName}"?`)) {
      deleteStation(station.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(station.id);
  };

  return (
    <div className="group bg-t-card border border-t-border rounded-lg hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="relative flex-shrink-0">
          <img
            src={getLogoPath(station.logo)}
            alt={station.stationName}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-contain bg-t-primary-subtle p-2 shadow-sm"
            onError={(e) => {
              e.currentTarget.src = getLogoPath('');
            }}
          />
          {isCurrentStation && isPlaying && (
            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-t-success rounded-full animate-pulse"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-t-text text-sm sm:text-base line-clamp-1">
              {station.stationName}
            </h3>
            {isCurrentStation && isPlaying && (
              <div className="flex items-center gap-1 bg-t-success text-t-text-on-primary px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0">
                <Radio className="w-3 h-3" />
                <span className="hidden xs:inline">LIVE</span>
              </div>
            )}
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-t-primary-subtle text-t-primary rounded-full flex-shrink-0">
              {station.category}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-t-text-secondary truncate mt-0.5 sm:mt-1">
            {station.url}
          </p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={handleFavorite}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${
              isFav
                ? 'bg-t-favorite hover:bg-t-favorite-hover'
                : 'bg-t-text-secondary opacity-0 group-hover:opacity-100 sm:opacity-0'
            } text-t-text-on-primary flex items-center justify-center transition-all shadow-md touch-manipulation`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => playStation(station)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary flex items-center justify-center transition-colors shadow-md touch-manipulation"
          >
            {isCurrentStation && isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleEdit}
            className="hidden sm:flex w-10 h-10 rounded-full bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="hidden sm:flex w-10 h-10 rounded-full bg-t-danger hover:bg-t-danger-hover text-t-text-on-primary items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <EditStationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        station={station}
      />
    </div>
  );
};
