import { useEffect } from 'react';
import { usePlayer } from '../stores/usePlayerStore';
import { useStations } from '../stores/useStationsStore';

export const useKeyboardShortcuts = () => {
  const { currentStation, isPlaying, playStation, pause, volume, setVolume } = usePlayer();
  const { stations } = useStations();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputElement = ['INPUT', 'TEXTAREA'].includes(
        (e.target as HTMLElement).tagName
      );
      const isContentEditable = (e.target as HTMLElement).contentEditable === 'true';

      if (isInputElement || isContentEditable) {
        return;
      }

      switch (e.code) {
        case 'Space': {
          e.preventDefault();
          if (currentStation) {
            if (isPlaying) {
              pause();
            } else {
              playStation(currentStation);
            }
          }
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          const newVolume = Math.min(1, volume + 0.1);
          setVolume(newVolume);
          break;
        }

        case 'ArrowDown': {
          e.preventDefault();
          const newVolume = Math.max(0, volume - 0.1);
          setVolume(newVolume);
          break;
        }

        case 'ArrowRight': {
          if (!currentStation || stations.length === 0) break;
          const currentIndex = stations.findIndex(s => s.id === currentStation.id);
          if (currentIndex < stations.length - 1) {
            e.preventDefault();
            playStation(stations[currentIndex + 1]);
          }
          break;
        }

        case 'ArrowLeft': {
          if (!currentStation || stations.length === 0) break;
          const currentIndex = stations.findIndex(s => s.id === currentStation.id);
          if (currentIndex > 0) {
            e.preventDefault();
            playStation(stations[currentIndex - 1]);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStation, isPlaying, volume, stations, playStation, pause, setVolume]);
};
