import React, { useState } from 'react';
import { RadioStation, getLogoPath } from '../utils/csvParser';
import { usePlayer } from '../stores/usePlayerStore';
import { useStations } from '../stores/useStationsStore';
import { useFavorites } from '../stores/useFavoritesStore';
import { Play, Pause, Trash2, Radio, Edit, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { EditStationModal } from './EditStationModal';
import { ConfirmDialog } from './ConfirmDialog';

import { useMobileActions } from '../stores/useMobileActionsStore';

interface StationCardProps {
  station: RadioStation;
}

export const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const { currentStation, isPlaying, playStation } = usePlayer();
  const { deleteStation } = useStations();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { activeStationId, toggleStation } = useMobileActions();
  const isCurrentStation = currentStation?.id === station.id;
  const isFav = isFavorite(station.id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const showActions = activeStationId === station.id;

  const handleToggleActions = () => {
    if (window.innerWidth < 640) {
      toggleStation(station.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteStation(station.id);
    toast.success('Station deleted', {
      description: `"${station.stationName}" has been removed.`
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(station.id);
    if (isFav) {
      toast.info(`Removed from favorites`, {
        description: `"${station.stationName}" has been removed.`
      });
    } else {
      toast.success(`Added to favorites`, {
        description: `"${station.stationName}" has been added.`
      });
    }
  };

  return (
    <div
      onClick={handleToggleActions}
      className="group relative bg-t-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-t-border cursor-pointer"
    >
      <div className="aspect-video relative overflow-hidden bg-t-primary-subtle">
        <img
          src={getLogoPath(station.logo)}
          alt={station.stationName}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            e.currentTarget.src = getLogoPath('');
          }}
        />
        {isCurrentStation && isPlaying && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-t-success text-t-text-on-primary px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE
            </div>
          </div>
        )}
      </div>

      <div className={`absolute inset-0 bg-[var(--overlay)] transition-opacity duration-300 flex items-center justify-center z-10 ${showActions ? 'opacity-60' : 'opacity-0 sm:group-hover:opacity-60'
        }`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            playStation(station);
          }}
          className={`w-16 h-16 rounded-full bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary flex items-center justify-center transform transition-all duration-300 shadow-xl ${showActions ? 'scale-100 opacity-100' : 'scale-0 sm:group-hover:scale-100 opacity-0 sm:group-hover:opacity-100'
            }`}
        >
          {isCurrentStation && isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-t-text text-base sm:text-lg truncate mb-2">
          {station.stationName}
        </h3>
        <span className="inline-block px-2 py-1 text-xs font-medium bg-t-primary-subtle text-t-primary rounded-full">
          {station.category}
        </span>
      </div>

      <button
        onClick={handleFavorite}
        className={`absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 rounded-full z-20 ${isFav
          ? 'bg-t-favorite hover:bg-t-favorite-hover opacity-100'
          : `bg-t-text-secondary transition-all duration-300 shadow-lg touch-manipulation ${showActions ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
          }`
          } text-t-text-on-primary flex items-center justify-center`}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
      </button>

      <button
        onClick={handleEdit}
        className={`flex absolute top-2 left-12 sm:top-3 sm:left-12 w-8 h-8 rounded-full bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary items-center justify-center transition-all duration-300 shadow-lg touch-manipulation z-20 ${showActions ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
          }`}
      >
        <Edit className="w-4 h-4" />
      </button>

      <button
        onClick={handleDeleteClick}
        className={`flex absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 rounded-full bg-t-danger hover:bg-t-danger-hover text-t-text-on-primary items-center justify-center transition-all duration-300 shadow-lg touch-manipulation z-20 ${showActions ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
          }`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <EditStationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        station={station}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Station"
        message={`Are you sure you want to delete "${station.stationName}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
