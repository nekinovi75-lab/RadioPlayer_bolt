import React, { createContext, useContext, useRef, useState } from 'react';
import { RadioStation } from '../utils/csvParser';

interface PlayerContextType {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  error: string | null;
  playStation: (station: RadioStation) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const stored = localStorage.getItem('radio-volume');
    return stored ? parseFloat(stored) : 0.7;
  });
  const [error, setError] = useState<string | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    audioRef.current.addEventListener('playing', () => {
      setIsLoading(false);
      setIsPlaying(true);
      setError(null);
    });

    audioRef.current.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    audioRef.current.addEventListener('waiting', () => {
      setIsLoading(true);
    });

    audioRef.current.addEventListener('error', () => {
      setIsLoading(false);
      setIsPlaying(false);
      setError('Failed to connect to stream');
    });
  }

  const playStation = (station: RadioStation) => {
    if (!audioRef.current) return;

    setIsLoading(true);
    setError(null);

    if (currentStation?.id === station.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    audioRef.current.src = station.url;
    audioRef.current.load();

    audioRef.current.play().catch(() => {
      setError('Failed to play stream. Try clicking again.');
      setIsLoading(false);
    });

    setCurrentStation(station);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    localStorage.setItem('radio-volume', clampedVolume.toString());

    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  return (
    <PlayerContext.Provider value={{
      currentStation,
      isPlaying,
      isLoading,
      volume,
      error,
      playStation,
      pause,
      setVolume
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};
