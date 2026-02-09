import { create } from 'zustand';
import { RadioStation } from '../utils/csvParser';

// Module-level audio element — lives outside React render cycle
let audio: HTMLAudioElement | null = null;

const getAudio = (): HTMLAudioElement => {
  if (!audio) {
    audio = new Audio();
    const stored = localStorage.getItem('radio-volume');
    audio.volume = stored ? parseFloat(stored) : 0.7;
  }
  return audio;
};

interface PlayerState {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  error: string | null;
  playStation: (station: RadioStation) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
}

export const usePlayer = create<PlayerState>()((set, get) => {
  const audioEl = getAudio();

  audioEl.addEventListener('playing', () => {
    set({ isLoading: false, isPlaying: true, error: null });
  });

  audioEl.addEventListener('pause', () => {
    set({ isPlaying: false });
  });

  audioEl.addEventListener('waiting', () => {
    set({ isLoading: true });
  });

  audioEl.addEventListener('error', () => {
    set({ isLoading: false, isPlaying: false, error: 'Failed to connect to stream' });
  });

  return {
    currentStation: null,
    isPlaying: false,
    isLoading: false,
    volume: audioEl.volume,
    error: null,

    playStation: (station) => {
      const { currentStation, isPlaying } = get();

      set({ error: null });

      if (currentStation?.id === station.id) {
        if (isPlaying) {
          audioEl.pause();
          set({ isPlaying: false });
          return;
        } else {
          audioEl.play().catch(() => {
            set({ error: 'Failed to play stream. Try clicking again.' });
          });
          return;
        }
      }

      set({ isLoading: true, currentStation: station });
      audioEl.src = station.url;
      audioEl.load();

      audioEl.play().catch(() => {
        set({ error: 'Failed to play stream. Try clicking again.', isLoading: false });
      });
    },

    pause: () => {
      audioEl.pause();
    },

    setVolume: (newVolume) => {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      set({ volume: clampedVolume });
      localStorage.setItem('radio-volume', clampedVolume.toString());
      audioEl.volume = clampedVolume;
    },
  };
});

