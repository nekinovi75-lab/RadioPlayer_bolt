import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useSleepTimer } from '../contexts/SleepTimerContext';
import { getLogoPath } from '../utils/csvParser';
import { Pause, Play, Volume2, VolumeX, Loader2, Clock, HelpCircle } from 'lucide-react';
import { SleepTimerModal } from './SleepTimerModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

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
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="max-w-7xl mx-auto text-center text-gray-400 dark:text-gray-500">
          Select a station to start playing
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-6">
        <div className="relative flex-shrink-0">
          <img
            src={getLogoPath(currentStation.logo)}
            alt={currentStation.stationName}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-contain bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 p-2 shadow-md"
            onError={(e) => {
              e.currentTarget.src = getLogoPath('');
            }}
          />
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {currentStation.stationName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
            {isLoading ? 'Connecting...' : isPlaying ? 'Now Playing' : 'Paused'}
          </p>
          {error && (
            <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>
          )}
        </div>

        <button
          onClick={() => isPlaying ? pause() : playStation(currentStation)}
          disabled={isLoading}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0 touch-manipulation"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setIsTimerModalOpen(true)}
          className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors flex-shrink-0 ${
            isActive
              ? 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-200'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title="Sleep timer"
        >
          <Clock className="w-5 h-5" />
          {isActive && <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>}
        </button>

        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="hidden sm:flex p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          title="View keyboard shortcuts"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3 w-32">
          {volume === 0 ? (
            <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      <SleepTimerModal isOpen={isTimerModalOpen} onClose={() => setIsTimerModalOpen(false)} />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </div>
  );
};
