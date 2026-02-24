import React, { useState } from 'react';
import { RadioStation, getLogoPath } from '../utils/csvParser';
import { usePlayer } from '../stores/usePlayerStore';
import { useStations } from '../stores/useStationsStore';
import { useFavorites } from '../stores/useFavoritesStore';
import { Play, Pause, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { EditStationModal } from './EditStationModal';
import { ConfirmDialog } from './ConfirmDialog';
import { StationListItemActions } from './StationListItemActions';
import { useMobileActions } from '../stores/useMobileActionsStore';

interface StationListItemProps {
  station: RadioStation;
}

export const StationListItem: React.FC<StationListItemProps> = ({ station }) => {
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
      className={`group bg-t-card rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${
        isCurrentStation
          ? 'ring-2 ring-t-primary border border-transparent'
          : showActions
          ? 'border border-t-border sm:border-transparent sm:hover:border-t-border'
          : 'border border-transparent hover:border-t-border'
      }`}
    >
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
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <StationListItemActions
            showActions={showActions}
            isFav={isFav}
            onFavorite={handleFavorite}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              playStation(station);
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary flex items-center justify-center transition-colors shadow-md touch-manipulation"
          >
            {isCurrentStation && isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </div>
      </div>

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
