import React, { useState } from 'react';
import { RadioStation, getLogoPath } from '../utils/csvParser';
import { usePlayer } from '../contexts/PlayerContext';
import { useStations } from '../contexts/StationsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Play, Pause, Trash2, Radio, Edit, Heart } from 'lucide-react';
import { EditStationModal } from './EditStationModal';

interface StationCardProps {
  station: RadioStation;
}

export const StationCard: React.FC<StationCardProps> = ({ station }) => {
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
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-700 dark:to-gray-600">
        <img
          src={getLogoPath(station.logo)}
          alt={station.stationName}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            e.currentTarget.src = getLogoPath('');
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={() => playStation(station)}
            className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg"
          >
            {isCurrentStation && isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
        </div>
        {isCurrentStation && isPlaying && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate mb-2">
          {station.stationName}
        </h3>
        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
          {station.category}
        </span>
      </div>

      <button
        onClick={handleFavorite}
        className={`absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 rounded-full ${
          isFav
            ? 'bg-pink-500 hover:bg-pink-600 opacity-100'
            : 'bg-gray-500 hover:bg-gray-600 opacity-0 group-hover:opacity-100'
        } text-white flex items-center justify-center transition-all duration-300 shadow-lg touch-manipulation`}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
      </button>

      <button
        onClick={handleEdit}
        className="hidden sm:flex absolute top-3 left-12 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
      >
        <Edit className="w-4 h-4" />
      </button>

      <button
        onClick={handleDelete}
        className="hidden sm:flex absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <EditStationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        station={station}
      />
    </div>
  );
};
