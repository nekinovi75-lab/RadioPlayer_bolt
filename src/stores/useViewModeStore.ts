import { create } from 'zustand';

type ViewMode = 'grid' | 'list';

interface ViewModeState {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

export const useViewMode = create<ViewModeState>()((set) => ({
  viewMode: (localStorage.getItem('radio-view-mode') as ViewMode) || 'grid',
  toggleViewMode: () =>
    set((state) => {
      const newMode: ViewMode = state.viewMode === 'grid' ? 'list' : 'grid';
      localStorage.setItem('radio-view-mode', newMode);
      return { viewMode: newMode };
    }),
}));

