import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSleepTimer } from '../stores/useSleepTimerStore';
import { toast } from 'sonner';

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
    toast.success('Sleep timer set', {
      description: `Playback will stop in ${minutes} minutes.`
    });
    onClose();
  };

  const handleCustom = () => {
    const minutes = parseInt(customMinutes, 10);
    if (minutes > 0 && minutes <= 480) {
      setTimer(minutes);
      toast.success('Sleep timer set', {
        description: `Playback will stop in ${minutes} minutes.`
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4">
      <div className="bg-t-card rounded-xl shadow-2xl max-w-sm w-full transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-t-border">
          <h2 className="text-2xl font-bold text-t-text">Sleep Timer</h2>
          <button
            onClick={onClose}
            className="text-t-text-secondary hover:text-t-text transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-t-text-secondary mb-4">
            Playback will stop after the selected duration
          </p>

          <div className="grid grid-cols-2 gap-3">
            {presets.map(minutes => (
              <button
                key={minutes}
                onClick={() => handlePreset(minutes)}
                className="px-4 py-3 bg-t-primary-subtle hover:bg-t-primary hover:text-t-text-on-primary text-t-primary rounded-lg font-medium transition-colors"
              >
                {minutes} min
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-t-text-secondary mb-2">
              Custom Duration
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="480"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="flex-1 px-3 py-2 border border-t-border rounded-lg bg-t-bg text-t-text focus:ring-2 focus:ring-t-primary focus:border-transparent"
                placeholder="Minutes"
              />
              <button
                onClick={handleCustom}
                className="px-4 py-2 bg-t-success hover:bg-t-success-hover text-t-text-on-primary rounded-lg font-medium transition-colors"
              >
                Set
              </button>
            </div>
            <p className="mt-1 text-xs text-t-text-secondary">
              1 - 480 minutes
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                cancelTimer();
                toast.info('Sleep timer cancelled');
              }}
              className="flex-1 px-4 py-2 border border-t-danger text-t-danger rounded-lg hover:bg-t-danger-subtle transition-colors font-medium"
            >
              Cancel Timer
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-t-border text-t-text-secondary rounded-lg hover:bg-t-card-hover transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
