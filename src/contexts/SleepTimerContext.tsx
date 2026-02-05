import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePlayer } from './PlayerContext';

interface SleepTimerContextType {
  timeRemaining: number;
  isActive: boolean;
  setTimer: (durationMinutes: number) => void;
  cancelTimer: () => void;
}

const SleepTimerContext = createContext<SleepTimerContextType | undefined>(undefined);

export const SleepTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pause } = usePlayer();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          pause();
          setIsActive(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, pause]);

  const setTimer = (durationMinutes: number) => {
    setTimeRemaining(durationMinutes * 60);
    setIsActive(true);
  };

  const cancelTimer = () => {
    setTimeRemaining(0);
    setIsActive(false);
  };

  return (
    <SleepTimerContext.Provider value={{ timeRemaining, isActive, setTimer, cancelTimer }}>
      {children}
    </SleepTimerContext.Provider>
  );
};

export const useSleepTimer = () => {
  const context = useContext(SleepTimerContext);
  if (!context) {
    throw new Error('useSleepTimer must be used within SleepTimerProvider');
  }
  return context;
};
