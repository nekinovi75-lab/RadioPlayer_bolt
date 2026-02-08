import React, { useState } from 'react';
import { usePlayer } from '../stores/usePlayerStore';
import { useSleepTimer } from '../stores/useSleepTimerStore';
import { getLogoPath } from '../utils/csvParser';
import { Pause, Play, Volume2, VolumeX, Loader2, Clock, HelpCircle } from 'lucide-react';
import { SleepTimerModal } from './SleepTimerModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

import Visualizer from './Visualizer';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer: React.FC = () => {
  const { currentStation, isPlaying, isLoading, volume, error, pause, playStation, setVolume } = usePlayer();
  const { timeRemaining, isActive } = useSleepTimer();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  if (!currentStation) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-t-card border-t border-t-border p-6 transition-colors z-50">
        <div className="max-w-7xl mx-auto text-center text-t-text-secondary">
          Select a station to start playing
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-t-card border-t border-t-border p-3 sm:p-6 transition-colors z-50">
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-6">
        <div className="relative flex-shrink-0">
          <img
            src={getLogoPath(currentStation.logo)}
            alt={currentStation.stationName}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-contain bg-t-primary-subtle p-2 shadow-md"
            onError={(e) => {
              e.currentTarget.src = getLogoPath('');
            }}
          />
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-t-success rounded-full animate-pulse"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-lg font-semibold text-t-text truncate leading-tight">
            {currentStation.stationName}
          </h3>
          <div className="h-6 flex items-center">
            {isLoading ? (
              <p className="text-xs sm:text-sm text-t-text-secondary truncate animate-pulse">
                Connecting...
              </p>
            ) : (
              <Visualizer isPlaying={isPlaying} />
            )}
          </div>
          {error && (
            <p className="text-xs sm:text-sm text-t-danger mt-1">{error}</p>
          )}
        </div>

        <button
          onClick={() => setIsTimerModalOpen(true)}
          className={`flex items-center gap-1 p-2 sm:p-0 rounded-lg transition-colors flex-shrink-0 ${isActive
              ? 'bg-t-primary-subtle text-t-primary'
              : 'text-t-text-secondary hover:text-t-text hover:bg-t-card-hover'
            }`}
          title="Sleep timer"
        >
          <Clock className="w-5 h-5" />
          {isActive && <span className="text-xs sm:hidden font-medium">{formatTime(timeRemaining)}</span>}
        </button>

        <button
          onClick={() => isPlaying ? pause() : playStation(currentStation)}
          disabled={isLoading}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0 touch-manipulation"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
          )}
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-2">
          {isActive && (
            <span className="text-sm font-medium text-t-primary">
              {formatTime(timeRemaining)}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="hidden sm:flex p-2 text-t-text-secondary hover:text-t-text hover:bg-t-card-hover rounded-lg transition-colors flex-shrink-0"
          title="View keyboard shortcuts"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3 w-32">
          {volume === 0 ? (
            <VolumeX className="w-5 h-5 text-t-text-secondary" />
          ) : (
            <Volume2 className="w-5 h-5 text-t-text-secondary" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-t-border rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'var(--primary)' }}
          />
        </div>
      </div>

      <SleepTimerModal isOpen={isTimerModalOpen} onClose={() => setIsTimerModalOpen(false)} />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </div>
  );
};
