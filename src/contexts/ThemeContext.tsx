import React, { createContext, useContext, useEffect, useState } from 'react';
import type { DesignSystem } from '../config/themes';
import { themes } from '../config/themes';

type ColorMode = 'light' | 'dark';

interface ThemeContextType {
  colorMode: ColorMode;
  designSystem: DesignSystem;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
  setDesignSystem: (system: DesignSystem) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const stored = localStorage.getItem('radio-color-mode');
    return (stored as ColorMode) || 'light';
  });

  const [designSystem, setDesignSystem] = useState<DesignSystem>(() => {
    const stored = localStorage.getItem('radio-design-system');
    if (stored && themes.some(t => t.id === stored)) {
      return stored as DesignSystem;
    }
    return 'blueprint';
  });

  useEffect(() => {
    localStorage.setItem('radio-color-mode', colorMode);
    localStorage.setItem('radio-design-system', designSystem);

    const root = document.documentElement;

    themes.forEach(t => root.classList.remove(`theme-${t.id}`));
    root.classList.remove('light', 'dark');

    root.classList.add(`theme-${designSystem}`, colorMode);
  }, [colorMode, designSystem]);

  const toggleColorMode = () => {
    setColorMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      colorMode,
      designSystem,
      toggleColorMode,
      setColorMode,
      setDesignSystem,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
