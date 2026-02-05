import React, { createContext, useContext, useState } from 'react';

type ViewMode = 'grid' | 'list';

interface ViewModeContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const stored = localStorage.getItem('radio-view-mode');
    return (stored as ViewMode) || 'grid';
  });

  const toggleViewMode = () => {
    setViewMode(prev => {
      const newMode = prev === 'grid' ? 'list' : 'grid';
      localStorage.setItem('radio-view-mode', newMode);
      return newMode;
    });
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within ViewModeProvider');
  }
  return context;
};
