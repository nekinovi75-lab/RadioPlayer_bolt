import React, { useRef, useEffect, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../config/themes';

export const ThemeSelector: React.FC = () => {
  const { designSystem, setDesignSystem } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && buttonRef.current && !menuRef.current.contains(event.target as Node) && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex p-2 text-t-text-secondary hover:text-t-text hover:bg-t-card-hover rounded-lg transition-colors"
        title="Theme selector"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-60 bg-t-card border border-t-border rounded-lg shadow-lg z-50"
        >
          <div className="p-2 border-b border-t-border">
            <p className="text-xs font-semibold text-t-text-secondary px-2 py-1 uppercase tracking-wide">Theme</p>
          </div>

          <div className="p-2 space-y-1">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  setDesignSystem(theme.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  designSystem === theme.id
                    ? 'bg-t-primary-subtle'
                    : 'hover:bg-t-card-hover'
                }`}
              >
                <div className="flex gap-1 flex-shrink-0">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.previewBg }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.previewCard }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-t-text">
                    {theme.name}
                  </div>
                  <div className="text-xs text-t-text-secondary truncate">
                    {theme.description}
                  </div>
                </div>
                {designSystem === theme.id && (
                  <Check className="w-4 h-4 text-t-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
