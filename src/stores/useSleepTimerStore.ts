import { create } from 'zustand';
import { usePlayer } from './usePlayerStore';

let timerInterval: ReturnType<typeof setInterval> | null = null;

const clearTimerInterval = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

interface SleepTimerState {
  timeRemaining: number;
  isActive: boolean;
  setTimer: (durationMinutes: number) => void;
  cancelTimer: () => void;
}

export const useSleepTimer = create<SleepTimerState>()((set, get) => ({
  timeRemaining: 0,
  isActive: false,

  setTimer: (durationMinutes) => {
    clearTimerInterval();

    const totalSeconds = durationMinutes * 60;
    set({ timeRemaining: totalSeconds, isActive: true });

    timerInterval = setInterval(() => {
      const { timeRemaining } = get();
      const newTime = timeRemaining - 1;

      if (newTime <= 0) {
        clearTimerInterval();
        usePlayer.getState().pause();
        set({ timeRemaining: 0, isActive: false });
      } else {
        set({ timeRemaining: newTime });
      }
    }, 1000);
  },

  cancelTimer: () => {
    clearTimerInterval();
    set({ timeRemaining: 0, isActive: false });
  },
}));

