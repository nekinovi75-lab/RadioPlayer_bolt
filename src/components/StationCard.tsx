import React, { useState } from 'react';
import { RadioStation, getLogoPath } from '../utils/csvParser';
import { usePlayer } from '../stores/usePlayerStore';
import { useStations } from '../stores/useStationsStore';
import { useFavorites } from '../stores/useFavoritesStore';
import { Play, Pause, Trash2, Radio, Edit, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { EditStationModal } from './EditStationModal';
import { ConfirmDialog } from './ConfirmDialog';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    <div className="group relative bg-t-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-t-border">
      <div className="aspect-video relative overflow-hidden bg-t-primary-subtle">
        <img
          src={getLogoPath(station.logo)}
          alt={station.stationName}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            e.currentTarget.src = getLogoPath('');
          }}
        />
        <div className="absolute inset-0 bg-[var(--overlay)] opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => playStation(station)}
            className="w-16 h-16 rounded-full bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg"
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
            <div className="flex items-center gap-1 bg-t-success text-t-text-on-primary px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE
            </div>
          </div>
        )}
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
        className={`absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 rounded-full ${isFav
          ? 'bg-t-favorite hover:bg-t-favorite-hover opacity-100'
          : 'bg-t-text-secondary opacity-0 group-hover:opacity-100'
          } text-t-text-on-primary flex items-center justify-center transition-all duration-300 shadow-lg touch-manipulation`}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
      </button>

      <button
        onClick={handleEdit}
        className="hidden sm:flex absolute top-3 left-12 w-8 h-8 rounded-full bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
      >
        <Edit className="w-4 h-4" />
      </button>

      <button
        onClick={handleDeleteClick}
        className="hidden sm:flex absolute top-3 right-3 w-8 h-8 rounded-full bg-t-danger hover:bg-t-danger-hover text-t-text-on-primary items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
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
