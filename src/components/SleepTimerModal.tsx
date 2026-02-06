import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSleepTimer } from '../contexts/SleepTimerContext';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({ isOpen, onClose }) => {
  const { setTimer, cancelTimer } = useSleepTimer();
  const [customMinutes, setCustomMinutes] = useState('15');

  if (!isOpen) return null;

  const presets = [15, 30, 45, 60];

  const handlePreset = (minutes: number) => {
    setTimer(minutes);
    onClose();
  };

  const handleCustom = () => {
    const minutes = parseInt(customMinutes, 10);
    if (minutes > 0 && minutes <= 480) {
      setTimer(minutes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-theme-card rounded-xl shadow-2xl max-w-sm w-full transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <h2 className="text-2xl font-bold text-theme-text">Sleep Timer</h2>
          <button
            onClick={onClose}
            className="text-theme-text opacity-40 hover:opacity-70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-theme-text opacity-70 mb-4">
            Playback will stop after the selected duration
          </p>

          <div className="grid grid-cols-2 gap-3">
            {presets.map(minutes => (
              <button
                key={minutes}
                onClick={() => handlePreset(minutes)}
                className="px-4 py-3 bg-primary/20 hover:bg-primary/30 text-primary-dark rounded-lg font-medium transition-colors"
              >
                {minutes} min
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Duration
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="480"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="flex-1 px-3 py-2 border border-theme-border rounded-lg bg-theme-bg text-theme-text focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Minutes"
              />
              <button
                onClick={handleCustom}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Set
              </button>
            </div>
            <p className="mt-1 text-xs text-theme-text opacity-60">
              1 - 480 minutes
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={cancelTimer}
              className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors font-medium"
            >
              Cancel Timer
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-theme-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-theme-bg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
