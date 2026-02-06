export type DesignSystem = 'mint' | 'classic' | 'ocean' | 'sunset';

export interface ThemeDefinition {
  id: DesignSystem;
  name: string;
  description: string;
  accentColor: string;
}

export const themes: ThemeDefinition[] = [
  {
    id: 'mint',
    name: 'Mint Wave',
    description: 'Modern, vibrant mint green',
    accentColor: '#00ff88',
  },
  {
    id: 'classic',
    name: 'Classic Blue',
    description: 'Traditional professional blue',
    accentColor: '#3b82f6',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool, calming cyan',
    accentColor: '#06b6d4',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm, energetic orange',
    accentColor: '#f97316',
  },
];

export const getThemeById = (id: DesignSystem): ThemeDefinition => {
  const theme = themes.find(t => t.id === id);
  if (!theme) throw new Error(`Theme ${id} not found`);
  return theme;
};
