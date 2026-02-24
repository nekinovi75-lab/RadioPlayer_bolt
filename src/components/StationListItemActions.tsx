import React from 'react';
import { Heart, Edit, Trash2 } from 'lucide-react';

interface StationListItemActionsProps {
  showActions: boolean;
  isFav: boolean;
  onFavorite: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const StationListItemActions: React.FC<StationListItemActionsProps> = ({
  showActions,
  isFav,
  onFavorite,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 overflow-hidden transition-all duration-200 ${
        showActions
          ? 'max-w-[200px] opacity-100 pointer-events-auto'
          : 'max-w-0 opacity-0 pointer-events-none sm:max-w-[200px] sm:opacity-0 sm:pointer-events-auto sm:group-hover:opacity-100'
      }`}
    >
      <button
        aria-label="Toggle favorite"
        onClick={onFavorite}
        className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full ${
          isFav ? 'bg-t-favorite hover:bg-t-favorite-hover' : 'bg-t-text-secondary'
        } text-t-text-on-primary flex items-center justify-center shadow-md touch-manipulation`}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
      </button>

      <button
        aria-label="Edit station"
        onClick={onEdit}
        className="flex-shrink-0 flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary items-center justify-center shadow-md touch-manipulation"
      >
        <Edit className="w-4 h-4" />
      </button>

      <button
        aria-label="Delete station"
        onClick={onDelete}
        className="flex-shrink-0 flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-t-danger hover:bg-t-danger-hover text-t-text-on-primary items-center justify-center shadow-md touch-manipulation"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
