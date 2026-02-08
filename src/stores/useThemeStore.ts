import { create } from 'zustand';
import type { DesignSystem } from '../config/themes';
import { themes } from '../config/themes';

type ColorMode = 'light' | 'dark';

const getInitialColorMode = (): ColorMode => {
  const stored = localStorage.getItem('radio-color-mode');
  return (stored as ColorMode) || 'light';
};

const getInitialDesignSystem = (): DesignSystem => {
  const stored = localStorage.getItem('radio-design-system');
  if (stored && themes.some((t) => t.id === stored)) {
    return stored as DesignSystem;
  }
  return 'blueprint';
};

const applyThemeToDOM = (colorMode: ColorMode, designSystem: DesignSystem) => {
  const root = document.documentElement;
  themes.forEach((t) => root.classList.remove(`theme-${t.id}`));
  root.classList.remove('light', 'dark');
  root.classList.add(`theme-${designSystem}`, colorMode);

  localStorage.setItem('radio-color-mode', colorMode);
  localStorage.setItem('radio-design-system', designSystem);
};

interface ThemeState {
  colorMode: ColorMode;
  designSystem: DesignSystem;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
  setDesignSystem: (system: DesignSystem) => void;
}

export const useTheme = create<ThemeState>()((set, get) => {
  const initialColorMode = getInitialColorMode();
  const initialDesignSystem = getInitialDesignSystem();

  // Apply theme on store creation
  applyThemeToDOM(initialColorMode, initialDesignSystem);

  return {
    colorMode: initialColorMode,
    designSystem: initialDesignSystem,

    toggleColorMode: () => {
      const newMode = get().colorMode === 'light' ? 'dark' : 'light';
      set({ colorMode: newMode });
      applyThemeToDOM(newMode, get().designSystem);
    },

    setColorMode: (mode) => {
      set({ colorMode: mode });
      applyThemeToDOM(mode, get().designSystem);
    },

    setDesignSystem: (system) => {
      set({ designSystem: system });
      applyThemeToDOM(get().colorMode, system);
    },
  };
});

