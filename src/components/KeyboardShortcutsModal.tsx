import React from 'react';
import { X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Spacebar', action: 'Play / Pause current station' },
    { key: 'Up Arrow', action: 'Increase volume' },
    { key: 'Down Arrow', action: 'Decrease volume' },
    { key: 'Right Arrow', action: 'Next station' },
    { key: 'Left Arrow', action: 'Previous station' },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-[var(--overlay)] z-50 transition-opacity"
        onClick={onClose}
        role="presentation"
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-t-card rounded-lg shadow-xl z-50 max-w-sm w-full mx-4 overflow-hidden transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-t-border">
          <h2 className="text-lg font-bold text-t-text">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-t-text-secondary hover:text-t-text transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <kbd className="px-2 py-1 bg-t-bg border border-t-border rounded text-xs font-semibold text-t-text whitespace-nowrap">
                    {shortcut.key}
                  </kbd>
                </div>
                <p className="text-t-text-secondary text-sm pt-1">{shortcut.action}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-t-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary rounded-lg transition-colors font-medium text-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
};
