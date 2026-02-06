export type DesignSystem = 'blueprint' | 'ember' | 'forest' | 'nightfall';

export interface ThemeDefinition {
  id: DesignSystem;
  name: string;
  description: string;
  accentColor: string;
  previewBg: string;
  previewCard: string;
}

export const themes: ThemeDefinition[] = [
  {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Clean and professional blue',
    accentColor: '#2563eb',
    previewBg: '#dbeafe',
    previewCard: '#ffffff',
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Warm amber and terracotta',
    accentColor: '#d97706',
    previewBg: '#fef3e2',
    previewCard: '#fffbf5',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural earthy greens',
    accentColor: '#16a34a',
    previewBg: '#e8f5e2',
    previewCard: '#f5faf2',
  },
  {
    id: 'nightfall',
    name: 'Nightfall',
    description: 'Cool teal and slate',
    accentColor: '#0891b2',
    previewBg: '#e8f4f8',
    previewCard: '#f0f9fb',
  },
];

export const getThemeById = (id: DesignSystem): ThemeDefinition => {
  const theme = themes.find(t => t.id === id);
  if (!theme) throw new Error(`Theme ${id} not found`);
  return theme;
};
