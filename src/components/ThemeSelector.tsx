import React, { useRef, useEffect, useState } from 'react';
import { Palette, Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../config/themes';

export const ThemeSelector: React.FC = () => {
  const { designSystem, colorMode, setDesignSystem, setColorMode } = useTheme();
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
        className="hidden sm:flex p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-theme-bg rounded-lg transition-colors"
        title="Theme selector"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-56 bg-theme-card border border-theme-border rounded-lg shadow-lg z-50"
        >
          <div className="p-2 border-b border-theme-border">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-2 py-1 uppercase">Design System</p>
          </div>

          <div className="p-2 space-y-1">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  setDesignSystem(theme.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-theme-bg text-left"
              >
                <div
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-theme-text">
                    {theme.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {theme.description}
                  </div>
                </div>
                {designSystem === theme.id && (
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-theme-border p-2">
            <button
              onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-theme-bg text-left"
            >
              {colorMode === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-theme-text">
                    Switch to Dark Mode
                  </span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-theme-text">
                    Switch to Light Mode
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
